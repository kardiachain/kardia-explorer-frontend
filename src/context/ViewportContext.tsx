import React from 'react'
interface ViewportContext {
    width: number;
    height: number;
}
const viewportContext = React.createContext({} as ViewportContext);

export const ViewportProvider = ({ children }: { children: any }) => {

    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);

    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    React.useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (
        <viewportContext.Provider value={{ width, height }}>
            {children}
        </viewportContext.Provider>
    );
};

export const useViewport = (mobileBreakpoint?: number) => {

    const BREAKPOINT = mobileBreakpoint || 992;
    const { width, height } = React.useContext(viewportContext);
    return { width, height, isMobile: width < BREAKPOINT };
}