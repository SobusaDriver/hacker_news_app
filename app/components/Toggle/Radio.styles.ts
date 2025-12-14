import { StyleProp, ViewStyle } from "react-native"

import { $inputOuterBase } from "./Toggle.styles"

export const $radioDetail: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 6,
}

export const $inputOuter: StyleProp<ViewStyle> = [$inputOuterBase, { borderRadius: 12 }]
