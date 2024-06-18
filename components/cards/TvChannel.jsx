import { useState, useRef } from 'react'
import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { parseCookies } from 'nookies'
import DeviceDetector from 'device-detector-js'
import router from 'next/router'
import axios from '../../utils/axios'
import { useEffect } from 'react'
import MobilePlayer from 'components/PlayerForVideo/MobilePlayer'
import { useTranslation } from 'i18n'
import ErrorPopup from 'components/errorPopup/Popup'
import { ExpredIcon } from 'components/svg'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 4,
    borderRadius: 8,
    width: '100%',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#03A9F4',
    },
}))

const TvChannel = ({ imgSrc, title = '10 : 00', info, addClass = '', el }) => {
    const { t, i18n } = useTranslation()
    const program_time = Math.round(el?.passed_percentage)
    const MINUTES = el?.reminded_time //some integer
    let m = MINUTES % 60
    let h = (MINUTES - m) / 60
    const [windowWidth] = useWindowSize()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const { access_token } = parseCookies()
    const player = useRef(null)

    const [errorCase, setErrorCase] = useState(false)
    const [source, setSource] = useState({})

    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const [checkSubscription, setCheckSubscription] = useState({})
    const [expired, setExpired] = useState(false)
    const [subscription, setSubscription] = useState([])
    const TV_Player = { ...el, is_channel: true }

    const getData = async () => {
        if (access_token) {
            axios
                .get(`/tv/channel/${el?.id}`, {
                    Authorization: access_token,
                })
                .then((res) => {
                    if (res?.data?.payment_type === 'svod') {
                        axios
                            .post(
                                `check-subscription-access`,
                                {
                                    key: 'tv',
                                },
                                { Authorization: access_token },
                            )
                            .then((res) => {
                                setCheckSubscription(res?.data)

                                if (res.data.has_access) {
                                    ;('')
                                } else {
                                    axios
                                        .get(`subscription/category?key=tv`)
                                        .then((res) => {
                                            setSubscription(res.data.categories)
                                        })
                                }
                            })
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handlePlay = async () => {
        if (device.os.name === ' ') {
            if (source) {
                if (source?.file_name?.length == 0) {
                    setErrorCase(true)
                } else if (source?.quality === 'original') {
                    setErrorCase(true)
                }
            } else {
                setErrorCase(true)
            }
            // condition for subscription or play
            if (access_token) {
                if (el?.payment_type === 'svod') {
                    if (checkSubscription?.has_access) {
                        player.current.play()
                    }
                } else if (el?.payment_type === 'tvod') {
                    // checkAccess()
                } else if (el?.payment_type === 'free') {
                    player.current.play()
                }
            } else {
                router.push(`/registration?movie=${el?.slug}`)
            }
        } else {
            watchMovie()
        }
    }

    const watchMovie = () => {
        if (access_token) {
            if (el?.payment_type === 'free') {
                handleMovie()
            } else if (el?.payment_type === 'tvod') {
                // checkAccess()
                console.log(`tvod doesn't work in tv`)
            } else if (el?.payment_type === 'svod') {
                if (
                    checkSubscription?.has_access ||
                    subscription?.length === 0
                ) {
                    handleMovie()
                } else {
                    setExpired(true)
                    if (
                        checkSubscription.message === '' &&
                        checkSubscription.is_watched_free_trial === false
                    ) {
                        window.location.replace(
                            `/settings?from=subscription&key=tv&freeTrial=false&tvPlay=${el.id}`,
                        )
                    }
                    // window.location.replace(`/tv/channel?id=${el?.id}#payment`)
                    // window.location.replace(`/settings?from=subscription&key=tv`)
                }
            }
        } else {
            router.push(`/registration`)
        }
    }

    const handleMovie = () => {
        router.push(`/tv/tv-video?key=${el.id}`)
    }

    return (
        <>
            {router.router.route === '/' && (
                <div>
                    <div
                        onClick={() => handlePlay()}
                        className={`cursor-pointer relative h-[250px] bg-white rounded-[8px] duration-300 hover:scale-105 ${addClass}`}
                        id="tvChannel"
                    >
                        {/* <div className="absolute left-1 top-1 bg-mainTextColor px-2 py-[2px] rounded-[4px] text-[10px] text-white">
                            15 000 сум
                        </div> */}
                        {imgSrc && (
                            <img
                                src={imgSrc}
                                alt="img"
                                className="block w-full h-full object-contain object-center rounded-[8px]"
                            />
                        )}
                    </div>
                    <p className="text-white font-medium mt-1">
                        {el?.title_ru}
                    </p>
                </div>
            )}
            {router.router.route === '/tv' && (
                <div
                    onClick={() => handlePlay()}
                    className={`cursor-pointer relative w-full overflow-hidden rounded-[8px] duration-300 hover:scale-105 ${addClass}`}
                    id="tvChannel"
                >
                    {imgSrc && (
                        <img
                            src={imgSrc}
                            alt="img"
                            className="block w-full h-[120px] mobile:h-[150px] rounded-[8px] object-cover"
                        />
                    )}

                    {el?.payment_type === 'free' ? (
                        <span className="absolute left-2 top-[7px] p-[4px] py-[2px] leading-[12px] text-[9px] rounded-[4px] text-white tagBackgroundForFree">
                            {i18n?.lenguage === 'ru' ? 'Тест' : 'Test'}
                        </span>
                    ) : (
                        <span className="absolute left-2 top-[7px] p-[4px] py-[2px] leading-[12px] text-[9px] rounded-[4px] text-white tagBackgroundForSvod">
                            {t('svod')}
                        </span>
                    )}
                    <p className="mt-2 text-sm mobile:text-base oswald-family">
                        {title}
                    </p>
                </div>
            )}
            {checkSubscription.has_access === false &&
                checkSubscription.is_watched_free_trial &&
                checkSubscription?.message === 'FREE_TRIAL_EXPIRED' &&
                expired && (
                    <ErrorPopup
                        openModal={expired}
                        setOpenModal={setExpired}
                        link={() => {
                            setExpired(false)
                            setTimeout(() => {
                                window.location.replace(
                                    `/settings?from=subscription&key=tv&subscriptionId=${checkSubscription?.subscription_id}&tvPlay=${el?.id}`,
                                )
                            }, 100)
                        }}
                        title={t('expired')}
                        textButton={`${t('activate')} `}
                        text={t('expired_text')}
                        icon={<ExpredIcon />}
                    />
                )}
            {checkSubscription.has_access === false &&
                checkSubscription.is_watched_free_trial &&
                checkSubscription?.message === 'INACTIVE' &&
                expired && (
                    <ErrorPopup
                        openModal={expired}
                        setOpenModal={setExpired}
                        link={() => {
                            setExpired(false)
                            setTimeout(() => {
                                window.location.replace(
                                    `/settings?from=subscription&key=tv&tvPlay=${el?.id}&message=INACTIVE`,
                                )
                            }, 100)
                        }}
                        title={t('expired')}
                        textButton={t('activate')}
                        text={t('expired_follow')}
                        icon={<ExpredIcon />}
                    />
                )}
            {device.os.name === '' && (
                <MobilePlayer
                    setSource={setSource}
                    setErrorCase={setErrorCase}
                    errorCase={errorCase}
                    source={source}
                    player={player}
                    movie={TV_Player}
                />
            )}
        </>
    )
}

export default TvChannel
