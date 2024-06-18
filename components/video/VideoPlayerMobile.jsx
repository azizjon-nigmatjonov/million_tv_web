import React from 'react'
import { useIsMobile } from 'hooks/useIsMobile'
import MainButton from 'components/button/MainButton'
import {
    DislikeIcon,
    FavoriteLikeIcon,
    FavoriteLikeIconBordered,
    PlayIcon,
    CreditCardIcon,
    IMDBIcon,
    ForwardIcon,
} from 'components/svg'
import router from 'next/router'
import { Router, Trans } from 'i18n'
import { useEffect, useRef, useState } from 'react'
import axios from '../../utils/axios'
import { parseCookies } from 'nookies'
import MobilePlayer from 'components/PlayerForVideo/MobilePlayer'
import DeviceDetector from 'device-detector-js'
import { useTranslation } from 'i18n'
import cls from './VideoPlayerMobile.module.scss'

const baseUrl = process.env.BASE_DOMAIN

const VideoPlayerMobile = ({
    el,
    filterGenres,
    checkSubscription,
    purchase,
    CurrentUserData,
}) => {
    const [favoriteImg, setFavoriteImg] = useState('')
    const [favouriteId, setFavouriteId] = useState('')
    const [favouritePaymentType, setFavouritePaymentType] = useState('')
    const { t, i18n } = useTranslation()
    const [windowWidth] = useWindowSize()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }
    const statusMessage = {
        FREE_TRIAL: 'FREE_TRIAL',
        ACTIVE: 'ACTIVE',
        FREE_TRIAL_EXPIRED: 'FREE_TRIAL_EXPIRED',
        INACTIVE: 'INACTIVE',
    }

    function handleOnClick() {
        if (window.navigator.share) {
            window.navigator
                .share({
                    title: '`${postTitle} | ${siteTitle}`',
                    text: `Check out `,
                    url: baseUrl + Router?.asPath,
                })
                .then(() => {
                    console.log('Successfully shared')
                })
                .catch((error) => {
                    console.error(
                        'Something went wrong sharing the blog',
                        error,
                    )
                })
        }
    }

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
            if (!has_access && message === statusMessage.INACTIVE)
                return t('buy_subscription')
            if (!has_access && !message) return t('start_free')

            return t('watch')
        }
    }

    const [showModal, setShowModal] = useState(false)
    const [errorCase, setErrorCase] = useState(false)
    const [isMobile] = useIsMobile()
    const [purchaseId, setPurchaseId] = useState('')
    const [source, setSource] = useState({})

    const [text, setText] = useState('')

    useEffect(() => {
        setText(getStatusMessage(checkSubscription))
    }, [checkSubscription, el])

    const { access_token } = parseCookies()
    const [movieDuration, setMovieDuration] = useState('')
    const player = useRef(null)

    const [like, setLike] = useState(el?.is_favourite)
    const { user_id } = parseCookies()

    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)

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
                .delete(`/favourites/profile/${CurrentUserData?.id}`, {
                    data: { slug: el?.slug },
                })
                .then((res) => res)
        } else {
            if (access_token) {
                const json = {
                    is_megogo: el?.is_megogo ? true : false,
                    is_premier: el?.is_premier ? true : false,
                    lang: i18n?.language,
                    logo_image: favoriteImg,
                    movie_id: favouriteId,
                    payment_type: favouritePaymentType,
                    price: el?.price ? el?.price : 0,
                    rating_imdb: el?.rating_imdb?.rating_imdb
                        ? parseInt(el?.rating_imdb.rating_imdb)
                        : 0,
                    slug: el?.slug ? el?.slug : '',
                    title: {
                        title_en: i18n?.language === 'en' ? 'en' : '',
                        title_ru: i18n?.language === 'ru' ? 'ru' : '',
                        title_uz: i18n?.language === 'uz' ? 'uz' : '',
                    },
                }
                axios
                    .post(`/favourites/profile/${CurrentUserData?.id}`, json)
                    .then((res) => res)
            } else {
                Router.push(`/registration?movie=${el.slug}`)
            }
        }
    }

    const handleMovie = () => {
        if (el?.is_serial) {
            Router.push(
                `  /video-player?key=${el.slug}&ind=0&seasonNumber=1&episodeNumber=1`,
            )
        } else {
            Router.push(
                el?.is_megago
                    ? `/video-player?id=${el.id}&ind=0`
                    : `/video-player?key=${el.slug}&ind=0`,
            )
        }
    }

    const checkAccess = () => {
        axios
            .post(`/check-purchase-access`, {
                movie_slug: el?.slug,
            })
            .then((res) => {
                if (!res.data.has_access) {
                    axios
                        .post(`/purchase`, {
                            // episode_number: !el?.is_serial
                            //     ? 0
                            //     : el?.seasons.length,
                            episode_number: 0,
                            is_serial: el?.is_serial,
                            movie_lang: 'ru',
                            movie_slug: el?.slug,
                            season_number: 0,
                            // season_number: !el?.is_serial
                            //     ? 0
                            //     : el.seasons.length,
                        })
                        .then((res) => {
                            // setPurchaseId(res.data.purchase_id)
                            axios
                                .post(`/payme-link`, {
                                    amount: el.pricing.substracted_price,
                                    episode_number: 0,
                                    is_serial: el.is_serial,
                                    lang: 'ru',
                                    movie_slug: el.slug,
                                    purchase_id: res.data.purchase_id,
                                    season_number: 0,
                                    url:
                                        process.env.BASE_DOMAIN + router.asPath,
                                })
                                .then((res) =>
                                    window.location.replace(res.data.link),
                                )
                                .catch((err) => console.log(err))
                        })
                        .catch((err) => console.log(err))
                } else {
                    Router.push(`/video-player?key=${el?.slug}&ind=0`)
                }
            })
            .catch((err) => console.log(err))
    }
    useEffect(() => {
        if (el?.duration) {
            let hours = Math.floor(el?.duration / 3600)
            let minutes = Math.floor((el?.duration % 3600) / 60)
            setMovieDuration(hours + 'ч' + ' ' + minutes + 'мин')
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
                    .catch((err) => console.log(err))
            }
        }
    }, [])

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
                    if (el?.is_megogo) {
                        Router.push(`/movie/${el?.id}?type=megogo`)
                    } else if (el?.is_premier) {
                        Router.push(`/movie/${el?.id}?type=premier`)
                    } else {
                        Router.push(`/movie/${el?.slug}`)
                    }
                }
            }
        } else {
            Router.push(`/registration?movie=${el?.slug}`)
        }
    }
    const handlePlay = async () => {
        // condition for play ios mobile
        // const isAccess = await axios.get('check-user-access')

        // if (!isAccess.data.has_access) {
        //     Router.push('/session-limit-ended?status=online')
        //     return
        // }

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
                        if (el?.is_megogo) {
                            Router.push(`/movie/${el?.id}?type=megogo`)
                        } else if (el?.is_premier) {
                            Router.push(`/movie/${el?.id}?type=premier`)
                        } else {
                            Router.push(`/movie/${el?.slug}`)
                        }
                    }
                } else if (el?.payment_type === 'tvod') {
                    checkAccess()
                } else if (el?.payment_type === 'free') {
                    player.current.play()
                }
            } else {
                Router.push(`/registration?movie=${el?.slug}`)
            }
        } else {
            watchMovie()
        }
    }

    return (
        <>
            <div className={cls.wrapperRelative}>
                <div
                    className={`relative h-[498px] sm:h-[600px] 2xl:h-[100vh] w-full px-[50px] flex justify-center md:justify-start text-center items-end ${
                        isMobile ? 'wrapper' : ''
                    }`}
                >
                    {el?.category?.slug === 'masterklass' ? (
                        <img
                            className="movies__img--banner h-full px-0 tablet:px-0"
                            src={el?.trailer[0]?.image}
                            alt="img"
                        />
                    ) : (
                        <img
                            className="movies__img--banner h-full px-0 tablet:px-0"
                            src={
                                !el?.is_megago
                                    ? el?.file_info?.image
                                    : el?.image?.big
                            }
                            alt="img"
                        />
                    )}
                    <span className="movies__bg--banner h-full px-4 md:px-[50px] tablet:px-24"></span>
                </div>

                {windowWidth[0] < 1200 ? (
                    <div className="absolute top-0 right-0">
                        <MainButton
                            onClick={handleOnClick}
                            icon={<ForwardIcon />}
                            additionalClasses="rounded-[8px]"
                            id="demo-simple-select-label"
                        />
                    </div>
                ) : null}

                <div className={cls.wrapperAbsolute}>
                    {!router.pathname.includes('/preview') && (
                        <div className="text-white text-left md:w-[550px] xl:w-[550px] z-10 mb-[16px] px-[30px]">
                            {el?.movie_logo_title?.length === 0 ||
                            !el?.movie_logo_title ? (
                                <h1 className="movie-title">{el?.title}</h1>
                            ) : (
                                <div className="flex justify-start items-center">
                                    <img
                                        src={el?.movie_logo_title}
                                        alt={el?.title}
                                        className="object-contain block h-[120px]"
                                    />
                                </div>
                            )}
                            <div
                                className={`flex justify-center sm:justify-center md:justify-start items-center w-full mt-3 md:mt-0 leading-24 text-[#BDBDBD] ${cls.movieInfoText}`}
                            >
                                <div
                                    className={`flex items-center sm:justify-center md:justify-start`}
                                >
                                    {el?.rating_imdb?.rating_imdb && (
                                        <span className="text-xl font-semibold text-white mr-2 hidden sm:flex items-center">
                                            <IMDBIcon />
                                            <span className="ml-[7px]">
                                                {' '}
                                                {
                                                    el?.rating_imdb?.rating_imdb
                                                }{' '}
                                                <span className="text-[#D5DADD]">
                                                    ·
                                                </span>
                                            </span>
                                        </span>
                                    )}
                                    {el?.is_megogo && (
                                        <span className="text-xl font-semibold text-white mr-2.5 hidden sm:flex items-center">
                                            <IMDBIcon />
                                            <span className="ml-[7px]">
                                                {' '}
                                                {el?.rating}{' '}
                                                <span className="text-[#D5DADD]">
                                                    ·
                                                </span>
                                            </span>
                                        </span>
                                    )}
                                    <p className="text-[#A9A7B4] mx-auto font-normal text-[20px] sm:text-[24px] text-center md:text-left">
                                        {el?.country && (
                                            <span>{el?.country} · </span>
                                        )}
                                        {el?.release_year && (
                                            <span>{el?.release_year} · </span>
                                        )}
                                        {!el?.is_megago
                                            ? `${
                                                  el?.genres?.length > 0 &&
                                                  el?.genres[0]?.title
                                              }`
                                            : `${
                                                  filterGenres?.length > 0 &&
                                                  filterGenres[0]?.title
                                              }`}{' '}
                                        {el?.age_restriction === '' ||
                                        !el?.age_restriction ? (
                                            ''
                                        ) : (
                                            <span className="ml-[3px] text-[13px] sm:text-[20px] px-2 py-[1px] bg-[#393939]">
                                                {el?.age_restriction
                                                    ?.toString()
                                                    .charAt(
                                                        el?.toString()
                                                            .age_restriction
                                                            ?.length - 1,
                                                    ) === `+`
                                                    ? el?.age_restriction
                                                    : `${el?.age_restriction?.toString()}+`}
                                            </span>
                                        )}
                                        {el?.duration === 0 ? (
                                            ''
                                        ) : (
                                            <span className="block sm:inline">
                                                {' '}
                                                · {movieDuration}{' '}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {!router.pathname.includes('/preview') && (
                                <div
                                    className={`flex justify-center items-center md:justify-start mt-4 space-x-3 sm:space-x-4 ${cls.buttonSection}`}
                                >
                                    <div className="inline-block">
                                        <MainButton
                                            margin="mr-2"
                                            text={text}
                                            onClick={() => handlePlay()} // watchMovie()
                                            icon={
                                                el?.is_free === false ? (
                                                    <CreditCardIcon />
                                                ) : (
                                                    <PlayIcon />
                                                )
                                            }
                                            additionalClasses="bg-mainColor h-[42px] md:h-[56px] inline-flex w-full bgHoverBlue"
                                        />
                                    </div>
                                    <div className="bg-[#03A9F4] w-[42px] md:w-[56px] h-[42px] md:h-[56px] flex items-center rounded-[12px] bgHoverBlue">
                                        <MainButton
                                            margin="5px"
                                            icon={
                                                like ? (
                                                    <FavoriteLikeIcon />
                                                ) : (
                                                    <FavoriteLikeIconBordered />
                                                )
                                            }
                                            onClick={() => {
                                                setLike((item) => !item)
                                                handleFavourite()
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {device.os.name === 'iOS' && (
                <MobilePlayer
                    setSource={setSource}
                    setErrorCase={setErrorCase}
                    errorCase={errorCase}
                    source={source}
                    player={player}
                    movie={el}
                />
            )}
        </>
    )
}

export default VideoPlayerMobile
