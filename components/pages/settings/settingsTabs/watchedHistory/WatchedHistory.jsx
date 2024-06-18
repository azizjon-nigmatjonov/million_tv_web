import { useState, useRef } from 'react'
import axios from 'utils/axios'
import { useEffect } from 'react'
import { useTranslation } from 'i18n'
import MovieImg from 'public/images/movie.png'
import { DeleteIcon, CancelIcon, CheckIcon, EmptyIcon } from 'components/svg'
import router from 'next/router'
import { parseCookies } from 'nookies'
import { useSelector } from 'react-redux'
import MainButton from 'components/button/MainButton'
import Skeleton from '@mui/material/Skeleton'
import NullData from 'components/errorPopup/NullData'
import cls from './style.module.scss'
import NullDataHistory from './NullDataHistory'

import WatchedMovie from './WatchedMovie'

export default function WatchedHistory() {
    const { t, i18n } = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteActive, setDeleteActive] = useState(false)
    const [data, setData] = useState([])
    const [copyData, setCopyData] = useState(null)
    const [movies, setMovies] = useState([])
    const [allSelect, setAllSelect] = useState(false)
    const [isAllSelectActive, setAllSelectActive] = useState(false)
    const { session_id, profile_id } = parseCookies()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const ScalettonNumber = [1, 2, 3]
    const [error, setError] = useState(false)
    const wrapperRef = useRef(null)
    const [movieActiveCount, setMovieActiveCount] = useState(0)

    const getRecentlyWatchedMovies = () => {
        setLoading(true)
        if (session_id)
            axios
                .get(
                    `recently-watched-movies?SessionId=${session_id}&profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }&lang=${i18n?.language}&page=${1}&limit=${100}`,
                )
                .then((res) => {
                    setCount(res?.data?.count)
                    setData(res?.data?.user_movies)

                    if (!res?.data?.user_movies) setError(true)
                })
                .catch(() => {
                    setError(true)
                })
                .finally(() => {
                    setLoading(false)
                })
    }
    // test
    useEffect(() => {
        if (data) {
            setCopyData(
                data?.map((item) => ({
                    ...item,
                    isActive: false,
                })),
            )
        }
    }, [data])

    useEffect(() => {
        getRecentlyWatchedMovies()
    }, [CurrentUserData])

    const handleMovie = (id, type) => {
        if (deleteActive) {
            const modifiedData = copyData?.find(
                (movie) => movie.movie_key === id,
            )
            if (!modifiedData.isActive) {
                modifiedData.isActive = true
                setMovies((prev) => [...prev, modifiedData])
                setMovieActiveCount((prev) => prev + 1)
            } else {
                modifiedData.isActive = false
                setMovieActiveCount((prev) => prev - 1)
                setMovies((prev) => [...prev, modifiedData])
            }
        } else {
            if (type === 'megogo') {
                router.push(`/movie/${id}?type=megogo`)
            }
            if (type === 'premier') {
                router.push(`/movie/${id}?type=premier`)
            }
            if (!type) {
                router.push(`movie/${id}`)
            }
        }
    }

    useEffect(() => {
        if (movieActiveCount === count) {
            setAllSelectActive(true)
        } else {
            setAllSelectActive(false)
        }
    }, [movieActiveCount])

    useEffect(() => {
        if (allSelect) {
            setAllSelectActive(true)
        } else {
            setAllSelectActive(false)
        }
    }, [allSelect])

    const selectAllMovie = () => {
        const newData = data.map((item) => ({ ...item, isActive: true }))
        setCopyData(newData)
        setAllSelectActive(true)
        setMovieActiveCount(newData?.length)
    }

    const canselSelectall = () => {
        const newData = data.map((item) => ({ ...item, isActive: false }))
        setCopyData(newData)
        setAllSelectActive(false)
        setMovieActiveCount(0)
    }

    useEffect(() => {
        if (!deleteActive && copyData) {
            const oldData = copyData.map((item) => ({
                ...item,
                isActive: false,
            }))
            setCopyData(oldData)
            setAllSelectActive(false)
            setMovieActiveCount(0)
        }
    }, [deleteActive])

    const deleteRecenlyWatchedMovie = (id) => {
        axios
            .delete(
                `recently-watched-movies?profile_id=${
                    CurrentUserData ? CurrentUserData?.id : profile_id
                }`,
                {
                    data: {
                        movie_key: id,
                    },
                },
            )
            .then(() => {
                setTimeout(() => {
                    getRecentlyWatchedMovies()
                }, 0)
            })
    }

    const handleToDelete = () => {
        let result = []
        if (copyData && copyData?.length > 0) {
            for (let i = 0; i < copyData.length; i++) {
                if (copyData[i].isActive) {
                    result.push(copyData[i].movie_key)
                }
            }
        }
        if (result) {
            axios
                .delete(
                    `recently-watched-movies?profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }`,
                    {
                        data: {
                            movie_key: result.join(','),
                        },
                    },
                )
                .then(() => {
                    getRecentlyWatchedMovies()
                    setMovieActiveCount(0)
                    setDeleteActive(false)
                    result = []
                    setTimeout(() => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })
                    }, 300)
                })
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', detectKeyPress, true)
    }, [])

    const detectKeyPress = (e) => {
        if (e.keyCode === 27) {
            setDeleteActive(false)
        }
    }

    return (
        <div className={cls.wrapper} ref={wrapperRef}>
            {copyData?.length > 0 && !loading && (
                <div
                    onClick={() => setDeleteActive((prev) => !prev)}
                    className="absolute right-0 -top-10 text-[17px] cursor-pointer flex items-center space-x-2"
                >
                    {deleteActive ? (
                        <CancelIcon fill={'#fff'} />
                    ) : (
                        <DeleteIcon fill={'#fff'} />
                    )}
                    <span>{deleteActive ? t('cancel') : t('delete')}</span>
                </div>
            )}
            {deleteActive && !loading && !error && (
                <div
                    onClick={() =>
                        isAllSelectActive ? canselSelectall() : selectAllMovie()
                    }
                    className="mb-4 items-center space-x-3 cursor-pointer group inline-flex"
                >
                    <div
                        className={`w-[18px] h-[18px] duration-200 rounded-[4px] border-[1.5px] inline-flex items-center justify-center 
                                              ${
                                                  isAllSelectActive
                                                      ? 'bg-[#03A9F4] border-transparent'
                                                      : 'border-[#5b596480] group-hover:border-[#ffffffcd]'
                                              }`}
                    >
                        {isAllSelectActive && <CheckIcon fill="#111" />}
                    </div>
                    <span className="text-[15px] text-[#E0E0E0] font-normal">
                        {t('selectAll')}
                    </span>
                </div>
            )}

            <div className="profile-grids gap-4">
                {!loading &&
                    copyData &&
                    copyData?.map((elm, index) => (
                        <div key={index}>
                            <WatchedMovie
                                el={elm}
                                movieType={
                                    elm.is_megogo
                                        ? 'megogo'
                                        : elm.is_premier
                                        ? 'premier'
                                        : 'ordinary'
                                }
                                key={index}
                                text="kino"
                                fullWidth={true}
                                MovieImg={MovieImg}
                                movieKey={elm.movie_key}
                                episodeKey={elm.episode_key}
                                seasonKey={elm.season_key}
                                fullDuration={elm.seconds}
                                lastTime={elm.seconds}
                                watchedPercentage={elm.watched_percentage}
                                deleteRecenlyWatchedMovie={
                                    deleteRecenlyWatchedMovie
                                }
                            />
                        </div>
                    ))}
            </div>

            {movieActiveCount > 0 && !loading && !error && (
                <MainButton
                    onClick={() => handleToDelete()}
                    text={t('deleteSelects')}
                    additionalClasses="w-full xl:w-[485px] bg-[#03A9F4] bgHoverBlue rounded-[8px] mx-auto mt-20"
                />
            )}

            {loading && !error && (
                <div className="">
                    <div className="w-full grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 grid-rows-3 gap-x-2 sm:gap-x-4 gap-y-5 sm:gap-y-5">
                        {ScalettonNumber.map((item) => (
                            <div
                                key={item}
                                className="h-[142px] 2xl:h-[180px] extra:h-[240px]"
                            >
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
            )}

            {!loading && !copyData?.length && <NullDataHistory />}
        </div>
    )
}
