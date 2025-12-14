import { Platform } from "react-native"
import * as BackgroundTask from "expo-background-task"
import * as Notifications from "expo-notifications"
import * as TaskManager from "expo-task-manager"

import { storage } from "../../utils/storage"
import { hnApi } from "../api/hnApi"

const BACKGROUND_FETCH_TASK = "background-fetch-news"

// Configure notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export const initNotifications = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    return
  }

  // Register background fetch
  registerBackgroundFetchAsync()
}

async function registerBackgroundFetchAsync() {
  return BackgroundTask.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
  })
}

// Define the task executor separately for testing
export const backgroundTaskExecutor = async () => {
  try {
    const lastFetchTime = storage.getNumber("lastNotificationFetchTime") || Date.now()
    const preferencesJson = storage.getString("hacker-news-storage")

    let keywords: string[] = []
    let notificationsEnabled = true

    if (preferencesJson) {
      const parsed = JSON.parse(preferencesJson)
      if (parsed.state && parsed.state.preferences) {
        keywords = parsed.state.preferences.keywords || []
        notificationsEnabled = parsed.state.preferences.notificationsEnabled
      }
    }

    if (!notificationsEnabled || keywords.length === 0) {
      return BackgroundTask.BackgroundTaskResult.Success
    }

    const query = keywords.join(" OR ")
    const result = await hnApi.getMobileArticles(query)

    if (result.kind === "ok") {
      const newArticles = result.articles.filter((a) => {
        const apiTimestamp = a.created_at_i * 1000
        return apiTimestamp > lastFetchTime
      })

      if (newArticles.length > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "New Articles Found",
            body: `Found ${newArticles.length} new articles matching your interests.`,
            data: { url: newArticles[0].url || newArticles[0].story_url },
          },
          trigger: null,
        })

        storage.set("lastNotificationFetchTime", Date.now())
        return BackgroundTask.BackgroundTaskResult.Success
      }
    }

    return BackgroundTask.BackgroundTaskResult.Success
  } catch (error) {
    return BackgroundTask.BackgroundTaskResult.Failed
  }
}

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, backgroundTaskExecutor)
