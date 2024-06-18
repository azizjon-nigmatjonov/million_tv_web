import { useState, useEffect } from 'react'

export const useIsMobile = (width = 1100) => {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (window) {
            setIsMobile(window.innerWidth < width)
            window.addEventListener('resize', () => {
                setIsMobile(window.innerWidth < width)
            })
        }
    })
    return [isMobile, setIsMobile]
}
