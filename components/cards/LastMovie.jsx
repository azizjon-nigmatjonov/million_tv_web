import { useTranslation } from 'i18n'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { motion } from 'framer-motion'
import ProgressBar from 'components/common/progress-bar/ProgressBar'
import { useMemo, useState } from 'react'
import { PlayIconMini, CancelIcon } from 'components/svg'
import router from 'next/router'
import { useSelector } from 'react-redux'
import { parseCookies } from 'nookies'
import { PremierTag } from 'components/svg'
import MegaGoTag from '../../public/vectors/MegagoTag.svg'

function LastMovie({
    el,
    episodeKey,
    seasonKey,
    watchedPercentage,
    fullDuration,
    lastTime,
    movieType,
    deleteRecenlyWatchedMovie,
    movieKey,
    fullWidth = false,
    additionalHeight,
}) {
    const { t, i18n } = useTranslation()
    const hours = useMemo(() => Math.floor(fullDuration / 60 / 60), [])
    const [showCancel, setShowCancel] = useState(false)
    const minutes = useMemo(
        () => Math.floor(fullDuration / 60) - hours * 60,
        [],
    )
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { profile_id } = parseCookies()

    const handleDeleteRecentlyWatched = () => {
        if (movieType === 'megogo') {
            deleteRecenlyWatchedMovie(movieKey)
        }
        if (movieType === 'premier') {
            deleteRecenlyWatchedMovie(movieKey)
        }
        if (movieType === 'ordinary') {
            deleteRecenlyWatchedMovie(movieKey)
        }
    }
    const endTime = useMemo(() => {
        const hours = Math.floor((el.duration - el.seconds) / 60 / 60)
        return {
            hours,
            minutes: Math.floor((el.duration - el.seconds) / 60 - hours * 60),
        }
    }, [el])

    const handleMovie = () => {
        if (parseInt(el?.season_key) > 0) {
            if (movieType === 'megogo') {
                router.push(
                    `/video-player?id=${movieKey}&episodeId=${el?.episode_id}&ind=0&type=megogo&seasonNumber=${seasonKey}&episodeNumber=${episodeKey}&lastTime=${lastTime}`,
                )
            } else if (movieType === 'premier') {
                router.push(
                    `/video-player?id=${movieKey}&episodeId=${
                        el?.episode_id
                    }&trailer=${false}&ind=0&type=premier&seasonNumber=${seasonKey}&episodeNumber=${episodeKey}&lastTime=${lastTime}`,
                )
            } else {
                router.push(
                    `/video-player?key=${movieKey}&ind=0&seasonNumber=${seasonKey}&episodeNumber=${episodeKey}&lastTime=${lastTime}`,
                )
            }
        } else {
            if (movieType === 'megogo') {
                router.push(
                    `/video-player?id=${movieKey}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=megogo&lastTime=${lastTime}`,
                )
            }
            if (movieType === 'premier') {
                router.push(
                    `/video-player?id=${movieKey}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=premier&lastTime=${lastTime}`,
                )
            }
            if (movieType === 'ordinary') {
                router.push(
                    `/video-player?key=${movieKey}&ind=0&lastTime=${lastTime}`,
                )
            }
        }
    }

    const handleMoviePlay = () => {
        handleMovie()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.3,
                ease: [0.6, 0.01, -0.05, 0.9],
            }}
        >
            <div className="text-left h-auto transition duration-300 ease-in-out transform cursor-pointer md:hover:scale-105 hover:shadow group relative">
                <a
                    onClick={() => handleMoviePlay()}
                    onMouseEnter={() => setShowCancel(el?.id)}
                    onMouseLeave={() => setShowCancel(false)}
                >
                    <div
                        className={` ${
                            fullWidth ? 'w-full' : 'w-[273px] mobile:w-[317px]'
                        } relative  ${
                            additionalHeight ? additionalHeight : 'h-[120px]'
                        } sm:h-[173px]`}
                    >
                        <LazyLoadImage
                            alt={el?.id}
                            effect="blur"
                            delayTime={10000}
                            className={` object-cover w-full rounded-tl-md rounded-tr-md ${
                                additionalHeight
                                    ? additionalHeight
                                    : 'h-[120px]'
                            } sm:h-[170px]`}
                            src={
                                !el?.is_megago
                                    ? `${
                                          el?.logo_image
                                              ? el?.logo_image
                                              : '../vectors/movie-image-vector.svg'
                                      }`
                                    : `${
                                          el?.image?.big
                                              ? el?.image?.big
                                              : el?.image?.small
                                              ? el?.image?.small
                                              : el?.image?.original
                                              ? el?.image?.original
                                              : '../vectors/movie-image-vector.svg'
                                      }`
                                    ? el?.logo_image
                                    : el?.logo_image
                            }
                        />
                        <div className="absolute bottom-0 left-0 right-0 z-[2] overflow-hidden w-full bg-secondryBackground">
                            <ProgressBar
                                height="6px"
                                progress={watchedPercentage}
                                bgcolor="#03A9F4"
                            />
                        </div>
                        {showCancel == el?.id && (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <PlayIconMini width="22" height="24" />
                            </div>
                        )}
                    </div>
                    <div
                        className={`z-[2] relative rounded-b-[12px] h-[70px] overflow-hidden bg-secondryBackground p-3 flex justify-between flex-col  ${
                            fullWidth ? 'w-full' : 'w-[273px] mobile:w-[317px]'
                        }`}
                    >
                        <span className="text-white font-[600] whitespace-nowrap overflow-hidden oswald-family">
                            {i18n?.language === 'en'
                                ? el?.title?.en
                                : i18n?.language === 'ru'
                                ? el?.title?.ru
                                : el?.title?.uz}
                        </span>

                        <p className="text-whiteLighter text-[12px]">
                            Осталось{' '}
                            {endTime?.hours ? `${endTime.hours}  ч. ` : ''}{' '}
                            {endTime?.minutes ? `${endTime.minutes} мин` : ''}{' '}
                        </p>
                    </div>
                </a>
                {showCancel == el?.id && (
                    <div
                        onMouseEnter={() => setShowCancel(el?.id)}
                        onClick={() => handleDeleteRecentlyWatched()}
                        className={`cursor-pointer absolute hover:rotate-90 right-2 top-2 bg-[#010614] w-[32px] h-[32px] rounded-full z-10 duration-300 flex items-center justify-center`}
                    >
                        <CancelIcon width="12" height="12" />
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default LastMovie
