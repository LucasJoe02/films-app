import { create } from 'zustand'


interface AuthState {
    userToken: string;
    userId: string;
    setUserToken: (token: string) => void;
    setUserId: (userId: string) => void;
}

const getLocalAuth = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string)
const setLocalAuth = (key: string, value:string) => window.localStorage.setItem(key, JSON.stringify(value))

const AuthStore = create<AuthState>((set) => ({
    userToken: getLocalAuth('userToken') || "",
    userId: getLocalAuth('userId') || "0",
    setUserToken: (userToken: string) => set(() => {
        setLocalAuth('userToken', userToken)
        return {userToken: userToken}
    }),
    setUserId: (userId: string) => set(() => {
        setLocalAuth('userId', userId)
        return {userId: userId}
    }),
}));

export default AuthStore;