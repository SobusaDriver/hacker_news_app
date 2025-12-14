import { FC, useEffect, useState } from "react"
import { FlatList, RefreshControl, View, ViewStyle } from "react-native"

import { Screen, Text, Header, SwipeableArticleCard } from "@/components"
import { AppTabScreenProps } from "@/navigators/navigationTypes"
import { hnApi } from "@/services/api/hnApi"
import { HnArticle } from "@/services/api/hnTypes"
import { useAppStore } from "@/store/useAppStore"
import { useAppTheme } from "@/theme/context"

export const HomeScreen: FC<AppTabScreenProps<"Home">> = ({ navigation }) => {
  const { articles, deletedIds, setArticles, deleteArticle, isOffline, setOfflineStatus } =
    useAppStore()

  const [refreshing, setRefreshing] = useState(false)
  const { theme } = useAppTheme()

  const fetchArticles = async () => {
    setRefreshing(true)
    const result = await hnApi.getMobileArticles()
    setRefreshing(false)

    if (result.kind === "ok") {
      setArticles(result.articles)
      setOfflineStatus(false)
    } else {
      // Assuming failure might mean offline or api error
      // In a real app we might check NetInfo here.
      // For now we just keep existing articles.
      // If we had a way to detect offline, we'd setOfflineStatus(true)
      console.tron?.log?.("Failed to fetch articles")
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const visibleArticles = articles.filter((a) => !deletedIds.includes(a.objectID))

  const handlePress = (article: HnArticle) => {
    if (article.story_url || article.url) {
      const articleInfo = {
        url: article.url || article.story_url,
        title: article.title || article.story_title,
        author: article.author,
      }
      console.log("Navigating to Article - Details:", JSON.stringify(articleInfo, null, 2))

      navigation.navigate("ArticleDetail", {
        url: article.story_url || article.url,
        title: article.story_title || article.title,
      })
    }
  }

  const renderItem = ({ item }: { item: HnArticle }) => {
    return (
      <SwipeableArticleCard
        article={item}
        onPress={handlePress}
        onSwipeLeft={(article) => deleteArticle(article.objectID)}
        rightActionLabel="Delete"
        rightActionColor="red"
      />
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContent}>
      <Header title="Hacker News App" style={$header} safeAreaEdges={[]} />

      <FlatList
        data={visibleArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.objectID}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchArticles} />}
        contentContainerStyle={$listContent}
        ListEmptyComponent={
          <View style={$emptyState}>
            <Text text={refreshing ? "Loading..." : "No articles found"} />
          </View>
        }
        ItemSeparatorComponent={() => <View style={$separator} />}
      />
    </Screen>
  )
}

const $screenContent: ViewStyle = {
  flex: 1,
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
}

const $listContent: ViewStyle = {
  paddingBottom: 20,
}

const $emptyState: ViewStyle = {
  padding: 20,
  alignItems: "center",
}

const $separator: ViewStyle = {
  height: 1,
  backgroundColor: "#ccc",
}
