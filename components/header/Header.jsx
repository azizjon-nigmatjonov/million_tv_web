import { useEffect, useMemo, useState } from 'react'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'
import cls from './styles.module.scss'
const Header = ({
    categories,
    profile,
    notifications,
    notificationsUnread,
}) => {
    const [searchOpen, setSearchOpen] = useState(false)
    const [navbarActive, setNavbarActive] = useState(false)

    const changeBackground = () => {
        if (window.scrollY >= 96) {
            setNavbarActive(true)
        } else {
            setNavbarActive(false)
        }
    }

    const Links = useMemo(() => {
        const array = [
            { title: 'Home', link: '/' },
            { title: 'catalog', link: '/catalog' },
            { title: 'tv_channels', link: '/tv' },
        ]
        return array
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', changeBackground)
    }, [])

    return (
        <div id="header" className="sticky top-0 z-[99]">
            <div className="mobile-header">
                <MobileHeader
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                    categories={categories ? categories : []}
                    profile={profile?.customer}
                    navbarActive={navbarActive}
                    notifications={notifications}
                    notificationsUnread={notificationsUnread}
                />
            </div>
            <div className="desktop-header">
                <DesktopHeader
                    notifications={notifications}
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                    profile={profile?.customer}
                    navbarActive={navbarActive}
                    notificationsUnread={notificationsUnread}
                    Links={Links}
                />
            </div>
        </div>
    )
}

export default Header
