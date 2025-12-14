import React, { FC } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { formatDistanceToNow } from "date-fns"
import ReanimatedSwipeable, {
  SwipeDirection,
} from "react-native-gesture-handler/ReanimatedSwipeable"

import { HnArticle } from "@/services/api/hnTypes"

import {
  $actionText,
  $container,
  $content,
  $rightAction,
  $subtitle,
  $title,
} from "./SwipeableArticleCard.styles"
import { Text } from "./Text"

export interface SwipeableArticleCardProps {
  article: HnArticle
  onPress: (article: HnArticle) => void
  onSwipeLeft?: (article: HnArticle) => void
  onSwipeRight?: (article: HnArticle) => void
  leftActionLabel?: string
  rightActionLabel?: string
  leftActionColor?: string
  rightActionColor?: string
  style?: ViewStyle
  titleStyle?: TextStyle
  subtitleStyle?: TextStyle
}

export const SwipeableArticleCard: FC<SwipeableArticleCardProps> = ({
  article,
  onPress,
  onSwipeLeft,
  onSwipeRight,
  leftActionLabel,
  rightActionLabel,
  leftActionColor,
  rightActionColor,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const title = article.story_title || article.title
  const author = article.author
  const date = article.created_at
    ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true })
    : ""

  const renderRightActions = () => {
    if (!rightActionLabel && !onSwipeLeft) return null

    if (!onSwipeLeft) return null

    return (
      <View style={[$rightAction, { backgroundColor: rightActionColor || "red" }]}>
        <Text style={$actionText} text={rightActionLabel || "Delete"} />
      </View>
    )
  }

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={onSwipeLeft ? renderRightActions : undefined}
      onSwipeableOpen={(direction) => {
        if (direction === SwipeDirection.LEFT && onSwipeLeft) {
          onSwipeLeft(article)
        } else if (direction === SwipeDirection.RIGHT && onSwipeRight) {
          onSwipeRight(article)
        }
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(article)}
        style={[$container, style]}
      >
        <View style={$content}>
          <Text text={title} style={[$title, titleStyle]} />
          <Text text={`${author} - ${date} `} size="xs" style={[$subtitle, subtitleStyle]} />
        </View>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  )
}
