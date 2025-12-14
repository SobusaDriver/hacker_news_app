import { TextStyle, ViewStyle } from "react-native"

export const $container: ViewStyle = {
  padding: 16,
  backgroundColor: "white",
}

export const $content: ViewStyle = {
  flex: 1,
}

export const $title: TextStyle = {
  fontWeight: "bold",
  marginBottom: 4,
}

export const $subtitle: TextStyle = {
  color: "#666",
}

export const $rightAction: ViewStyle = {
  justifyContent: "center",
  alignItems: "flex-end",
  paddingHorizontal: 20,
  height: "100%",
}

export const $actionText: TextStyle = {
  color: "white",
  fontWeight: "bold",
}
