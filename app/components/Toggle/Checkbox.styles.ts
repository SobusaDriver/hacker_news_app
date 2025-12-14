import { ImageStyle, StyleProp, ViewStyle } from "react-native"

import { $inputOuterBase } from "./Toggle.styles"

export const $checkboxDetail: ImageStyle = {
  width: 20,
  height: 20,
  resizeMode: "contain",
}

export const $inputOuter: StyleProp<ViewStyle> = [$inputOuterBase, { borderRadius: 4 }]
