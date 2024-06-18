import React, { useEffect, useState, useRef } from 'react'
import ScrollComponent from 'components/scroll/Scrollcomponent'
import { useIsMobile } from 'hooks/useIsMobile'
import VideoPlayer from 'components/video/VideoPlayer'
import { Router } from 'i18n'
import { useTranslation } from 'i18n'
import { parseCookies } from 'nookies'
import axios from '../../../utils/axios'
import {
    ExpredIcon,
    SuccessSybscriptionIcon,
    NullDataSearchIcon,
} from 'components/svg'
import { showAlert } from 'store/reducers/alertReducer'
import ErrorPopup from 'components/errorPopup/Popup'
import { useDispatch } from 'react-redux'
import router from 'next/router'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Staff from 'components/cards/Staff'
import ScrollSubscriotion from 'components/scroll/scrollSubscription'
import TrailerAll from 'components/cards/TrailerAll'
import NullData from 'components/errorPopup/NullData'
import CommentsPageWrapper from '../Comments'
import Serials from './Serials'
function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const MoviePage = ({
    el,
    related,
    profile,
    CurrentUserData,
    loading,
    errorCase,
}) => {
    const commentsRef = useRef(null)
    const [isMobile] = useIsMobile()
    const [expired, setExpired] = useState(false)
    const [tvotModal, setTvotModal] = useState(false)
    const [buyFreeTrail, setBuyFreeTrail] = useState(false)
    const dispatch = useDispatch()
    const [purchase, setPurchase] = useState('')
    const [filterGenres, setFilterGenres] = useState([])
    const [subscription, setSubscription] = useState([])
    const [checkSubscription, setCheckSubscription] = useState({})
    const [text, setText] = useState('')
    const { access_token, user_id, session_id } = parseCookies()

    const { t, i18n } = useTranslation()
    const [sessionsLimin, setSessionsLimin] = useState()
    const subscriptionRef = useRef(null)
    const [megago_genres, setMegagoGenres] = useState(null)

    useEffect(() => {
        if (router?.query?.movie && router?.query?.type === 'megogo') {
            axios
                .get(`megogo/configuration?lang=${i18n?.language}`)
                .then((response) => {
                    setMegagoGenres(response?.data?.data?.genres)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [router?.query, i18n?.language])

    useEffect(() => {
        if (
            checkSubscription?.has_access &&
            checkSubscription?.purchase_notification
        ) {
            dispatch(showAlert(t('sabscription_active_text'), 'success'))
        }
    }, [checkSubscription])

    useEffect(() => {
        if (el?.payment_type === 'tvod') {
            if (session_id) {
                axios
                    .post(`/check-purchase-access?SessionId=${session_id}`, {
                        movie_slug: el?.slug,
                    })
                    .then((res) => {
                        setPurchase(res?.data?.has_access)
                    })
                    .catch(() => {})
            }
        }
    }, [el, router, session_id])

    useEffect(() => {
        if (megago_genres) {
            el?.genres?.forEach((elem) => {
                const foundGenre = megago_genres.find((id) => id.id === elem)
                setFilterGenres((old) => [...old, foundGenre])
            })
        }
    }, [el, megago_genres])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [el])

    useEffect(() => {
        if (access_token) {
            if (el?.payment_type === 'svod') {
                axios
                    .post(
                        `check-subscription-access`,
                        {
                            key: el?.is_premier
                                ? 'premier'
                                : el?.is_megogo
                                ? 'megogo'
                                : `${el.category.slug}`,
                        },
                        { Authorization: access_token },
                    )
                    .then((res) => {
                        setCheckSubscription(res?.data)
                        setTimeout(() => {
                            setExpired(!res?.data?.has_access)
                        }, 1300)
                        if (res?.data?.has_access) {
                            setText('Смотреть')
                            if (el.access_message === 'SESSION_LIMIT_ENDED') {
                                axios
                                    .post(
                                        'get-user-sessions',
                                        {
                                            key: el?.is_premier
                                                ? 'premier'
                                                : `${el.category.slug}`,
                                        },
                                        // {
                                        //     Authorization: access_token,
                                        //     SessionId: session_id,
                                        // },
                                    )
                                    .then((res) => {
                                        setSessionsLimin(res?.data)
                                    })
                            }
                        } else {
                            axios
                                .get(
                                    `subscription/category?key=${
                                        el?.is_premier
                                            ? 'premier'
                                            : el?.is_megogo
                                            ? 'megogo'
                                            : el.category.slug
                                    }`,
                                )
                                .then((response) => {
                                    setSubscription(response?.data?.categories)
                                })

                            if (res?.data?.is_watched_free_trial) {
                                setText(t('buy_subscription'))
                            } else {
                                setText(t('start_free'))
                            }
                        }
                    })
            }
        }
    }, [access_token, el?.payment_type, router])

    const ganres = () => {
        if (!el?.is_megogo) {
            const genres = el?.genres?.map((item) => {
                const stuff = `${item.title}`
                return stuff
            })

            const ganre = genres?.join(', ')
            return ganre
        } else {
            const genres = filterGenres?.map((megago_genres) => {
                const stuff = `${megago_genres.title}`
                return stuff
            })

            const ganre = genres.join(', ')
            return ganre
        }
    }

    function useWindowSize() {
        const [size, setSize] = useState([window.innerWidth])
        return size
    }
    const [windowWidth] = useWindowSize()
    let MenuActive = true
    if (windowWidth > 540) {
        MenuActive = false
    } else {
        MenuActive = true
    }

    const [descriptionMore, setdescriptionMore] = useState(false)
    const [descriptionActive, setDescriptionActive] = useState(false)
    const [descriptionItem, setDescriptionItem] = useState('')
    useEffect(() => {
        if (el?.description?.length > 400) {
            setdescriptionMore(true)
            setDescriptionItem(el?.description?.trim().substring(0, 305) + '. ')
        } else {
            setdescriptionMore(false)
            setDescriptionItem(el?.description)
        }
    }, [el?.description])
    const openDescriptionItem = () => {
        setDescriptionItem(el?.description?.trim().substring(0, 305) + '. ')
        setDescriptionActive(!descriptionActive)
    }
    const closeDescriptionItem = () => {
        setDescriptionItem(el?.description + ' ')
        setDescriptionActive(!descriptionActive)
    }

    const ScalettonNumber = [1, 2, 3, 4, 5]

    const scrollToSubscription = () => {
        window.scrollTo(0, subscriptionRef?.current?.offsetTop - 100)
    }

    // useEffect(() => {
    //     if (
    //         router?.query?.from === 'banner' &&
    //         router?.query?.paymentType === 'svod'
    //     ) {
    //         setTimeout(() => {
    //             scrollToSubscription()
    //         }, 500)
    //     }
    // }, [el, router])

    const handleScrollReviews = () => {
        window.scrollTo(0, commentsRef.current.offsetTop - 400)
        console.log('commentsRef', commentsRef?.current?.offsetTop)
    }

    return (
        <>
            {!loading && !errorCase ? (
                <div id="moviePage">
                    <div className="flex flex-col mb-8">
                        <div className={`${!isMobile && 'mt-[-80px]'}`}>
                            <VideoPlayer
                                CurrentUserData={CurrentUserData}
                                setTvotModal={setTvotModal}
                                tvotModal={tvotModal}
                                el={el}
                                purchase={purchase}
                                filterGenres={filterGenres}
                                subscription={subscription}
                                checkSubscription={checkSubscription}
                                handleScrollReviews={handleScrollReviews}
                            />
                        </div>

                        {el?.staffs?.length ? (
                            <div className="mt-8 xl:mt-[100px] extraLarge:mt-[70px] text-white">
                                <h2 className="single-page-section-title wrapper oswald-family">
                                    {t('creators')}
                                </h2>
                                <div className="mt-4">
                                    <Staff el={el ? el : []} />
                                </div>
                            </div>
                        ) : null}

                        {el?.description && (
                            <div className="wrapper text-[#8B97B0]">
                                <div className="md:w-3/4 mt-10 2xl:mt-12">
                                    <h2 className="mb-3 text-white oswald-family">
                                        {t('description')}
                                    </h2>
                                    {descriptionItem && (
                                        <span className="">
                                            {descriptionMore ? (
                                                <div>
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: descriptionItem,
                                                        }}
                                                    >
                                                        {/* {descriptionItem} */}
                                                    </span>
                                                    {descriptionActive ? (
                                                        <span
                                                            className="text-white text-opacity-[0.6] border-b border-opacity-[0.6] cursor-pointer"
                                                            onClick={() =>
                                                                openDescriptionItem()
                                                            }
                                                        >
                                                            {t('close')}
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="text-mainTextColor cursor-pointer"
                                                            onClick={() =>
                                                                closeDescriptionItem()
                                                            }
                                                        >
                                                            {t('read_more')}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <span>
                                                        {descriptionItem
                                                            ? descriptionItem
                                                            : el?.description}
                                                    </span>
                                                    <div className="block sm:hidden mt-2">
                                                        {el?.rating_imdb
                                                            ?.rating_imdb && (
                                                            <span className="text-[15px] font-bold text-[#A9A7B4] mr-2.5 flex sm:hidden">
                                                                IMDb
                                                                <span className="ml-[7px]">
                                                                    {' '}
                                                                    {
                                                                        el
                                                                            ?.rating_imdb
                                                                            ?.rating_imdb
                                                                    }
                                                                </span>
                                                            </span>
                                                        )}
                                                        {el?.is_megogo && (
                                                            <span className="text-[15px] font-bold text-[#A9A7B4] mr-2.5 flex sm:hidden">
                                                                IMDb
                                                                <span className="ml-[7px]">
                                                                    {' '}
                                                                    {el?.rating}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <CommentsPageWrapper
                            commentsRef={commentsRef}
                            movie_key={el?.slug}
                            link="/comments"
                        />

                        {/* {checkSubscription?.has_access === false &&
                            subscription?.length > 0 && (
                                <div
                                    ref={subscriptionRef}
                                    className="mt-10 text-white wrapper"
                                >
                                    <h2 className="single-page-section-title mb-8 sm:mb-11">
                                        {t('subscription')}
                                    </h2>
                                    <div>
                                        <ScrollSubscriotion
                                            el={
                                                subscription ? subscription : []
                                            }
                                            setBuyFreeTrail={setBuyFreeTrail}
                                            checkSubscription={
                                                checkSubscription
                                            }
                                            setSubscription={setSubscription}
                                            type="subscription"
                                            text={text}
                                            title={t('subscription')}
                                            additionalClasses="w-[350px]"
                                            cost={subscription?.subscriptions}
                                        />
                                    </div>
                                </div>
                            )} */}

                        {el?.is_serial && el?.seasons && (
                            <div className="mt-[20px]">
                                <Serials list={el.seasons} slug={el?.slug} />
                                {/* <ScrollComponent
                                    seasonsProperty="w-[300px] h-[200px] hover:scale-105 duration-300"
                                    el={el ? el : {}}
                                    setTvotModal={setTvotModal}
                                    tvotModal={tvotModal}
                                    purchase={purchase}
                                    checkSubscription={checkSubscription}
                                    subscription={subscription}
                                    type="season"
                                    additionalClasses="mt-5"
                                /> */}
                            </div>
                        )}

                        {el?.trailer?.length && (
                            <div className="mt-14 mb-10 text-white">
                                <h2
                                    className="single-page-section-title wrapper oswald-family"
                                    style={{ marginBottom: '20px' }}
                                >
                                    {t('trailers')}
                                </h2>
                                <div className="flex flex-wrap gap-4 wrapper mt-8 mb-8">
                                    {el.trailer.map((element, index) => (
                                        <TrailerAll
                                            key={index}
                                            additionalClasses="w-[280px] h-[180px]"
                                            trailerData={element}
                                            elem={el}
                                            ind={0}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <ScrollComponent
                        dataMovie={related}
                        type="movie"
                        title={t('resemblant')}
                        imgWidth="h-[152px] sm:h-[220px]"
                    />

                    {checkSubscription.has_access === false &&
                        checkSubscription.is_watched_free_trial &&
                        checkSubscription?.message === 'FREE_TRIAL_EXPIRED' &&
                        router?.router?.asPath.substring(0, 8) !== '/premier' &&
                        expired && (
                            <ErrorPopup
                                openModal={expired}
                                setOpenModal={setExpired}
                                link={() => {
                                    setExpired((prev) => !prev)
                                    setTimeout(() => {
                                        scrollToSubscription()
                                    }, 200)
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
                                    setExpired((prev) => !prev)
                                    setTimeout(() => {
                                        scrollToSubscription()
                                    }, 200)
                                }}
                                title={t('expired')}
                                textButton={t('activate')}
                                text={t('expired_follow')}
                                icon={<ExpredIcon />}
                            />
                        )}
                    {buyFreeTrail && (
                        <ErrorPopup
                            openModal={expired}
                            setOpenModal={setExpired}
                            link={() => {
                                if (el?.is_serial) {
                                    Router.push(
                                        `  /video-player?key=${el.slug}&ind=0&seasonNumber=1&episodeNumber=1`,
                                    )
                                } else {
                                    Router.push(
                                        el?.is_megogo
                                            ? `/video-player?id=${el.id}&type=megogo&ind=0`
                                            : `/video-player?key=${el.slug}&ind=0`,
                                    )
                                }
                            }}
                            title={t('Congratulations')}
                            textButton={t('start_watch')}
                            text={t('active_free_trail')}
                            icon={<SuccessSybscriptionIcon />}
                        />
                    )}
                </div>
            ) : (
                !errorCase && (
                    <div className="w-[100vw] min-h-[720px] h-[100vh]">
                        <Skeleton
                            sx={{
                                bgcolor: '#111B33',
                                width: '100%',
                                height: '100%',
                                borderRadius: '8px',
                            }}
                            variant="wave"
                        />
                    </div>
                )
            )}
            {/* errorCase && !loading */}
            {errorCase && !loading && (
                <div className="my-5 flex justify-center md:my-20 w-[40%] mx-auto">
                    <NullData
                        icon={<NullDataSearchIcon />}
                        title={t('noData')}
                        // text={t(
                        //     'maybe_see_other_pages_where_data_exists',
                        // )}
                        textButton={t('back')}
                        link={() => {
                            Router.push(`/catalog`)
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default MoviePage
