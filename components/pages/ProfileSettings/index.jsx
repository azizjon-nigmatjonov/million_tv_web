import router from 'next/router'
import cls from './style.module.scss'
import { ArrowRight, HeartBroke, HeartFill } from 'components/svg'
import MainButton from 'components/button/MainButton'
import axios from 'utils/axios'
import InfiniteScroll from 'react-infinite-scroll-component'

import { Router } from 'i18n'
import { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useTranslation } from 'i18n'
import { parseCookies, setCookie } from 'nookies'
import { useDispatch, useSelector } from 'react-redux'
import { setRecommendationValue } from 'store/actions/application/recommendationActions'
import { setProfilesList } from 'store/actions/application/profilesAction'
import { motion } from 'framer-motion'
import { showAlert } from 'store/reducers/alertReducer'

const ProfileSettings = ({ data, setCurrentPage }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { session_id } = parseCookies()

    const films = data?.map((movie) => ({ ...movie, isActive: false }))
    const [copyData, setCopyData] = useState(films)
    const [movies, setMovies] = useState([])
    const [movesToPost, setMovesToPost] = useState([])

    const RouterID = router.router.query.id
    const ProfilesList = useSelector((state) => state?.profile?.profiles_list)
    const ProfileID =
        ProfilesList?.profiles?.length > 0 ? ProfilesList?.profiles[0]?.id : ''

    const handleMovie = (ID) => {
        const modifiedData = copyData.find((movie) => movie.id == ID)
        if (!modifiedData?.isActive) {
            modifiedData.isActive = true
            setMovies((prev) => [...prev, modifiedData])
            movesToPost.push(modifiedData)
        } else {
            modifiedData.isActive = false
            setMovies((prev) => [...prev, modifiedData])
            movesToPost.pop(modifiedData)
        }
    }

    const postToFavoriteProfile = () => {
        let result = []
        let generIds = []
        let movieCountries = []
        if (movesToPost && movesToPost?.length > 0) {
            for (let i = 0; i < movesToPost?.length; i++) {
                result = result.concat(movesToPost[i].genres)
            }
            for (let i in movesToPost) {
                movieCountries.push(movesToPost[i].country)
            }
        }
        if (result) {
            for (let j in result) {
                generIds.push(result[j].id)
            }
        }
        const idsGener = generIds.join(',')
        const countiesMovies = movieCountries.join(',')

        if (idsGener && countiesMovies) {
            axios
                .put(
                    `/profile/${
                        RouterID ? RouterID : ProfileID
                    }/add-favourites`,
                    {
                        favourite_actors: '',
                        favourite_countries: '',
                        favourite_genres: idsGener,
                    },
                )
                .then((response) => {
                    sessionStorage.setItem('listSelected', 'active')
                    sessionStorage.setItem('userActivation', 'false')
                    updateProfileList()
                    dispatch(setRecommendationValue(response?.data))
                    setTimeout(() => {
                        if (router?.query?.movie) {
                            if (router?.query?.type === 'megogo') {
                                router.push(
                                    `/movie/${Router.query.movie}?type=megogo`,
                                )
                            } else if (Router?.query?.type === 'premier') {
                                router.push(
                                    `/movie/${Router.query.movie}?type=premier`,
                                )
                            } else {
                                router.push(`movie/${Router.query.movie}`)
                            }
                        } else {
                            router.push('/')
                        }
                        dispatch(
                            showAlert(
                                t('you_registered_successfully'),
                                'success',
                            ),
                        )
                    }, 300)
                })
                .catch(() => {})
        }
    }

    const handleSkip = () => {
        if (router?.query?.movie) {
            if (router?.query?.type === 'megogo') {
                router.push(`/movie/${Router.query.movie}?type=megogo`)
            } else if (Router?.query?.type === 'premier') {
                router.push(`/movie/${Router.query.movie}?type=premier`)
            } else {
                router.push(`movie/${Router.query.movie}`)
            }
        } else {
            router.push('/')
        }
        setTimeout(() => {
            dispatch(showAlert(t('you_registered_successfully'), 'success'))
        }, 300)
    }

    const updateProfileList = () => {
        axios
            .get('/profiles', {
                headers: {
                    SessionId: session_id,
                },
            })
            .then((res) => {
                dispatch(setProfilesList(res?.data ? res?.data : null))
            })
            .catch((err) => {})
    }

    useEffect(() => {
        document.addEventListener('keydown', detectKeyPress, true)
    }, [])
    const cancel = () => {
        // this function was not defined before
    }
    const detectKeyPress = (e) => {
        if (e.keyCode === 13) {
            postToFavoriteProfile()
        }
    }

    return (
        <>
            <div className="wrapper text-white pt-6 relative">
                <div className="md:w-1/2">
                    <div
                        onClick={() => handleSkip()}
                        className="flex align-center gap-row-[8px] my-[28px] cursor-pointer"
                    >
                        <h1 className="text-[#8B97B0] font-[500] ">
                            {t('skip_next')}
                        </h1>
                        <span>
                            <ArrowRight
                                width="24px"
                                height="24px"
                                fill="#8B97B0"
                            />
                        </span>
                    </div>
                    <h1 className="text-[34px] font-[700]">
                        {t('customize_your_profile')}
                    </h1>
                    <p className="text-white text-opacity-[0.72]">
                        {t('select_five_movies')}
                    </p>
                </div>
                <InfiniteScroll
                    dataLength={data?.length || 0}
                    style={{ overflow: 'visible' }}
                    next={() => {
                        setCurrentPage((pre) => ++pre)
                    }}
                    // hasMore={noMore}
                >
                    <div className="grid-profile-settings mt-[70px] mb-[56px]">
                        {copyData?.map((item, ind) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    duration: 0.05,
                                    delay: 0.05 * ind,
                                    ease: [0.1, 0.01, -0.01, 0.1],
                                }}
                            >
                                <div className="inline-block w-full mr-[18px]">
                                    <div>
                                        <a>
                                            <div
                                                onClick={() =>
                                                    handleMovie(item?.id)
                                                }
                                                className={`gridImagesProperties relative group w-full overflow-hidden rounded-[4px] cursor-pointer ${
                                                    item.isActive
                                                        ? cls.imgProfileUpdateActive
                                                        : cls.imgProfileUpdate
                                                }`}
                                            >
                                                <LazyLoadImage
                                                    className="min-w-full min-h-full max-h-full object-cover"
                                                    src={item?.logo_image}
                                                ></LazyLoadImage>
                                                <div
                                                    className={`${
                                                        item.isActive
                                                            ? 'group-hover:block'
                                                            : 'hidden'
                                                    } group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]`}
                                                >
                                                    {item?.isActive ? (
                                                        <HeartFill />
                                                    ) : (
                                                        <HeartBroke />
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-[12px] sm:text-[15px] font-medium whitespace-nowrap overflow-hidden">
                                                {item?.title}
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </InfiniteScroll>

                <div
                    className={`fixed bottom-0 left-0 flex justify-center w-full p-[20px] z-[999] duration-200 ${cls.FavoriteProfileBottom}`}
                >
                    {movesToPost?.length >= 5 ? (
                        <MainButton
                            onClick={() => postToFavoriteProfile()}
                            text={t('continue')}
                            additionalClasses="w-full xl:w-[485px] bg-[#03a9f4] bgHoverBlue rounded-[8px]"
                        />
                    ) : (
                        <MainButton
                            onClick={() => cancel()}
                            text={t('continue')}
                            additionalClasses="w-full font-[400] xl:w-[485px] rounded-[8px] bg-[#111B33]"
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default ProfileSettings
