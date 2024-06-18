import { PremierTag } from 'components/svg'
import style from './Story.module.scss'
import { useTranslation } from 'i18n'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { motion } from 'framer-motion'
import NextLink from 'components/common/link'
import { useEffect, useMemo, useState } from 'react'
import router from 'next/router'
import MegaGoTag from '../../public/vectors/MegagoTag.svg'
// import Marquee from 'react-fast-marquee'

function Movie({
    el,
    layoutWidth = '',
    imgWidth = '',
    megogoType,
    handleMovieClick = () => {},
    hideContxt,
}) {
    const { t } = useTranslation()
    const [marquee, setMarque] = useState(false)

    const [windowWidth] = useWindowSize()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const movieType = useMemo(() => {
        if (el?.is_megogo) {
            return 'megogo'
        } else if (el?.is_premier) {
            return 'premier'
        } else {
            return 'uzdigital'
        }
    }, [el])

    return (
        <div>
            <div
                className={`text-left sm:min-w-full h-auto transition duration-300 ease-in-out transform md:hover:scale-110 ${layoutWidth} animationTextScroll overflow-auto`}
                id="overlay"
                onClick={(e) => {
                    e.preventDefault()
                    handleMovieClick()
                }}
            >
                <NextLink
                    href={
                        window.innerWidth > 1200
                            ? `/movie/${el?.slug}`
                            : `/preview/${el?.slug}`
                    }
                >
                    <a
                        onMouseEnter={() =>
                            setMarque(
                                el?.title?.length >
                                    (windowWidth < 640 ? 13 : 18)
                                    ? true
                                    : false,
                            )
                        }
                        onMouseLeave={() => setMarque(false)}
                    >
                        <div
                            className={`w-full medium:w-full relative ${imgWidth}`}
                        >
                            {el?.is_megogo && !el?.related_movies && (
                                <div
                                    className={`bg-mainColor  ${
                                        windowWidth[0] > 600
                                            ? 'w-[28px] h-[28px]'
                                            : 'w-[24px] h-[24px]'
                                    } z-[2] rounded-[4px] absolute right-2 top-2 text-white uppercase text-[13px] font-semibold flex items-center justify-center`}
                                >
                                    <MegaGoTag />
                                </div>
                            )}
                            {el?.is_premier && !el?.related_movies && (
                                <div
                                    className="bg-mainColor ${
                                    windowWidth[0] > 600
                                        ? 'w-[28px] h-[28px]'
                                        : 'w-[24px] h-[24px]'
                                } z-[2] rounded-[4px] absolute right-2 top-2 text-white uppercase text-[14px] font-semibold flex items-center justify-center"
                                >
                                    <PremierTag />
                                </div>
                            )}
                            <div className={style.tags}>
                                {el?.tags?.map((tag, i) => (
                                    <div key={i}>
                                        {
                                            <span
                                                className={`${style.tag_movie} bg-[${tag?.color}]`}
                                                style={{
                                                    backgroundColor: tag?.color
                                                        ? tag?.color
                                                        : '#B90043',
                                                }}
                                            >
                                                {tag.title}
                                            </span>
                                        }
                                    </div>
                                ))}
                                {el?.quality && (
                                    <>
                                        <span
                                            className={`${style?.megago_secont_tag} ${style.tag_movie}`}
                                        >
                                            {el?.quality}
                                        </span>
                                        <span className={style?.megago_tag}>
                                            <MegaGoTag />
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className={style.card}>
                                <LazyLoadImage
                                    alt={el?.id}
                                    effect="blur"
                                    delayTime={300000000}
                                    threshold={100}
                                    className={`rounded-[4px] md:rounded-lg object-cover w-full ${imgWidth}`}
                                    src={
                                        !el?.is_premier &&
                                        !el.is_megogo &&
                                        !megogoType
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
                                    }
                                />
                            </div>
                        </div>
                        <div className="truncate h-[40px] mt-[8px] relative flex flex-col">
                            {marquee ? (
                                <marquee>
                                    <span
                                        className={`text-white overflow-hidden text-[15px] leading-[20px] ${
                                            el?.title?.length > 45
                                                ? 'w-[400px]'
                                                : el?.title?.length > 35
                                                ? 'w-[350px]'
                                                : el?.title?.length > 25
                                                ? 'w-[400px] sm:w-[300px]'
                                                : el?.title?.length > 13
                                                ? 'w-[200px] sm:w-[250px]'
                                                : 'w-[200px]'
                                        }  md:text-8 md:leading-10 line-clamp-2 font-medium ${
                                            style.movie_title
                                        }`}
                                    >
                                        {el?.title}
                                    </span>
                                </marquee>
                            ) : (
                                <span
                                    className={`text-white overflow-hidden text-[15px] leading-[20px] oswald-family ${
                                        el?.title?.length > 45
                                            ? 'w-[400px]'
                                            : el?.title?.length > 35
                                            ? 'w-[350px]'
                                            : el?.title?.length > 25
                                            ? 'w-[350px] sm:w-[300px]'
                                            : el?.title?.length > 13
                                            ? 'w-[200px]'
                                            : 'w-[200px]'
                                    }  md:text-8 md:leading-10 line-clamp-2 font-medium ${
                                        style.movie_title
                                    }`}
                                >
                                    {el?.title}
                                </span>
                            )}
                            {/* {hideContxt !== 'paymentType' && (
                                <div>
                                    {el?.payment_type === 'free' ? (
                                        <span
                                            style={{ color: '#8B97B0' }}
                                            className="absolute bottom-0 font-400 text-7 leading-8  truncate"
                                        >
                                            {t('free')}
                                        </span>
                                    ) : el?.payment_type === 'svod' ||
                                      el?.is_megogo ||
                                      el?.is_premier ? (
                                        <span
                                            style={{ color: '#03A9F4' }}
                                            className="absolute bottom-0 font-400 text-7 leading-8  truncate"
                                        >
                                            {t('svod')}
                                        </span>
                                    ) : el?.payment_type === 'tvod' ? (
                                        <span className="absolute bottom-0 text-red-500 font-400 text-7 leading-8  truncate">
                                            {el?.pricing?.substracted_price /
                                                100 +
                                                ` ${t('sum')}`}
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            )} */}
                        </div>
                    </a>
                </NextLink>
            </div>
        </div>
    )
}

export default Movie
