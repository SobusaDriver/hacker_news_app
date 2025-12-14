import * as Localization from "expo-localization"
import { I18nManager } from "react-native"
import i18n from "i18next"

// Mock dependencies
jest.mock("expo-localization", () => ({
    getLocales: jest.fn(),
}))

jest.mock("react-native", () => ({
    I18nManager: {
        allowRTL: jest.fn(),
        forceRTL: jest.fn(),
        swapLeftAndRightInRTL: jest.fn(),
        isRTL: false,
    },
    Platform: { OS: "ios" }
}))

jest.mock("react-i18next", () => ({
    initReactI18next: { type: "3rdParty", init: jest.fn() },
}))

jest.mock("i18next", () => ({
    use: jest.fn().mockReturnThis(),
    init: jest.fn(),
}))

describe("i18n", () => {
    // Helper to ensure safe mock access
    const getMockLocales = () => Localization.getLocales as jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        // Provide a safe default to prevent crash on require if mocks are cleared
        getMockLocales().mockReturnValue([{ languageTag: "en-US", textDirection: "ltr" }])
    })

    const loadI18nMixin = () => require("./index")

    it("defaults to en-US if no supported locale found", async () => {
        // Setup specific return for this test
        getMockLocales().mockReturnValue([{ languageTag: "fr-FR", textDirection: "ltr" }])

        let i18nModule: any
        jest.isolateModules(() => {
            i18nModule = loadI18nMixin()
        })

        await i18nModule.initI18n()

        // Check init was called with fallback
        expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
            lng: "en-US",
            fallbackLng: "en-US"
        }))
        expect(I18nManager.allowRTL).toHaveBeenCalledWith(false)
        expect(i18nModule.isRTL).toBe(false)
    })

    it("picks supported locale (es)", async () => {
        getMockLocales().mockReturnValue([{ languageTag: "es-ES", textDirection: "ltr" }])

        let i18nModule: any
        jest.isolateModules(() => {
            i18nModule = loadI18nMixin()
        })

        await i18nModule.initI18n()

        // Should pick based on finding 'es' in supported tags
        // The logic in index.ts: systemTagMatchesSupportedTags checks primaryTag 'es' included in keys {en, es}
        expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({
            lng: "es-ES"
        }))
    })

    it("enables RTL for RTL locales", () => {
        getMockLocales().mockReturnValue([{ languageTag: "en-US", textDirection: "rtl" }])

        let i18nModule: any
        jest.isolateModules(() => {
            i18nModule = loadI18nMixin()
        })

        expect(I18nManager.allowRTL).toHaveBeenCalledWith(true)
        expect(i18nModule.isRTL).toBe(true)
    })

    it("initializes i18n correctly", async () => {
        getMockLocales().mockReturnValue([{ languageTag: "en-US", textDirection: "ltr" }])

        let i18nModule: any
        jest.isolateModules(() => {
            i18nModule = loadI18nMixin()
        })

        await i18nModule.initI18n()
        expect(i18n.use).toHaveBeenCalled()
        expect(i18n.init).toHaveBeenCalled()
    })
})
