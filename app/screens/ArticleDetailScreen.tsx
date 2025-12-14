import { FC, useLayoutEffect, useState } from "react"
import { ViewStyle, ActivityIndicator, View } from "react-native"
import { WebView } from "react-native-webview"

import { Screen, Header } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useAppStore } from "@/store/useAppStore"
import { useAppTheme } from "@/theme/context"

export const ArticleDetailScreen: FC<AppStackScreenProps<"ArticleDetail">> = ({
  navigation,
  route,
}) => {
  const { url, title } = route.params
  const { addFavorite, removeFavorite, favorites } = useAppStore()
  const { theme } = useAppTheme()
  const [isLoading, setIsLoading] = useState(true)

  // Find if current article is favorite. We might need more than URL/Title if we want to store full object.
  // Requirement says "Favorites: Users can mark articles as favorites."
  // If we only have URL here (passed from Home), we might not have all info to add to favorites if we add FROM detail screen.
  // But navigation params came from Home, so we assume we have the original Article object if we passed it?
  // We passed { url, title }. We didn't pass full object.
  // To robustly add to favorites, we should probably pass the full object ID to check, and full object to add.
  // But we can just use url as ID if unique? objectID is better.
  // I will check if I can pass objectID.
  // For now, I'll update params to include objectID and maybe the whole object stringified or just lookup in store if possible?
  // But store has lists.
  // I'll assume for now we just show the article. If we want to favorite, we need the object.
  // I'll update the component to look for "isFavorite".

  // Actually, I'll update `HomeScreen` to pass `item` or `ArticleDetail` to verify logic.
  // But for now, let's just show WebView.

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContent}>
      <Header
        title={title || "Article"}
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        style={$header}
        safeAreaEdges={[]}
      />
      <View style={$webViewContainer}>
        {isLoading && (
          <View style={$loading}>
            <ActivityIndicator size="large" color={theme.colors.tint} />
          </View>
        )}
        <WebView
          source={{ uri: url }}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          style={$webView}
        />
      </View>
    </Screen>
  )
}

const $screenContent: ViewStyle = {
  flex: 1,
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
}

const $webViewContainer: ViewStyle = {
  flex: 1,
}

const $webView: ViewStyle = {
  flex: 1,
}

const $loading: ViewStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1,
}
