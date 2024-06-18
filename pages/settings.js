import SettingsPage from 'components/pages/settings/SettingsPage'
import SEO from 'components/SEO'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from '../utils/axios'
import { parseCookies, destroyCookie } from 'nookies'
import { setProfilesList } from 'store/actions/application/profilesAction'
import {
    setRecommendationValue,
    setRecommendationActivator,
} from 'store/actions/application/recommendationActions'
import { Router } from 'i18n'
import { useRouter } from 'next/router'
import { setCookie } from 'nookies'

export default function Settings() {
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const categories = useSelector((state) => state.categories.categories_value)
    const dispatch = useDispatch()
    const notifications = useSelector(
        (state) => state.notification.notification_value,
    )
    const { access_token, session_id } = parseCookies()
    const router = useRouter()
    const { userMobile } = router.query

    function setUserProfileDataFromMobile(data) {
        setCookie(null, 'profile_id', data.profile_id, {
            path: '/',
        })
        setCookie(null, 'session_id', data.session_id, {
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        })
        setCookie(null, 'access_token', data.access_token, {
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        })
        setCookie(null, 'user_id', data.id, {
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        })

        if (!data.session_status) {
            setCookie(null, 'session_status', 'false', {
                path: '/',
            })
            Router.push('/session-limit-ended?status=offline')
            return
        }
    }

    useEffect(() => {
        if (userMobile) {
            setUserProfileDataFromMobile(JSON.parse(userMobile))
        }
    }, [userMobile])

    useEffect(() => {
        if (!access_token && !userMobile) {
            // window.location.replace('/registration')
        }
        if (profile && !profile.session_status && !userMobile) {
            logout()
        }
    }, [access_token, profile, userMobile])

    const logout = () => {
        axios
            .delete(`/session`, {
                data: {
                    session_id,
                },
            })
            .then((res) => {
                destroyCookie(null, 'profile_id', {
                    path: '/',
                })
                destroyCookie(null, 'access_token', {
                    path: '/',
                })
                destroyCookie(null, 'session_id', {
                    path: '/',
                })
                destroyCookie(null, 'user_id', {
                    path: '/',
                })
                destroyCookie(null, 'next-i18next', {
                    path: '/',
                })
                dispatch(setProfilesList(null))
                dispatch(setRecommendationValue(null))
                dispatch(setRecommendationActivator(false))
                sessionStorage.removeItem('listSelected')
                sessionStorage.removeItem('userActivation')
                window.localStorage.removeItem('idImageUpload')
                Router.push('/')
            })
    }
    return (
        <>
            <SEO />
            <SettingsPage
                profile={profile ? profile : []}
                categories={categories?.categories}
                notifications={notifications}
            />
        </>
    )
}
