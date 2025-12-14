import { TextStyle, ViewStyle } from "react-native"

import { ThemedStyle } from "@/theme/types"

export const $inputWrapper: ViewStyle = {
  alignItems: "center",
}

export const $inputOuterBase: ViewStyle = {
  height: 24,
  width: 24,
  borderWidth: 2,
  alignItems: "center",
  overflow: "hidden",
  flexGrow: 0,
  flexShrink: 0,
  justifyContent: "space-between",
  flexDirection: "row",
}

export const $helper: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

export const $label: TextStyle = {
  flex: 1,
}

export const $labelRight: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginStart: spacing.md,
})

export const $labelLeft: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginEnd: spacing.md,
})
