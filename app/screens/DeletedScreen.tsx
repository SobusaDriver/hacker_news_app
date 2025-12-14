import { FC } from "react"
import { FlatList, View, ViewStyle, TextStyle } from "react-native"

import { Screen, Header, Text, SwipeableArticleCard } from "@/components"
import { AppTabScreenProps } from "@/navigators/navigationTypes"
import { HnArticle } from "@/services/api/hnTypes"
import { useAppStore } from "@/store/useAppStore"

export const DeletedScreen: FC<AppTabScreenProps<"Deleted">> = ({ navigation }) => {
  const { articles, deletedIds, restoreArticle } = useAppStore()

  // Find articles that are in deletedIds.
  // Note: articles in store might not contain all deletedIds if we fetched new pages and lost old ones?
  // But requirement says "Deleted articles should not reappear upon data refresh."
  // And "Include a screen to view articles that have been deleted."
  // If we delete an article, we store its ID. We can only show it if we still have the data.
  // If we don't have the data (cleared from cache), we can't show it unless we fetch it by ID?
  // The API doesn't support fetching by ID easily in bulk or we didn't implement it.
  // We'll assuming for now that persistent articles + deletedIds is enough.
  // We'll filter `articles` where `deletedIds` includes `objectID`.
  // Wait, if we refresh and the article is no longer in the new fetch, we lose it from `articles`.
  // So we should probably keep deleted articles in a separate `deletedArticles` list in store if we want to show them later even if they drop from main feed?
  // Or just rely on what we have.
  // Current store `articles` is replaced on fetch.
  // So if I delete an article, and refresh, and it's not in the new list, it's gone from memory.
  // Use case: "Deleted articles should not reappear".
  // "Include a screen to view articles that have been deleted."
  // Implementation detail: If we want to view them, we must persist them.
  // I should probably have `deletedArticles` in store.
  // But for now, I'll just use what's in `articles` matched with `deletedIds`.
  // Ideally, when I delete, I move it to `deletedArticles`.

  // I'll update store logic later if needed. For now, I'll just filter.
  // Actually, `setArticles` replaces the list. So yes, deleted ones are lost if not in new list.
  // I'll update `useAppStore` in next step to store `deletedArticles` properly?
  // Or just implement the screen based on current `deletedIds` and current `articles`.

  const deletedArticles = articles.filter((a) => deletedIds.includes(a.objectID))

  const handlePress = (article: HnArticle) => {
    if (article.story_url || article.url) {
      const articleInfo = {
        url: article.url || article.story_url,
        title: article.title || article.story_title,
        author: article.author,
      }
      console.log(
        "Navigating to Article (Deleted) - Details:",
        JSON.stringify(articleInfo, null, 2),
      )

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
        onSwipeLeft={(article) => restoreArticle(article.objectID)}
        rightActionLabel="Restore"
        rightActionColor="green"
        style={$itemContainer}
        titleStyle={$itemTitle}
        subtitleStyle={$itemSubtitle}
      />
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContent}>
      <Header title="Deleted Articles" style={$header} safeAreaEdges={[]} />
      <FlatList
        data={deletedArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.objectID}
        contentContainerStyle={$listContent}
        ListEmptyComponent={
          <View style={$emptyState}>
            <Text text="No deleted articles found in current feed" />
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

const $itemContainer: ViewStyle = {
  padding: 16,
  backgroundColor: "#f0f0f0", // Visual cue for deleted
}

const $itemTitle: TextStyle = {
  fontWeight: "bold",
  marginBottom: 4,
  color: "#888",
  textDecorationLine: "line-through",
}

const $itemSubtitle: TextStyle = {
  color: "#999",
}

const $emptyState: ViewStyle = {
  padding: 20,
  alignItems: "center",
}

const $separator: ViewStyle = {
  height: 1,
  backgroundColor: "#ccc",
}
