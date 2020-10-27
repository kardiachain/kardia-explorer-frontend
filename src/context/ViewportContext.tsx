import React from 'react'
interface ViewportContext {
    width: number;
    height: number;
}
const viewportContext = React.createContext({} as ViewportContext);

export const ViewportProvider = ({ children }: { children: any }) => {
    // This is the exact same logic that we previously had in our hook

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

    /* Now we are dealing with a context instead of a Hook, so instead
       of returning the width and height we store the values in the
       value of the Provider */
    return (
        <viewportContext.Provider value={{ width, height }}>
            {children}
        </viewportContext.Provider>
    );
};

/* Rewrite the "useViewport" hook to pull the width and height values
   out of the context instead of calculating them itself */
export const useViewport = (mobileBreakpoint?: number) => {
    /* We can use the "useContext" Hook to acccess a context from within
       another Hook, remember, Hooks are composable! */

    const BREAKPOINT = mobileBreakpoint || 992;
    const { width, height } = React.useContext(viewportContext);
    return { width, height, isMobile: width < BREAKPOINT };
}