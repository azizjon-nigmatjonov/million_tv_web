import React, { useMemo } from 'react'
import { useTranslation } from 'i18n'
import DesktopFooter from './DesktopFooter'
import MobileFooter from './MobileFooter'
import { useMobile } from 'hooks/useMobile'

function Footer({ categories }) {
    const mobile = useMobile('mobile')
    const Links = useMemo(() => {
        if (!categories?.length) return []
        const newArray = categories?.map((item) => ({
            ...item,
            link:
                item.slug === 'integration'
                    ? `/premier?category=${item.id}`
                    : `/movies/${item.id}`,
        }))
        const addition = [
            { title: 'selected', link: '/selected' },
            { title: 'tv_channels', link: '/tv' },
        ]
        return [{ title: 'Home', link: '/' }, ...newArray, ...addition]
    }, [categories])

    return (
        <div className="mt-10">
            {mobile ? (
                <MobileFooter Links={Links} />
            ) : (
                <DesktopFooter Links={Links} />
            )}
        </div>
    )
}
export default Footer
