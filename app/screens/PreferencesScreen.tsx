import { FC, useState } from "react"
import { View, Switch, ViewStyle, TextStyle, TextInput } from "react-native"

import { Screen, Header, Text, Button } from "@/components"
import { AppTabScreenProps } from "@/navigators/navigationTypes"
import { useAppStore } from "@/store/useAppStore"

export const PreferencesScreen: FC<AppTabScreenProps<"Preferences">> = ({ navigation }) => {
  const { preferences, setPreferences, clearDeletedArticles, clearCachedArticles, deletedIds, articles } = useAppStore()
  const [keywordInput, setKeywordInput] = useState(preferences.keywords.join(", "))

  const handleSave = () => {
    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
    setPreferences({ keywords })
    // In a real app we might trigger a background fetch update or something
    navigation.goBack()
  }

  const handleClearDeleted = () => {
    clearDeletedArticles()
  }

  const handleClearCache = () => {
    clearCachedArticles()
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$screenContent}>
      <Header title="Preferences" style={$header} safeAreaEdges={[]} />

      <View style={$section}>
        <Text text="Notifications" preset="heading" size="md" />
        <View style={$row}>
          <Text text="Enable Notifications" />
          <Switch
            value={preferences.notificationsEnabled}
            onValueChange={(val) => setPreferences({ notificationsEnabled: val })}
          />
        </View>
      </View>

      <View style={$section}>
        <Text text="Keywords (comma separated)" preset="heading" size="md" />
        <Text text="Receive notifications for these keywords:" size="xs" style={$hint} />
        <TextInput
          style={$input}
          value={keywordInput}
          onChangeText={setKeywordInput}
          placeholder="mobile, android, ios"
        />
      </View>

      <Button text="Save" onPress={handleSave} style={$button} />

      <View style={$section}>
        <Text text="Data Management" preset="heading" size="md" />

        <Button
          text={`Clear Deleted Articles (${deletedIds.length})`}
          onPress={handleClearDeleted}
          style={$dangerButton}
          preset="reversed"
        />

        <Button
          text={`Clear Cached Articles (${articles.length})`}
          onPress={handleClearCache}
          style={$dangerButton}
          preset="reversed"
        />
      </View>
    </Screen>
  )
}

const $screenContent: ViewStyle = {
  flex: 1,
  padding: 16,
}

const $header: ViewStyle = {
  paddingHorizontal: 0,
  marginBottom: 20,
}

const $section: ViewStyle = {
  marginBottom: 24,
}

const $row: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
}

const $hint: TextStyle = {
  marginBottom: 8,
  color: "#666",
}

const $input: TextStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  borderRadius: 8,
  fontSize: 16,
  minHeight: 50,
}

const $button: ViewStyle = {
  marginTop: 20,
}

const $dangerButton: ViewStyle = {
  marginTop: 12,
  backgroundColor: "#dc3545",
}
