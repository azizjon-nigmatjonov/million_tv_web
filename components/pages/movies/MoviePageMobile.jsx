import React, { useEffect, useState } from 'react'
import ScrollComponent from 'components/scroll/Scrollcomponent'
import { useIsMobile } from 'hooks/useIsMobile'
import VideoPlayerMobile from 'components/video/VideoPlayerMobile'
import { Router } from 'i18n'
import { useTranslation } from 'i18n'
import { parseCookies } from 'nookies'
import axios from '../../../utils/axios'
import {
    ExpredIcon,
    SuccessSybscriptionIcon,
    PlusIconSmall,
    IMDBIcon,
} from 'components/svg'
import { showAlert } from 'store/reducers/alertReducer'
import ErrorPopup from 'components/errorPopup/Popup'
import { useDispatch } from 'react-redux'
import router from 'next/router'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import CommentsModal from '../../../components/modal/CommentsModal'
import Skeleton from '@mui/material/Skeleton'

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

const MoviePageMobile = ({
    el,
    // feedbacks,
    related,
    profile,
    megago_genres,
    CurrentUserData,
}) => {
    const [isMobile] = useIsMobile()
    const [feedbacksData, setFeedbacksData] = useState()
    const [feedbacks, setFeedbacks] = useState([])
    const [showFeedbackForm, setShowFeedbackForm] = useState(false)
    const [expired, setExpired] = useState(false)
    const [tvotModal, setTvotModal] = useState(false)
    const [buyFreeTrail, setBuyFreeTrail] = useState(false)
    const dispatch = useDispatch()
    const [purchase, setPurchase] = useState('')
    const [filterGenres, setFilterGenres] = useState([])
    const [subscription, setSubscription] = useState([])
    const [openComment, setOpenComment] = useState(false)
    const [checkSubscription, setCheckSubscription] = useState({})
    const [text, setText] = useState('')
    const { access_token, user_id } = parseCookies()

    const [commentsDislike, setCommentsDislike] = useState([])
    const [commentsLike, setCommentsLike] = useState([])
    const [typeOfComment, setTypeOfComment] = useState('like')
    const [commentsModalOpen, setCommentsModalOpen] = useState(false)

    const { t, i18n } = useTranslation()
    const [sessionsLimin, setSessionsLimin] = useState()

    const actorData = el?.staffs?.filter(
        (el) => el.position === 'actor' || el?.type === 'ROLE',
    )

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleOpenCommentDialog = () => {
        setOpenComment(true)
    }

    const handleClickCommentsModalOpen = () => {
        setCommentsModalOpen(true)
    }

    const handleCloseCommentDialog = () => {
        setOpenComment(false)
    }

    const languageOfWebsite = i18n?.language

    const getAllCommentTypeLike = () => {
        axios
            .get('/comments', {
                params: {
                    type: 'like',
                },
            })
            .then(function (response) {
                if (languageOfWebsite == 'ru') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.ru,
                    }))
                    setCommentsLike(data)
                } else if (languageOfWebsite == 'uz') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.uz,
                    }))
                    setCommentsLike(data)
                } else {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.en,
                    }))
                    setCommentsLike(data)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const getAllCommentTypeDislike = () => {
        axios
            .get('/comments', {
                params: {
                    type: 'dislike',
                },
            })
            .then(function (response) {
                if (languageOfWebsite == 'ru') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.ru,
                    }))
                    setCommentsDislike(data)
                } else if (languageOfWebsite == 'uz') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.uz,
                    }))
                    setCommentsDislike(data)
                } else {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.en,
                    }))
                    setCommentsDislike(data)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const toggleComment = (id) => {
        const copyProducts = [...commentsLike]
        const modifiedProducts = copyProducts.map((product) => {
            if (id === product.id) {
                product.checked = !product.checked
            }

            return product
        })

        setCommentsLike(modifiedProducts)
    }
    const toggleCommentDislike = (id) => {
        const copyProducts = [...commentsDislike]
        const modifiedProducts = copyProducts.map((product) => {
            if (id === product.id) {
                product.checked = !product.checked
            }

            return product
        })

        setCommentsDislike(modifiedProducts)
    }
    const sendDislikesData = () => {
        let data = commentsDislike
            .filter((item) => !!item.checked)
            .map((item) => item.id)

        axios
            .post('/movie-comment', {
                comment_id: data.toString(),
                comment_type: typeOfComment,
                movie_key: el?.is_premier || el?.is_megogo ? el?.id : el?.slug,
                profile_id: CurrentUserData?.id
                    ? CurrentUserData?.id
                    : profile.id,
                profile_name: CurrentUserData?.name
                    ? CurrentUserData?.name
                    : profile?.name,
                user_id: user_id,
                user_name: profile.name,
            })
            .then(function (response) {
                setCommentsModalOpen(false)
                getAllCommentTypeDislike()
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const sendLikesData = () => {
        let data = commentsLike
            .filter((item) => !!item.checked)
            .map((item) => item.id)

        axios
            .post('/movie-comment', {
                comment_id: data.toString(),
                comment_type: typeOfComment,
                movie_key: el?.is_premier || el?.is_megogo ? el?.id : el?.slug,
                profile_id: CurrentUserData?.id
                    ? CurrentUserData?.id
                    : profile?.id,
                profile_name: CurrentUserData?.name
                    ? CurrentUserData?.name
                    : profile?.name,
                user_id: user_id,
                user_name: profile.name,
            })
            .then(function (response) {
                setCommentsModalOpen(false)
                getAllCommentTypeLike()
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const handleCloseCommentsModalClose = () => {
        setCommentsModalOpen(false)
    }
    useEffect(() => {
        getAllCommentTypeLike()
        getAllCommentTypeDislike()
    }, [])

    useEffect(() => {
        setShowFeedbackForm(false)
    }, [router.query])

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
            axios
                .post(`/check-purchase-access`, {
                    movie_slug: el?.slug,
                })
                .then((res) => {
                    setPurchase(res.data.has_access)
                })
                .catch((err) => console.log(err))
        } else {
            // console.log('no purchase')
        }
    }, [])

    useEffect(() => {
        el.genres?.forEach((elem) => {
            const foundGenre = megago_genres.find((id) => id.id === elem)
            setFilterGenres((old) => [...old, foundGenre])
        })
    }, [])

    useEffect(() => {
        if (access_token) {
            if (el?.payment_type === 'svod') {
                axios
                    .post(
                        `check-subscription-access`,
                        {
                            key: el.is_megago
                                ? 'megogo'
                                : `${el.category.slug}`,
                        },
                        { Authorization: access_token },
                    )
                    .then((res) => {
                        setCheckSubscription(res.data)
                        setExpired(!res.data.has_access)
                        if (res.data.has_access) {
                            setText('Смотреть')
                            if (el.access_message === 'SESSION_LIMIT_ENDED') {
                                axios
                                    .post(
                                        'get-user-sessions',
                                        {
                                            key: el.is_megago
                                                ? 'megogo'
                                                : `${el.category.slug}`,
                                        },
                                        // {
                                        //     Authorization: access_token,
                                        //     SessionId: session_id,
                                        // },
                                    )
                                    .then((res) => {
                                        setSessionsLimin(res.data)
                                    })
                            }
                        } else {
                            axios
                                .get(
                                    `subscription/category?key=${
                                        el?.is_megago
                                            ? 'megogo'
                                            : el.category.slug
                                    }`,
                                )
                                .then((res) =>
                                    setSubscription(res.data.categories),
                                )

                            if (res.data.is_watched_free_trial) {
                                setText(t('buy_subscription'))
                            } else {
                                setText(t('start_free'))
                            }
                        }
                    })
            }
        }
    }, [])

    const ganres = () => {
        if (!el.is_megago) {
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

    const staffs = (position) => {
        if (!el.is_megago) {
            const filterStaffs = el?.staffs?.filter((item) => {
                if (item.position == position) {
                    const stuff = `${item?.staff?.first_name} ${item?.staff?.last_name}`
                    return stuff
                }
            })
            const staffs = filterStaffs?.map(
                (item) =>
                    `${item?.staff?.first_name} ${item?.staff?.last_name}`,
            )
            const ganre = staffs?.join(', ')
            return ganre
        } else {
            const filterStaffs = el?.staffs?.filter((item) => {
                if (item.type == position) {
                    const stuff = `${item.name}`
                    return stuff
                }
            })

            const staffs = filterStaffs?.map((item) => `${item?.name}`)

            const ganre = staffs?.join(', ')
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
    const tabStyles = {
        width: MenuActive ? '100%' : 'auto',
        display: 'inline-flex',
        textColor: '#fff',
        borderBottom: 1,
        borderColor: '#ffffff55',
    }
    const tabWrapperStyle = {
        color: '#ffffff77',
        fontSize: '22px',
        textTransform: 'unset',
        padding: '12px 0px',
        marginRight: '28px',
    }
    const customTheme = createTheme({
        palette: {
            primary: {
                main: '#ffffff55',
            },
            secondary: {
                main: '#fff',
            },
        },
    })
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: '60px',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }))

    const [descriptionMore, setDescriptionMore] = useState(false)
    useEffect(() => {
        if (el?.description?.length > 400) {
            setDescriptionMore(true)
        } else {
            setDescriptionMore(false)
        }
    }, [])

    const [descriptionItem, setDescriptionItem] = useState(
        el?.description?.trim().substring(0, 305) + '. ',
    )

    const [descriptionActive, setDescriptionActive] = useState(false)
    const openDescription = () => {
        setDescriptionItem(el?.description?.trim().substring(0, 305) + '. ')
        setDescriptionActive(!descriptionActive)
    }

    const closeDescription = () => {
        setDescriptionItem(el?.description + '. ')
        setDescriptionActive(!descriptionActive)
    }

    const ScalettonNumber = [1, 2, 3, 4, 5]
    const [isShimmerActive, setShimmerActive] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShimmerActive(true)
        }, 500)
    }, [])

    return (
        <>
            {isShimmerActive && el ? (
                <div>
                    <div className="flex flex-col">
                        <div>
                            <div
                                className={`${!isMobile && 'mt-[-80px]'} mb-5`}
                            >
                                <VideoPlayerMobile
                                    CurrentUserData={CurrentUserData}
                                    setTvotModal={setTvotModal}
                                    tvotModal={tvotModal}
                                    el={el ? el : []}
                                    purchase={purchase}
                                    filterGenres={filterGenres}
                                    subscription={subscription}
                                    checkSubscription={checkSubscription}
                                />
                            </div>
                            <div className="wrapper">
                                {descriptionMore ? (
                                    <div className="text-7 leading-12 text-white mb-2">
                                        {descriptionItem}
                                        {!descriptionActive ? (
                                            <span
                                                className="underline text-[#cccc]"
                                                onClick={closeDescription}
                                            >
                                                {t('read_more')}
                                            </span>
                                        ) : (
                                            <span
                                                className="underline text-[#cccc]"
                                                onClick={openDescription}
                                            >
                                                {t('close')}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-7 leading-12 text-white mb-2">
                                        {el?.description}
                                        {el?.rating_imdb?.rating_imdb && (
                                            <span className="text-[15px] font-bold text-[#A9A7B4] mr-2.5 flex sm:hidden">
                                                IMDb
                                                <span className="ml-[7px]">
                                                    {' '}
                                                    {
                                                        el?.rating_imdb
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
                                )}
                                {/* <div className="flex justify-start items-center space-x-3 mb-8">
                                <p className="text-[15px] leading-10 text-[#A9A7B4] cursor-pointer">
                                    IMDB: 3,2
                                </p>
                                <p className="text-[15px] leading-10 text-[#A9A7B4] cursor-pointer">
                                    KP: 3,2
                                </p>
                            </div> */}
                            </div>

                            {el?.trailer && (
                                <div>
                                    {el?.trailer[0]?.videos &&
                                        el?.trailer[0]?.videos[0]?.file_name
                                            ?.length > 0 && (
                                            <ScrollComponent
                                                el={el ? el : {}}
                                                type="trailer"
                                                title={t('watch_trailer')}
                                                additionalClasses="mt-5"
                                            />
                                        )}
                                </div>
                            )}
                            <div>
                                <ScrollComponent
                                    type="actor"
                                    title={t('actors_Creators')}
                                    el={el}
                                />
                            </div>

                            {el?.is_serial && (
                                <>
                                    {el?.seasons && (
                                        <ScrollComponent
                                            el={el}
                                            setTvotModal={setTvotModal}
                                            tvotModal={tvotModal}
                                            purchase={purchase}
                                            checkSubscription={
                                                checkSubscription
                                            }
                                            subscription={subscription}
                                            type="season"
                                            title="Сезон"
                                            additionalClasses="mt-5"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {/* ============ COMMENTS ==================== */}
                    <div className="my-[30px]">
                        <div className="flex justify-between sm:justify-start items-center wrapper">
                            <h2 className="section-title mr-5">
                                {t('reviews')}
                            </h2>
                            <button
                                className="bg-mainColor flex items-center font-normal text-white text-[15px] py-[10px] sm:py-[17px] px-[10px] lg:px-[0] leading-[20px] rounded-[12px]"
                                type="button"
                                onClick={() => handleClickCommentsModalOpen()}
                            >
                                <PlusIconSmall />
                                {t('write_comment')}
                            </button>
                        </div>
                        <ScrollComponent
                            dataMovie={
                                feedbacks ? feedbacks?.movie_comments : []
                            }
                            type="feedbacks"
                        />
                    </div>

                    {el?.is_megogo ? (
                        <ScrollComponent
                            dataMovie={
                                el?.is_megogo ? el?.related_movies : related
                            }
                            type="movie"
                            title={t('resemblant')}
                            megogoType={true}
                        />
                    ) : (
                        <ScrollComponent
                            dataMovie={related}
                            type="movie"
                            title={t('resemblant')}
                        />
                    )}

                    {checkSubscription.has_access === false &&
                        checkSubscription.is_watched_free_trial &&
                        checkSubscription?.message === 'FREE_TRIAL_EXPIRED' &&
                        expired && (
                            <ErrorPopup
                                openModal={expired}
                                setOpenModal={setExpired}
                                link={() => {
                                    setExpired((prev) => !prev)
                                    if (el?.is_megago) {
                                        Router.push(`/premier/${el?.id}`)
                                    } else {
                                        document
                                            .getElementById('payment')
                                            .scrollIntoView()
                                    }
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
                                    if (el?.is_megago) {
                                        Router.push(
                                            `/movie/${el?.id}?type=megogo`,
                                        )
                                    } else {
                                        document
                                            .getElementById('payment')
                                            .scrollIntoView()
                                    }
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
                                        el?.is_megago
                                            ? `/video-player?id=${el.id}&ind=0`
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

                    <CommentsModal
                        commentsDislike={commentsDislike}
                        toggleCommentDislike={toggleCommentDislike}
                        sendDislikesData={sendDislikesData}
                        setTypeOfComment={setTypeOfComment}
                        sendLikesData={sendLikesData}
                        toggleComment={toggleComment}
                        commentsLike={commentsLike}
                        commentsModalOpen={commentsModalOpen}
                        handleCloseCommentsModalClose={
                            handleCloseCommentsModalClose
                        }
                    />
                </div>
            ) : (
                <div>
                    <div className="min-h-[680px] h-[100vh]">
                        <div className="absolute w-[300px] left-1/2 -translate-x-1/2 md:left-[56px] bottom-[60px] flex md:block flex-col items-center">
                            <div className="w-[80%] md:w-[280px]">
                                <Skeleton
                                    sx={{
                                        bgcolor: '#111B33',
                                        width: '100%',
                                        height: '62px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                            </div>
                            <div className="w-[250px] md:w-[35%] hidden md:block">
                                <Skeleton
                                    sx={{
                                        bgcolor: '#111B33',
                                        mt: '22px',
                                        width: '100%',
                                        height: '30px',
                                        borderRadius: '12px',
                                        marginTop: '16px',
                                    }}
                                    variant="wave"
                                />
                            </div>
                            <div className="w-[290px] md:w-[40%] h-[30px] md:h-[62px]">
                                <Skeleton
                                    sx={{
                                        bgcolor: '#111B33',
                                        mt: '22px',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                            </div>
                            <div className="flex items-center space-x-[22px] mt-5 md:mt-3">
                                <Skeleton
                                    sx={{
                                        bgcolor: '#111B33',
                                        mt: '22px',
                                        width: '220px',
                                        height: '56px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                                <div className="w-[56px] md:w-[180px] h-[56px]">
                                    <Skeleton
                                        sx={{
                                            bgcolor: '#111B33',
                                            mt: '22px',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '12px',
                                            marginTop: '10px',
                                        }}
                                        variant="wave"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="wrapper mt-[56px]">
                        <Skeleton
                            sx={{
                                bgcolor: '#111B33',
                                mt: '22px',
                                width: '280px',
                                height: '40px',
                                borderRadius: '12px',
                            }}
                            variant="wave"
                        />
                        <div className="grid grid-flow-row-dense grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 extraLarge:grid-cols-10 grid-rows-3 gap-x-2 sm:gap-x-5 gap-y-5 sm:gap-y-10 my-[56px]">
                            {ScalettonNumber.map((item) => (
                                <div key={item} className="h-[220px]">
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
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MoviePageMobile
