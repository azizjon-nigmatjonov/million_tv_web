import MainButton from 'components/button/MainButton'
import SEO from 'components/SEO'
import { ArrowBackIcon, MillionTvIcon } from 'components/svg'
import { useTranslation, Router } from 'i18n'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import { parseCookies, destroyCookie } from 'nookies'
import { useDispatch, useSelector } from 'react-redux'
import {
    setRecommendationActivator,
    setRecommendationValue,
} from 'store/actions/application/recommendationActions'
import { setProfilesList } from 'store/actions/application/profilesAction'
import axios from '../../utils/axios'
export default function SessionLimitEnded({ users }) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { session_id, session_status } = parseCookies()

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
            <div className="w-full">
                <div className="flex justify-between items-center top-0 left-0 w-[100vw] px-6 md:px-[56px] lg:px-[96px] py-6 h-[72px] bg-mainColor">
                    <button
                        onClick={() => {
                            session_status && session_status === 'false'
                                ? logout()
                                : Router.push('/')
                        }}
                    >
                        <MillionTvIcon />
                    </button>
                    <button
                        onClick={() => {
                            session_status && session_status === 'false'
                                ? logout()
                                : Router.push('/')
                        }}
                    >
                        <ArrowBackIcon className="w-4 h-4 md:w-auto md:h-auto" />
                    </button>
                </div>
                <div className="w-full flex items-center justify-center flex-col py-16">
                    <h3 className="text-[24px] text-center md:text-[34px] leading-[41px] md:mb-4 mb-2 text-white">
                        {t('screen_session_limit')}
                    </h3>
                    <p className="w-full text-[15px] md:w-[800px] font-normal md:text-[20px] leading-[20px] md:leading-[25px] text-center text-[#C6C6C6]">
                        {t('more_users_screen')}
                    </p>
                    <div className="my-16">
                        {users?.sessions
                            ?.filter((val) => val.id !== session_id)
                            ?.map((item) => (
                                <div
                                    key={item.id}
                                    className="text-sm md:text-2xl text-center font-medium text-white mb-3"
                                >
                                    {item.ip_address} - {item.platform_name}
                                </div>
                            ))}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <MainButton
                            onClick={() => {
                                Router.replace(
                                    `/session-limit-ended/remove-users?status=${
                                        Router.query.status === 'online'
                                            ? 'online'
                                            : ''
                                    }`,
                                )
                            }}
                            text={t('delete_users')}
                            additionalClasses="bg-[#F4F4F4] text-black w-[300px] mr-3"
                        />

                        <MainButton
                            onClick={() => {
                                Router.replace(
                                    `/session-limit-ended/upgrate-tarif?type=${
                                        Router.query.status === 'online'
                                            ? 'live_session_limit'
                                            : 'session_limit'
                                    }`,
                                )
                            }}
                            text={t('update_plan')}
                            additionalClasses="bg-[#03A9F4] text-white w-[300px] bgHoverBlue"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const { user_id } = parseCookies(ctx)

    const urls = [
        {
            endpoint: `session/${user_id}?${
                ctx.query.status === 'online'
                    ? 'session_type=online'
                    : 'session_type=online,offline'
            }`,
        },
    ]

    const [users] = await fetchMultipleUrls(urls, ctx)

    return {
        props: {
            users,
        },
    }
}
