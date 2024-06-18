import { useIsMobile } from 'hooks/useIsMobile'
import MainButton from 'components/button/MainButton'
import React, { useMemo } from 'react'
import {
    PlayIcon,
    CreditCardIcon,
    MoreIcon,
    MoreIconFilled,
    CommentIcon,
    LikedMovieIcon,
    LikeMovieIcon,
    ShareIcon,
} from 'components/svg'
import router from 'next/router'
import { Router } from 'i18n'
import { useEffect, useRef, useState } from 'react'
import axios from '../../utils/axios'
import { parseCookies } from 'nookies'
import MobilePlayer from 'components/PlayerForVideo/MobilePlayer'
import MobilePlayerIntegration from 'components/PlayerForVideo/MobilePlaterIntegration'
import DeviceDetector from 'device-detector-js'
import { useTranslation } from 'i18n'
import { Player, Shortcut, ControlBar, BigPlayButton } from 'video-react'
import HLSSource from 'components/PlayerForVideo/HLSSource'
import { useDispatch, useSelector } from 'react-redux'
import { showAlert } from 'store/reducers/alertReducer'
import cls from './style.module.scss'
import { useMobile } from 'hooks/useMobile'

const VideoPlayer = ({
    el,
    filterGenres,
    checkSubscription,
    CurrentUserData,
    purchase,
    handleScrollReviews = () => {},
}) => {
    const [favoriteImg, setFavoriteImg] = useState('')
    const [favouriteId, setFavouriteId] = useState('')
    const [likeData, setLikeData] = useState({})
    const [favouritePaymentType, setFavouritePaymentType] = useState('')
    const { t, i18n } = useTranslation()
    const statusMessage = {
        FREE_TRIAL: 'FREE_TRIAL',
        ACTIVE: 'ACTIVE',
        FREE_TRIAL_EXPIRED: 'FREE_TRIAL_EXPIRED',
        INACTIVE: 'INACTIVE',
    }
    const mobile = useMobile('mobile')
    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const currentTime = useRef(null)
    const [isEnded, setIsEnded] = useState(false)
    const [isPlay, setIsPlay] = useState(false)
    const [sourceTrailer, setSourceTrailer] = useState('')
    const [colorActive, setColorActive] = useState(false)
    const dispatch = useDispatch()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const handleLoad = () => {
        if (player.current) {
            player.current.seek(0)
            player.current.actions.play()
        }
    }

    useEffect(() => {
        if (el?.trailer) {
            const bestQuality = el?.trailer?.[0]?.videos?.[1]
            setSourceTrailer(bestQuality)
        }
    }, [el])

    useEffect(() => {
        player?.current?.subscribeToStateChange(handleStateChange)
    }, [])

    useEffect(() => {
        if (isEnded) {
            handleLoad()
        }
    }, [isEnded])
    function handleStateChange(state) {
        setIsPlay(!state.paused)
        setIsEnded(state.ended)
        currentTime.current = state.currentTime
    }

    useEffect(() => {
        if (el?.payment_type === 'free') {
            setColorActive(false)
        } else if (el?.payment_type === 'tvod') {
            if (purchase || checkSubscription?.has_access) {
                setColorActive(false)
            } else {
                setColorActive(true)
            }
        } else if (el?.payment_type === 'svod') {
            if (purchase || checkSubscription?.has_access) {
                setColorActive(false)
            } else {
                setColorActive(true)
            }
        }
    }, [purchase, el])

    const getStatusMessage = (value) => {
        const { has_access, message } = value
        if (el?.payment_type === 'tvod') {
            if (purchase) {
                return t('watch')
            } else {
                return i18n.language === 'ru' || i18n.language === 'en'
                    ? `${t('buy')} ${i18n.language === 'en' ? 'for' : 'за'} ${
                          el?.pricing?.substracted_price / 100
                      } ${t('sum')}`
                    : `${
                          el?.pricing?.substracted_price / 100
                      } so'mga sotib oling`
            }
        } else if (el?.payment_type === 'free') {
            return t('watch')
        } else {
            if (has_access && message === statusMessage.FREE_TRIAL)
                return t('watch')
            if (has_access && message === statusMessage.ACTIVE)
                return t('watch')
            if (!has_access && message === statusMessage.FREE_TRIAL_EXPIRED) {
                return t('buy')
            }
            if (!has_access) {
                return t('buy_subscription')
            }
            if (!has_access && message === statusMessage.INACTIVE)
                return t('buy_subscription')
            if (!has_access && !message) return t('start_free')

            return t('watch')
        }
    }

    const [errorCase, setErrorCase] = useState(false)
    const [isMobile] = useIsMobile()
    const [source, setSource] = useState({})
    const [text, setText] = useState('')

    useEffect(() => {
        setText(getStatusMessage(checkSubscription))
    }, [checkSubscription, el, router, purchase])

    const { access_token, profile_id, session_id, user_id } = parseCookies()
    const [movieDuration, setMovieDuration] = useState('')
    const player = useRef(null)
    const [like, setLike] = useState(el?.is_favourite)
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)

    useEffect(() => {
        setLike(!!el?.is_favourite)
    }, [el?.is_favourite])

    useEffect(() => {
        if (el?.is_megogo) {
            setFavoriteImg(el?.trailer?.image)
            setFavouriteId(el?.id)
            setFavouritePaymentType(el?.payment_type)
        } else if (!el?.is_megogo && !el?.is_premier) {
            setFavoriteImg(el?.file_info?.image)
            setFavouriteId(el?.id)
            setFavouritePaymentType(el?.payment_type)
        } else if (el?.is_premier && !el?.is_megogo) {
            setFavoriteImg(el?.image?.original)
            setFavouriteId(el?.id)
            setFavouritePaymentType(el?.payment_type)
        } else {
            setFavoriteImg('')
        }
    }, [el])

    const handleFavourite = () => {
        if (like) {
            axios
                .delete(
                    `/favourites/profile/${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }`,
                    {
                        data: {
                            slug: el?.slug,
                        },
                    },
                )
                .then((res) => res)
        } else {
            if (access_token) {
                axios
                    .post(
                        `/favourites/profile/${
                            CurrentUserData?.id
                                ? CurrentUserData?.id
                                : profile_id
                        }`,
                        {
                            is_megogo: el?.is_megogo ? true : false,
                            is_premier: el?.is_premier ? true : false,
                            lang: i18n?.language,
                            logo_image: favoriteImg,
                            movie_id: favouriteId,
                            payment_type: favouritePaymentType,
                            price: el?.price ? el?.price : 0,
                            rating_imdb: el?.is_megogo
                                ? parseInt(el?.rating)
                                : el?.rating_imdb?.rating_imdb
                                ? parseInt(el?.rating_imdb.rating_imdb)
                                : 0,
                            slug: el?.slug ? el?.slug : '',
                            title: {
                                title_en: i18n?.language === 'en' ? 'en' : '',
                                title_ru: i18n?.language === 'ru' ? 'ru' : '',
                                title_uz: i18n?.language === 'uz' ? 'uz' : '',
                            },
                        },
                    )
                    .then(() => {})
            } else {
                Router.push(`/registration?movie=${el?.slug}`)
            }
        }
    }

    const handleMovie = () => {
        if (el?.is_serial) {
            if (el?.is_megogo) {
                Router.push(
                    `/video-player?id=${el.id}&episodeId=${
                        el?.seasons[0]?.episodes[0]?.id
                    }&ind=0&seasonNumber=1&episodeNumber=1&type=megogo${
                        el?.last_episode?.season_key == 1 &&
                        el?.last_episode?.episode_key == 1 &&
                        el?.last_episode?.seconds > 0
                            ? `&lastTime=${el?.last_episode?.seconds}`
                            : ''
                    }&genre=${
                        filterGenres[0]?.title ? filterGenres[0]?.title : ''
                    }`,
                )
            } else if (el?.is_premier) {
                Router.push(
                    `/video-player?id=${el?.id}&episodeId=${
                        el?.seasons[0]?.episodes[0]?.id
                    }&trailer=${false}&ind=0&seasonNumber=${1}&episodeNumber=${1}&type=premier${
                        el?.last_episode?.season_key == 1 &&
                        el?.last_episode?.episode_key == 1 &&
                        el?.last_episode?.seconds > 0
                            ? `&lastTime=${el?.last_episode?.seconds}`
                            : ''
                    }&genre=${
                        el?.genres[0]?.title ? el?.genres[0]?.title : ''
                    }`,
                )
            } else {
                Router.push(
                    `/video-player?key=${
                        el.slug
                    }&ind=0&seasonNumber=1&episodeNumber=1${
                        el?.last_episode?.season_key == 1 &&
                        el?.last_episode?.episode_key == 1 &&
                        el?.last_episode?.seconds > 0
                            ? `&lastTime=${el?.last_episode?.seconds}`
                            : ''
                    }`,
                )
            }
        } else {
            if (el?.is_premier) {
                Router.push(
                    `/video-player?id=${el.id}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=premier${
                        el?.seconds > 0 ? `&lastTime=${el?.seconds}` : ''
                    }&genre=${
                        el?.genres[0]?.title ? el?.genres[0]?.title : ''
                    }`,
                )
            } else if (el?.is_megogo) {
                Router.push(
                    `/video-player?id=${el.id}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=megogo&ganre=${
                        filterGenres?.length > 0 ? filterGenres[0]?.title : ''
                    }${
                        el?.seconds > 0 ? `&lastTime=${el?.seconds}` : ''
                    }&genre=${
                        filterGenres[0]?.title ? filterGenres[0]?.title : ''
                    }`,
                )
            } else {
                Router.push(
                    `/video-player?key=${el.slug}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }${el?.seconds > 0 ? `&lastTime=${el?.seconds}` : ''}`,
                )
            }
        }
    }

    const checkAccess = () => {
        axios
            .post(`/check-purchase-access?SessionId=${session_id}`, {
                movie_slug: el?.slug,
            })
            .then((res) => {
                if (balance?.balance >= el?.pricing?.substracted_price) {
                    if (!res.data.has_access) {
                        axios
                            .post(`/purchase`, {
                                episode_number: 0,
                                is_serial: el?.is_serial,
                                movie_lang: 'ru',
                                movie_slug: el?.slug,
                                season_number: 0,
                            })
                            .then((res) => {
                                axios
                                    .get('buy-single-movie', {
                                        params: {
                                            SessionId: session_id,
                                            balance_id: balance?.balance_id,
                                            amount: el?.pricing
                                                ?.substracted_price,
                                            user_subscription_id:
                                                res.data.purchase_id,
                                        },
                                    })
                                    .then((res) => {
                                        dispatch(
                                            showAlert(
                                                t('subscription_active_tvod'),
                                                'success',
                                            ),
                                        )
                                        if (res) {
                                            setText(t('watch'))
                                        }
                                    })
                                    .catch((err) => console.log(err))
                            })
                            .catch((err) => console.log(err))
                    } else {
                        Router.push(`/video-player?key=${el?.slug}&ind=0`)
                    }
                } else {
                    dispatch(showAlert(t('enoughFunds'), 'error'))
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (el?.duration) {
            let hours = Math.floor(el?.duration / 3600)
            let minutes = Math.floor((el?.duration % 3600) / 60)
            setMovieDuration(
                hours + `${t('hour')}` + ' ' + minutes + `${t('minutes')}`,
            )
        }
    }, [])

    useEffect(() => {
        if (access_token) {
            if (el?.payment_type === 'tvod') {
                axios
                    .post(`/check-purchase-access`, {
                        movie_slug: el?.slug,
                    })
                    .then((res) => {
                        if (res?.data?.has_access) {
                            setText(t('watch'))
                        }
                    })
                    .catch((err) => console.error(err))
            }
        }
    }, [access_token, el, t])

    const watchMovie = () => {
        if (access_token) {
            if (el?.payment_type === 'free') {
                handleMovie()
            } else if (el?.payment_type === 'tvod') {
                checkAccess()
            } else if (el?.payment_type === 'svod') {
                if (checkSubscription?.has_access) {
                    handleMovie()
                } else {
                    Router.push(
                        `/settings?from=subscription&category_slug=${el.category.slug}`,
                    )
                }
            }
        } else {
            if (el?.is_megogo) {
                Router.push(`/registration?movie=${el?.id}&type=megogo`)
            } else if (el?.is_premier) {
                Router.push(`/registration?movie=${el?.id}&type=premier`)
            } else {
                Router.push(`/registration?movie=${el?.slug}`)
            }
        }
    }

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
                    } else {
                        Router.push(
                            `/settings?from=subscription&category_slug=${el.category.slug}`,
                        )
                    }
                } else if (el?.payment_type === 'tvod') {
                    checkAccess()
                } else if (el?.payment_type === 'free') {
                    player?.current?.play()
                }
            } else {
                Router.push(`/registration?movie=${el?.slug}`)
            }
        } else {
            watchMovie()
        }
    }

    const btnColors = useMemo(() => {
        switch (el?.payment_type) {
            case 'svod':
                if (purchase || checkSubscription?.has_access) {
                    return 'bg-mainTextColor'
                } else {
                    return 'bg-lightyellow'
                }
            case 'tvod':
                if (purchase || checkSubscription?.has_access) {
                    return 'bg-mainTextColor'
                } else {
                    return 'bg-lightyellow'
                }
            default:
                return 'bg-mainTextColor'
        }
    }, [el, purchase, checkSubscription])

    useEffect(() => {
        handleGetLike(
            el.slug,
            CurrentUserData?.id ? CurrentUserData?.id : profile_id,
        )
    }, [el, CurrentUserData, profile_id])

    const handleLikeFn = (slug, id) => {
        axios
            .post('like', {
                movie_slug: slug,
                user_id: id,
            })
            .then((res) => handleGetLike(slug, id))
    }
    const handleGetLike = (slug, id) => {
        axios
            .get(`like-is_liked`, {
                params: { movie_slug: slug, user_id: id },
            })
            .then((res) => {
                handleGetLikeCount(slug, res.data.is_liked)
            })
    }
    const handleGetLikeCount = (slug, is_liked) => {
        axios
            .get(`like-count`, {
                params: { movie_slug: slug },
            })
            .then((res) => {
                setLikeData({ count: res?.data?.count, is_liked })
            })
    }

    return (
        <div className={`relative ${cls.bannerMoviePage}`}>
            <div>
                {el?.trailer && !isMobile ? (
                    <div
                        className={`relative w-full flex justify-center items-center ${cls.banner}`}
                    >
                        <Player
                            className="player_main_page"
                            aspectratio="true"
                            muted
                            autoPlay
                            playsInline
                            ref={player}
                            fluid={true}
                            poster={
                                el?.file_info?.image
                                    ? el?.file_info?.image
                                    : el?.file_info?.image_for_mobile
                            }
                            preload="auto"
                        >
                            <Shortcut clickable={false} />
                            <ControlBar className="control_bar" />
                            <HLSSource
                                isVideoChild
                                src={
                                    sourceTrailer?.src
                                        ? sourceTrailer?.src
                                        : sourceTrailer?.file_name
                                }
                                key={
                                    sourceTrailer?.src
                                        ? sourceTrailer?.src
                                        : sourceTrailer?.file_name || 1
                                }
                            />
                            <BigPlayButton disabled />
                        </Player>
                    </div>
                ) : (
                    <div
                        className={`relative w-full px-[50px] flex justify-center md:justify-start text-center items-end ${
                            isMobile
                                ? router.route !== '/preview/[movie]'
                                    ? 'wrapper min-h-[490px] h-[70vh]'
                                    : 'h-[100vh]'
                                : 'h-[100vh]'
                        }`}
                    >
                        <img
                            className="movies__img--banner h-full px-0 tablet:px-0"
                            src={
                                el?.file_info?.image
                                    ? el?.file_info?.image
                                    : el?.image?.fullscreen
                                    ? el?.image?.fullscreen
                                    : el?.image?.original
                            }
                            alt="img"
                        />
                        <span className="movies__bg--banner h-full px-4 md:px-[50px] tablet:px-24"></span>
                    </div>
                )}
            </div>

            {!router.pathname.includes('/preview') && (
                <div className="text-white z-10 wrapper banner-content mb-0">
                    <div className="mb-2 md:mb-6 text-center md:text-left">
                        <span className="text-3xl oswald-family">
                            {el?.title}
                        </span>
                    </div>
                    <div className="text-[#EDEDED] text-center flex flex-wrap justify-center md:justify-start px-7 md:px-0">
                        {el?.release_year > 0 && (
                            <span className="mr-2">{el?.release_year} ·</span>
                        )}

                        {el?.country && (
                            <span className="mr-2">{el?.country} ·</span>
                        )}

                        {!el?.is_megogo ? (
                            <span>
                                {el?.genres?.length > 0 &&
                                    `${el?.genres[0]?.title}${
                                        el?.genres[1]?.title
                                            ? ', ' + el?.genres[1]?.title
                                            : ''
                                    }`}
                            </span>
                        ) : filterGenres?.length > 0 ? (
                            `${
                                filterGenres[0]?.title
                                    ? filterGenres[0]?.title
                                    : ''
                            },${' '}${
                                filterGenres[1]?.title
                                    ? filterGenres[1]?.title
                                    : ''
                            }`
                        ) : (
                            ''
                        )}
                        {movieDuration && (
                            <span className="mx-2">
                                <span className="ml-0.5 mr-1.5">·</span>
                                {movieDuration}
                            </span>
                        )}
                        {el?.age_restriction ? (
                            <span>
                                <span className="ml-1.5 mr-1.5">·</span>
                                <span className="ml-1">
                                    {`${el.age_restriction}+`}
                                </span>
                            </span>
                        ) : (
                            <span>
                                <span className="ml-1.5 mr-1.5">·</span>
                                <span className="ml-1">{`0+`}</span>
                            </span>
                        )}
                    </div>

                    {el?.staffs?.length && (
                        <div className="w-1/2 mt-1 hidden mobile:block">
                            <span className="text-whiteLighter mr-1.5 text-lg">
                                Актёры:
                            </span>
                            {el?.staffs?.map((item, index) => (
                                <span
                                    onClick={(e) => {
                                        e.preventDefault()
                                        router.push(
                                            `/actor/${item?.staff?.slug}`,
                                        )
                                    }}
                                    className="border-b border-white mr-1.5 text-lg text-white cursor-pointer"
                                    key={index}
                                >
                                    {item?.name ??
                                        item?.staff?.first_name +
                                            ' ' +
                                            item?.staff?.last_name}
                                    ,
                                </span>
                            ))}
                        </div>
                    )}

                    {!router.pathname.includes('/preview') && (
                        <div className="flex items-end justify-center sm:justify-between">
                            <div
                                className={`${cls.btns} flex justify-center items-center lg:justify-start mt-5 sm:mt-10 space-x-3 sm:space-x-4`}
                            >
                                <div
                                    className={`${cls.playBtnBox} inline-block`}
                                >
                                    <MainButton
                                        text={text}
                                        onClick={() => handlePlay()} // watchMovie()
                                        icon={
                                            el?.payment_type === 'free' ||
                                            purchase ||
                                            checkSubscription?.has_access ? (
                                                <PlayIcon fill="white" />
                                            ) : (
                                                <CreditCardIcon
                                                    width="24"
                                                    height="24"
                                                    fill="white"
                                                />
                                            )
                                        }
                                        additionalClasses={`${cls.playBtn} ${btnColors} text-white h-[48px] inline-flex w-full duration-200 rounded-[8px] whitespace-nowrap`}
                                        margin={'mr-2 md:mr-0'}
                                    />
                                </div>

                                <MainButton
                                    onClick={(e) => handleScrollReviews()}
                                    text={t('share')}
                                    additionalClasses={`${cls.shareBtn} h-[48px] text-whiteLighter bg-mainColor rounded-[8px]`}
                                    icon={<ShareIcon />}
                                    margin="mr-[5px]"
                                />

                                <MainButton
                                    onClick={(e) => {
                                        setLike((prev) => !prev)
                                        handleFavourite()
                                    }}
                                    text={
                                        mobile ? t('save') : t('selected_movie')
                                    }
                                    additionalClasses={`h-[48px] bg-mainColor rounded-[8px] ${
                                        like ? '' : 'text-whiteLighter'
                                    }`}
                                    icon={
                                        like ? (
                                            <MoreIconFilled />
                                        ) : (
                                            <MoreIcon
                                                stroke={
                                                    like ? 'white' : '#8B97B0'
                                                }
                                            />
                                        )
                                    }
                                    margin="mr-[5px]"
                                />
                                <MainButton
                                    onClick={(e) => handleScrollReviews()}
                                    text={t('reviews')}
                                    additionalClasses="h-[48px] text-whiteLighter bg-mainColor rounded-[8px]"
                                    icon={<CommentIcon />}
                                    margin="mr-[5px]"
                                />

                                <MainButton
                                    onClick={(e) =>
                                        handleLikeFn(
                                            el.slug,
                                            CurrentUserData?.id
                                                ? CurrentUserData?.id
                                                : profile_id,
                                        )
                                    }
                                    text={
                                        likeData?.count > 0 && likeData?.count
                                    }
                                    additionalClasses="h-[48px] text-whiteLighter bg-mainColor rounded-[8px]"
                                    icon={
                                        likeData?.is_liked ? (
                                            <LikedMovieIcon />
                                        ) : (
                                            <LikeMovieIcon />
                                        )
                                    }
                                    margin={
                                        likeData.count > 0 ? 'mr-[5px]' : ''
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
            {device.os.name === 'iOS' && (
                <div>
                    {el?.is_megogo ? (
                        <MobilePlayerIntegration
                            setSource={setSource}
                            source={source}
                            isTrailer={true}
                            player={player}
                            movie={el?.trailer}
                            indNumber={0}
                            setErrorCase={setErrorCase}
                            errorCase={errorCase}
                        />
                    ) : (
                        <MobilePlayer
                            setSource={setSource}
                            setErrorCase={setErrorCase}
                            errorCase={errorCase}
                            source={source}
                            player={player}
                            movie={el}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default VideoPlayer
