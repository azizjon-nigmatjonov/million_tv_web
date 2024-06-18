import React, { useEffect, useRef, useState } from 'react'
import { CarouselRightArrow, ArrowRight } from 'components/svg'
import MovieImg from 'public/images/movie.png'
import { useTranslation } from 'i18n'
import LastMovie from 'components/cards/LastMovie'
import DeviceDetector from 'device-detector-js'
import router from 'next/router'

const MoviesHistory = ({
    bodyClass,
    movies,
    page,
    count,
    deleteRecenlyWatchedMovie,
    linkToPage,
}) => {
    const ScrollBody = useRef(null)
    const [currentScroll, setCurrentScroll] = useState(0)
    const [maxScroll, setMaxScroll] = useState(0)
    const { t } = useTranslation()
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)

    useEffect(() => {
        if (ScrollBody.current && maxScroll === 0)
            setMaxScroll(ScrollBody.current.scrollWidth)
    }, [ScrollBody.current])

    const scroll = (left) => {
        const visibleDivWidth = ScrollBody.current.clientWidth

        if (left) {
            setCurrentScroll((ScrollBody.current.scrollLeft += visibleDivWidth))
            ScrollBody.current.scrollLeft += visibleDivWidth
        } else {
            setCurrentScroll(
                (ScrollBody.current.scrollLeft =
                    visibleDivWidth - ScrollBody.current.scrollLeft),
            )
            ScrollBody.current.scrollLeft -= visibleDivWidth
        }
    }

    const [windowWidth] = useWindowSize()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    return (
        count > 0 && (
            <div className="relative md:pt-1 xl:pt-5 mt-[50px]">
                <div className="wrapper group flex items-center justify-between md:justify-start md:mb-1 text-white svg-parent">
                    {linkToPage ? (
                        <div onClick={() => router.push(linkToPage)}>
                            <a>
                                <h2 className="section-title cursor-pointe cursor-pointer oswald-family">
                                    {t('continue_Watch')}
                                </h2>
                            </a>
                        </div>
                    ) : (
                        <h2
                            className="section-title cursor-pointe cursor-pointer"
                            dangerouslySetInnerHTML={{
                                __html: `${t('continue_Watch')}`,
                            }}
                        />
                    )}
                    {linkToPage && (
                        <div onClick={() => router.push(linkToPage)}>
                            <a>
                                <div className="flex items-center cursor-pointer justify-center">
                                    <span className=" oswald-family text-transparent -translate-y-0.5 w-0 h-6 sm:group-hover:flex group-hover:w-[100%] group-hover:h-7 overflow-hidden group-hover:text-[#fff] transform duration-500 ease-in-out font-normal text-10 self-end ml-2 hidden sm:block">
                                        {t('open_all')}
                                    </span>
                                    <span className="show-all-icon translate-y-0.5">
                                        <ArrowRight
                                            width={
                                                windowWidth < 600 ? '24' : '32'
                                            }
                                            height={
                                                windowWidth < 600 ? '24' : '32'
                                            }
                                        />
                                    </span>
                                </div>
                            </a>
                        </div>
                    )}
                </div>

                <div
                    className={`scroll-wrapper mb-[40px] md: mb-[20px] ${
                        movies?.length > 3 || page > 1 ? 'group' : ''
                    }`}
                >
                    <div
                        onScroll={() => {
                            if (
                                ScrollBody.current.scrollWidth -
                                    ScrollBody.current.clientWidth ===
                                    ScrollBody.current.scrollLeft &&
                                count > movies?.length
                            ) {
                                // getHistoryMovies(page + 1)
                            }
                            setMaxScroll(
                                ScrollBody.current.scrollWidth -
                                    ScrollBody.current.clientWidth,
                            )
                            setCurrentScroll(ScrollBody.current.scrollLeft)
                        }}
                        ref={ScrollBody}
                        className={`scroll-body pt-3 sm:pt-5 flex space-x-2 sm:space-x-8 overflow-y-hidden overflow-x-scroll items-start ${
                            bodyClass || ''
                        }`}
                    >
                        {movies?.map((elm, i) => (
                            <LastMovie
                                el={elm}
                                movieType={
                                    elm.is_megogo
                                        ? 'megogo'
                                        : elm.is_premier
                                        ? 'premier'
                                        : 'ordinary'
                                }
                                key={i}
                                text="kino"
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
                        ))}
                    </div>
                    {currentScroll > 0 && (
                        <div className="scroll-arrow px-4 bg-gradient-to-r from-black to-transparent group-hover:opacity-100">
                            <button
                                type="button"
                                className="transform rotate-180 h-full cursor-pointer mt-6"
                                onClick={() => {
                                    scroll(false)
                                }}
                            >
                                <CarouselRightArrow />
                            </button>
                        </div>
                    )}
                    {maxScroll > currentScroll && movies?.length > 4 && (
                        <div className="scroll-arrow right-0 px-4 justify-end bg-gradient-to-l from-black to-transparent group-hover:opacity-100">
                            <button
                                type="button"
                                className="cursor-pointer mt-6 h-full"
                                onClick={() => {
                                    scroll(true)
                                    // getHistoryMovies(page + 1)
                                }}
                            >
                                <CarouselRightArrow />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    )
}

export default MoviesHistory
