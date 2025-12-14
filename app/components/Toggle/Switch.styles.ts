import { ImageStyle, StyleProp, ViewStyle } from "react-native"

import { ThemedStyle } from "@/theme/types"

import { $inputOuterBase } from "./Toggle.styles"

export const $inputOuter: StyleProp<ViewStyle> = [
  $inputOuterBase,
  { height: 32, width: 56, borderRadius: 16, borderWidth: 0 },
]

export const $switchInner: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.transparent,
  position: "absolute",
  paddingStart: 4,
  paddingEnd: 4,
})

// Note: We need to define inputDetailStyle type or import it.
// To avoid circular dependency or complex types, we can use ViewStyle for now or import SwitchToggleProps if needed.
// However, styles files should preferably be simple.
export const $switchDetail: ViewStyle = {
  borderRadius: 12,
  position: "absolute",
  width: 24,
  height: 24,
}

export const $switchAccessibility: ViewStyle = {
  width: "40%",
  justifyContent: "center",
  alignItems: "center",
}

export const $switchAccessibilityIcon: ImageStyle = {
  width: 14,
  height: 14,
  resizeMode: "contain",
}

export const $switchAccessibilityLine: ViewStyle = {
  width: 2,
  height: 12,
}

export const $switchAccessibilityCircle: ViewStyle = {
  borderWidth: 2,
  width: 12,
  height: 12,
  borderRadius: 6,
}
