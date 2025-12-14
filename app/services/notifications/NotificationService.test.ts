import * as BackgroundTask from "expo-background-task"
import * as Notifications from "expo-notifications"
import * as TaskManager from "expo-task-manager"

import { initNotifications, backgroundTaskExecutor } from "./NotificationService"
import { storage } from "../../utils/storage"
import { hnApi } from "../api/hnApi"

// Mock dependencies
jest.mock("../api/hnApi")
jest.mock("../../utils/storage")

describe("NotificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("initNotifications", () => {
    it("requests permissions if not determined", async () => {
      ;(Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "undetermined",
      })
      ;(Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" })

      await initNotifications()

      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled()
      expect(BackgroundTask.registerTaskAsync).toHaveBeenCalled()
    })

    it("registers task if permission granted", async () => {
      ;(Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" })

      await initNotifications()

      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled()
      expect(BackgroundTask.registerTaskAsync).toHaveBeenCalledWith(
        "background-fetch-news",
        expect.any(Object),
      )
    })
  })

  describe("backgroundTaskExecutor", () => {
    it("executes successfully with new articles", async () => {
      // Setup state
      ;(storage.getNumber as jest.Mock).mockReturnValue(1000)
      ;(storage.getString as jest.Mock).mockReturnValue(
        JSON.stringify({
          state: { preferences: { keywords: ["mobile"], notificationsEnabled: true } },
        }),
      )
      ;(hnApi.getMobileArticles as jest.Mock).mockResolvedValue({
        kind: "ok",
        articles: [{ objectID: "1", title: "New", created_at_i: 2000, url: "http://test" }],
      })

      const result = await backgroundTaskExecutor()

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled()
      expect(result).toBe("success") // Mocked value from setup.ts
    })

    it("does nothing if notifications disabled", async () => {
      ;(storage.getString as jest.Mock).mockReturnValue(
        JSON.stringify({
          state: { preferences: { keywords: ["mobile"], notificationsEnabled: false } },
        }),
      )

      const result = await backgroundTaskExecutor()

      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled()
      expect(hnApi.getMobileArticles).not.toHaveBeenCalled()
      expect(result).toBe("success")
    })

    it("handles errors gracefully", async () => {
      ;(storage.getNumber as jest.Mock).mockImplementation(() => {
        throw new Error("Storage fail")
      })

      const result = await backgroundTaskExecutor()

      expect(result).toBe("failed")
    })
  })
})
