import { TextStyle, ViewStyle } from "react-native"

import { ThemedStyle, ThemedStyleArray } from "@/theme/types"

export const $wrapper: ViewStyle = {
  height: 56,
  alignItems: "center",
  justifyContent: "space-between",
}

export const $container: ViewStyle = {
  width: "100%",
}

export const $title: TextStyle = {
  textAlign: "center",
}

export const $actionTextContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing.md,
  zIndex: 2,
})

export const $actionText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})

export const $actionIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing.md,
  zIndex: 2,
})

export const $actionFillerContainer: ViewStyle = {
  width: 16,
}

export const $titleWrapperPointerEvents: ViewStyle = {
  pointerEvents: "none",
}

export const $titleWrapperCenter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  position: "absolute",
  paddingHorizontal: spacing.xxl,
  zIndex: 1,
})

export const $titleWrapperFlex: ViewStyle = {
  justifyContent: "center",
  flexGrow: 1,
}
