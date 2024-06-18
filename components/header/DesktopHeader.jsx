import { SearchIcon, ClearIconDark } from 'components/svg'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import LoginButton from 'components/button/LoginBtn'
import { useTranslation, Link as I18nLink } from 'i18n'
import DropDawn from '../drop-dawn/DropDawn'
import nookies, { parseCookies } from 'nookies'
import { ClickAwayListener } from '@material-ui/core'
import Notifications from 'components/cards/Notifications'
import NextLink from 'components/common/link'
import {
    setSearchAction,
    setSearchValue,
} from 'store/actions/application/searchAction'
import { useDispatch, useSelector } from 'react-redux'
import cls from './styles.module.scss'
import { MillionTvIcon } from '../../components/svg'
import { Link } from '@mui/material'
import axios from 'utils/axios'
import { i18n } from 'i18n'
import LanguageDropdown from './LanguageDropdown'

function DesktopHeader({
    navbarActive,
    Links,
    setSearchOpen,
    profile,
    notifications,
    notificationsUnread,
}) {
    const cookies = nookies.get()
    const { t } = useTranslation()
    const router = useRouter()
    const [notifActive, setNotifActive] = useState(false)
    const dispatch = useDispatch()
    const refClear = useRef()
    const [detectSearch, setDetectSearch] = useState(false)
    const { user_id } = parseCookies()

    const setSearch = useSelector((state) => state.searchReducer.set_search)
    const searchValue = useSelector((state) => state.searchReducer.search_value)
    const [language, setLanguage] = useState('')

    useEffect(() => {
        window.addEventListener('popstate', detectHistory)

        function detectHistory() {
            setDetectSearch(true)
        }

        return () => {
            if (searchValue && detectSearch) {
                dispatch(setSearchAction(true))
            }
        }
    }, [detectSearch, searchValue])

    useEffect(() => {
        if (setSearch) {
            refClear.current.focus()
        } else {
            dispatch(setSearchAction(false))
        }
    }, [setSearch])

    useEffect(() => {
        document.addEventListener('keydown', detectKeyPress, true)
    }, [])

    const detectKeyPress = (e) => {
        if (e.keyCode === 27) {
            dispatch(setSearchAction(false))
            dispatch(setSearchValue(''))
        }
    }

    useEffect(() => {
        if (refClear?.current?.value.length < 1) {
            dispatch(setSearchValue(''))
        }
    }, [refClear?.current?.value])

    const changeLanguage = (lang) => {
        axios.put(`/customer/change-lang`, {
            params: {
                customer_id: user_id,
                lang: lang,
            },
        })

        i18n.changeLanguage(lang)
    }
    return (
        <div>
            <nav
                className={`text-white flex h-[90px] items-center ${
                    router.pathname === '/' && 'header-gradient'
                } ${navbarActive ? 'header-active' : 'header-gradient'} ${
                    setSearch ? 'header-active' : ''
                }`}
            >
                <div className="wrapper">
                    <div className=" flex justify-between items-center mx-auto">
                        <div className="flex space-x-[80px] items-center">
                            <I18nLink
                                href="/"
                                onClick={() => {
                                    dispatch(setSearchAction(false))
                                    dispatch(setSearchValue(''))
                                }}
                            >
                                <a
                                    className="2x:mr-24"
                                    onClick={() => {
                                        dispatch(setSearchAction(false))
                                        dispatch(setSearchValue(''))
                                    }}
                                >
                                    <MillionTvIcon />
                                </a>
                            </I18nLink>
                            {!setSearch && (
                                <ul className="flex">
                                    {Links?.map((item, index) => (
                                        <li key={index}>
                                            <Link href={item.link}>
                                                <a
                                                    onClick={() => {
                                                        dispatch(
                                                            setSearchAction(
                                                                false,
                                                            ),
                                                        )
                                                    }}
                                                    className={`nav-link mr-6 ${
                                                        router.route ===
                                                            item.link &&
                                                        'active'
                                                    } ${
                                                        router.pathname ===
                                                            '/movie/[movie]' &&
                                                        'white'
                                                    }`}
                                                >
                                                    {t(
                                                        item.title?.toLowerCase(),
                                                    )}
                                                </a>
                                            </Link>
                                        </li>
                                    ))}
                                    <div
                                        onClick={() => {
                                            !setSearch
                                                ? setSearchOpen(true)
                                                : null
                                            dispatch(setSearchAction(true))
                                        }}
                                        className="flex justify-center items-center cursor-pointer"
                                    >
                                        <SearchIcon
                                            fill={
                                                router.pathname ===
                                                '/movie/[movie]'
                                                    ? 'white'
                                                    : '#8B97B0'
                                            }
                                        />
                                    </div>
                                </ul>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            {setSearch && (
                                <div className="relative">
                                    <input
                                        ref={refClear}
                                        className={cls.search_input}
                                        type="text"
                                        onChange={(e) => {
                                            dispatch(
                                                setSearchValue(
                                                    e?.target?.value,
                                                ),
                                            )
                                        }}
                                        value={searchValue}
                                        placeholder={t('Movies_people_genres')}
                                    />
                                    <button
                                        onClick={() => {
                                            refClear.current.value = ''
                                            dispatch(setSearchAction(false))
                                            dispatch(setSearchValue(''))
                                        }}
                                        className="absolute right-[15px] top-1/2 -translate-y-1/2 flex items-center py-3 px-4"
                                    >
                                        <ClearIconDark />
                                    </button>
                                    <div className="absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center">
                                        <SearchIcon
                                            fill={
                                                router.pathname ===
                                                '/movie/[movie]'
                                                    ? 'white'
                                                    : '#8B97B0'
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end">
                            <ClickAwayListener
                                onClickAway={() => setNotifActive(false)}
                            >
                                <div
                                    className="cursor-pointer mr-4"
                                    onClick={() => setNotifActive(!notifActive)}
                                >
                                    <Notifications
                                        notificationsUnread={
                                            notificationsUnread
                                        }
                                        notifications={notifications}
                                    />
                                </div>
                            </ClickAwayListener>
                            <div className="mr-4">
                                <LanguageDropdown
                                    changeLanguage={changeLanguage}
                                />
                            </div>
                            {cookies.access_token ? (
                                <DropDawn profile={profile} />
                            ) : (
                                <LoginButton text={t('login')} />
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default DesktopHeader
