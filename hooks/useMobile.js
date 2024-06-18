import { useState, useEffect, useMemo } from 'react'
export const useMobile = (status) => {
    const defaultWidth = useMemo(() => {
        switch (status) {
            case 'minDesktop':
                return 1200
            case 'tablet':
                return 1100
            case 'ipod':
                return 1030
            case 'mobile':
                return 768
            default:
                return 540
        }
    }, [status])

    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (window) {
            setIsMobile(window.innerWidth < defaultWidth)
            window.addEventListener('resize', () => {
                setIsMobile(window.innerWidth < defaultWidth)
            })
        }
    }, [defaultWidth])
    return isMobile
}
