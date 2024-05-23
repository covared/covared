import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
    userId: number;
    isFullScreen: boolean;
    contextVariable: string;
    email: string;
    setUserId: (userId: number) => void;
    toggleFullScreen: () => void;
    setContextVariable: (contextVariable: string) => void;
    setEmail: (contextVariable: string) => void;
}

interface AppProviderProps {
    children: React.ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppProvider");
    }
    return context;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<number>(0);
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [contextVariable, setContextVariable] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <AppContext.Provider value={{ userId, isFullScreen, contextVariable, email,
            setUserId, toggleFullScreen, setContextVariable, setEmail }}>
            {children}
        </AppContext.Provider>
    );
}
