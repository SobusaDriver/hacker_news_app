import { renderHook, act, waitFor } from "@testing-library/react-native"
import { BackHandler, Linking } from "react-native"
import { NavigationState } from "@react-navigation/native"
import * as storage from "@/utils/storage"
import {
    getActiveRouteName,
    useBackButtonHandler,
    useNavigationPersistence,
    navigate,
    goBack,
    resetRoot,
    navigationRef,
} from "./navigationUtilities"
import Config from "@/config"

// Mock storage
jest.mock("@/utils/storage", () => ({
    save: jest.fn(),
    load: jest.fn(),
}))

// Mock Config
jest.mock("@/config", () => ({
    persistNavigation: "dev",
}))

// Mock @react-navigation/native
jest.mock("@react-navigation/native", () => {
    return {
        ...jest.requireActual("@react-navigation/native"),
        createNavigationContainerRef: jest.fn(() => ({
            isReady: jest.fn(),
            navigate: jest.fn(),
            resetRoot: jest.fn(),
            goBack: jest.fn(),
            canGoBack: jest.fn(),
            getRootState: jest.fn(),
            current: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        })),
    }
})

describe("navigationUtilities", () => {
    beforeEach(() => {
        jest.clearAllMocks()

            // Setup default mock behaviors
            ; (navigationRef.isReady as jest.Mock).mockReturnValue(true)

        // Helper to spy or use existing mock for BackHandler
        const mockBackHandler = (method: "addEventListener" | "exitApp", impl: any) => {
            if ((BackHandler[method] as any).mock) {
                (BackHandler[method] as jest.Mock).mockImplementation(impl);
            } else {
                jest.spyOn(BackHandler, method).mockImplementation(impl);
            }
        }

        mockBackHandler("addEventListener", () => ({ remove: jest.fn() }))
        mockBackHandler("exitApp", () => { })

        // Helper for Linking
        if ((Linking.getInitialURL as any).mock) {
            (Linking.getInitialURL as jest.Mock).mockResolvedValue(null)
        } else {
            jest.spyOn(Linking, "getInitialURL").mockResolvedValue(null)
        }
    })

    describe("getActiveRouteName", () => {
        it("should return the active route name from state", () => {
            const state = {
                index: 0,
                routes: [{ name: "Home" }],
            } as unknown as NavigationState
            expect(getActiveRouteName(state)).toBe("Home")
        })

        it("should return nested route name", () => {
            const state = {
                index: 0,
                routes: [
                    {
                        name: "Stack",
                        state: {
                            index: 1,
                            routes: [{ name: "Screen1" }, { name: "Screen2" }],
                        },
                    },
                ],
            } as unknown as NavigationState
            expect(getActiveRouteName(state)).toBe("Screen2")
        })
    })

    describe("useBackButtonHandler", () => {
        it("should handle back press and exit app if canExit returns true", () => {
            const canExit = jest.fn(() => true)
                ; (navigationRef.isReady as jest.Mock).mockReturnValue(true)
                ; (navigationRef.getRootState as jest.Mock).mockReturnValue({
                    index: 0,
                    routes: [{ name: "Home" }],
                })

            // We need to capture the listener
            let backHandlerCallback: () => boolean | null | undefined
            const addListenerImpl = (event: string, callback: () => boolean | null | undefined) => {
                if (event === 'hardwareBackPress') backHandlerCallback = callback
                return { remove: jest.fn() }
            }

            if ((BackHandler.addEventListener as any).mock) {
                (BackHandler.addEventListener as jest.Mock).mockImplementation(addListenerImpl)
            } else {
                jest.spyOn(BackHandler, "addEventListener").mockImplementation(addListenerImpl)
            }

            renderHook(() => useBackButtonHandler(canExit))

            act(() => {
                const result = backHandlerCallback()
                expect(result).toBe(true)
            })

            expect(BackHandler.exitApp).toHaveBeenCalled()
        })

        it("should go back if canExit returns false and canGoBack is true", () => {
            const canExit = jest.fn(() => false)
                ; (navigationRef.isReady as jest.Mock).mockReturnValue(true)
                ; (navigationRef.getRootState as jest.Mock).mockReturnValue({
                    index: 0,
                    routes: [{ name: "Details" }],
                })
                ; (navigationRef.canGoBack as jest.Mock).mockReturnValue(true)

            let backHandlerCallback: () => boolean | null | undefined
            const addListenerImpl = (event: string, callback: () => boolean | null | undefined) => {
                if (event === 'hardwareBackPress') backHandlerCallback = callback
                return { remove: jest.fn() }
            }

            if ((BackHandler.addEventListener as any).mock) {
                (BackHandler.addEventListener as jest.Mock).mockImplementation(addListenerImpl)
            } else {
                jest.spyOn(BackHandler, "addEventListener").mockImplementation(addListenerImpl)
            }

            renderHook(() => useBackButtonHandler(canExit))

            act(() => {
                const result = backHandlerCallback()
                expect(result).toBe(true)
            })

            expect(navigationRef.goBack).toHaveBeenCalled()
        })
    })

    describe("useNavigationPersistence", () => {
        it("should load initial state from storage", async () => {
            const storedState = { index: 0, routes: [{ name: "Home" }] }
                ; (storage.load as jest.Mock).mockResolvedValue(storedState)

            if ((Linking.getInitialURL as any).mock) {
                (Linking.getInitialURL as jest.Mock).mockResolvedValue(null)
            } else {
                jest.spyOn(Linking, "getInitialURL").mockResolvedValue(null)
            }

            const { result } = renderHook(() => useNavigationPersistence(storage as any, "nav-key"))

            await waitFor(() => {
                expect(result.current.isRestored).toBe(true)
            })

            expect(result.current.initialNavigationState).toEqual(storedState)
        })

        it("should save state change", () => {
            const { result } = renderHook(() => useNavigationPersistence(storage as any, "nav-key"))

            const state = { index: 0, routes: [{ name: "NewScreen" }] } as any

            act(() => {
                result.current.onNavigationStateChange(state)
            })

            expect(storage.save).toHaveBeenCalledWith("nav-key", state)
        })
    })

    describe("Helper functions", () => {
        it("navigate should call navigationRef.navigate when ready", () => {
            navigate("Home")
            expect(navigationRef.navigate).toHaveBeenCalledWith("Home" as never, undefined as never)
        })

        it("goBack should call navigationRef.goBack when ready and canGoBack", () => {
            ; (navigationRef.canGoBack as jest.Mock).mockReturnValue(true)
            goBack()
            expect(navigationRef.goBack).toHaveBeenCalled()
        })

        it("resetRoot should call navigationRef.resetRoot", () => {
            resetRoot()
            expect(navigationRef.resetRoot).toHaveBeenCalled()
        })
    })
})
