import { ImageStyle, TextStyle } from "react-native"

import { ThemedStyle } from "@/theme/types"

export const $image: ImageStyle = { alignSelf: "center" }
export const $heading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  paddingHorizontal: spacing.lg,
})
export const $content: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  paddingHorizontal: spacing.lg,
})
