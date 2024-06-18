import 'node_modules/video-react/dist/video-react.css'
import '../styles/globals.scss'
import Router from 'next/router'
import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { useEffect } from 'react'
import Layout from 'components/layout/Layout'
import { useStore } from '../store/store'
import { i18n, appWithTranslation } from '../i18n'
import AlertComponent from 'components/Alert'
import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/uz'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import axios from 'utils/axios'
import { destroyCookie, parseCookies } from 'nookies'
import { showAlert } from 'store/reducers/alertReducer'
import { logout } from 'utils/logout'
import { useTranslation } from 'i18n'
import ScreenCaptureContainer from 'screen-capture'
import { QueryClientProvider } from 'react-query'
import { queryClient } from 'services/http-client'
// Global styles
// NProgress events

function MyApp({ Component, pageProps, router }) {
    const store = useStore(pageProps.initialReduxState)
    const persistor = persistStore(store)
    const cookies = parseCookies()
    const { t, i18n } = useTranslation()
    const { session_id } = parseCookies()

    useEffect(() => {
        if (window) {
            const jssStyles = document.querySelector('#jss-server-side')
            if (jssStyles) {
                jssStyles.parentElement.removeChild(jssStyles)
            }
        }
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (cookies.access_token && cookies.session_id) {
                axios
                    .get(
                        `${process.env.BASE_URL}ping-online-users?session-id=${cookies.session_id}`,
                        // `https://test.spectator.api.milliontv.uz/v1/ping-online-users?session-id=${cookies.session_id}`,
                        {
                            params: {
                                profile_id: cookies.profile_id,
                            },
                        },
                    )
                    .catch((e) => {
                        if (e?.status === 403) {
                            store.dispatch(
                                showAlert(
                                    t('Сессия этого пользователя удалена'),
                                ),
                            )
                            logout()
                            setTimeout(() => {
                                // location.replace('/registration')
                            }, 4000)
                        }
                    })
            }
        }, 15000)

        return () => {
            clearInterval(intervalId)
        }
    }, [cookies])

    useEffect(() => {
        moment.locale(i18n.language)
    }, [i18n.language])

    return (
        <>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PersistGate loading={null} persistor={persistor}>
                        <AnimateSharedLayout type="crossfade">
                            <AnimatePresence exitBeforeEnters>
                                <ScreenCaptureContainer>
                                    <Layout
                                        profile={pageProps.profile}
                                        notifications={pageProps.notifications}
                                        notificationsUnread={
                                            pageProps.notificationsUnread
                                        }
                                        key={router.asPath}
                                    >
                                        <AlertComponent />
                                        <Component
                                            {...pageProps}
                                            key={router.asPath}
                                        />
                                    </Layout>
                                </ScreenCaptureContainer>
                            </AnimatePresence>
                        </AnimateSharedLayout>
                    </PersistGate>
                </QueryClientProvider>
            </Provider>
        </>
    )
}

export default appWithTranslation(MyApp)
