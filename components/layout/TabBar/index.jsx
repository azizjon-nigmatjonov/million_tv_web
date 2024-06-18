import { useMemo } from 'react'
import cls from './style.module.scss'
import { useTranslation } from 'i18n'
import {
    AccountIcon,
    CatalogIcon,
    HomeIconSecond,
    TvTabIcon,
} from 'components/svg'
import { Link } from '@mui/material'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import DeviceDetector from 'device-detector-js'
export default function TabBar() {
    const { t } = useTranslation()
    const router = useRouter()
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const { access_token } = parseCookies()

    const Tabs = useMemo(() => {
        const res = [
            {
                title: 'home',
                icon: (
                    <HomeIconSecond
                        fill={router.pathname === '/' ? '#fff' : '#8B97B0'}
                    />
                ),
                link: '/',
            },
            {
                title: 'catalog',
                icon: (
                    <CatalogIcon
                        fill={
                            router.pathname === '/catalog' ? '#fff' : '#8B97B0'
                        }
                    />
                ),
                link: '/catalog',
            },
            {
                title: 'tv',
                icon: (
                    <TvTabIcon
                        fill={router.pathname === '/tv' ? '#fff' : '#8B97B0'}
                    />
                ),
                link: '/tv',
            },
            {
                title: 'profile',
                icon: (
                    <AccountIcon
                        fill={
                            router.pathname === '/settings' ? '#fff' : '#8B97B0'
                        }
                    />
                ),
                link: access_token ? '/settings' : '/registration',
            },
        ]

        return res
    }, [t, router, access_token])

    const handleRoute = (link) => {
        router.push(link)
    }

    const handleLink = () => {
        if (device.os.name === 'iOS') {
            window.open(
                'https://apps.apple.com/uz/app/million-tv/id6446142509',
                '_blank',
            )
        } else {
            window.open(
                'https://play.google.com/store/search?q=milliontv&c=apps',
                '_blank',
            )
        }
    }

    return (
        <div className={cls.wrapper}>
            <div className={cls.wrapperSection}>
                {router.pathname === '/' && (
                    <button
                        onClick={handleLink}
                        className={`${cls.openAppBtn} text-white font-normal text-8 leading-12 py-3.5 w-[95%] rounded-[12px] mt-8`}
                    >
                        {t('open_in_app')}
                    </button>
                )}
                <ul className={cls.list}>
                    {Tabs?.map((element, index) => (
                        <li
                            key={index}
                            onClick={() => handleRoute(element.link)}
                        >
                            {element?.icon}
                            <p
                                className={
                                    router.pathname === element.link
                                        ? cls.active
                                        : cls.inactive
                                }
                            >
                                {t(element.title)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
