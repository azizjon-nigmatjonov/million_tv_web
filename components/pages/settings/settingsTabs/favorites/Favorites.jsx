import React, { useEffect, useState } from 'react'
import axios from 'utils/axios'
import { useTranslation } from 'i18n'
import { parseCookies } from 'nookies'
import { useSelector } from 'react-redux'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import NextLink from 'components/common/link'
import Skeleton from '@mui/material/Skeleton'
import { motion } from 'framer-motion'
import cls from './style.module.scss'
import NullDataFav from './NullDataFav'

export default function Favorites() {
    const { profile_id } = parseCookies()
    const [favourites, setFavourites] = useState([])

    const [loading, setLoading] = useState(false)
    const { t, i18n } = useTranslation()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const [currentPage, setCurrentPage] = useState(1)
    const ScalettonNumber = [1, 2, 3, 4]
    const [error, setEror] = useState(false)
    const [marquee, setMarque] = useState(false)
    const [windowWidth] = useWindowSize()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }
    useEffect(() => {
        if (i18n?.language) {
            setLoading(true)
            if (CurrentUserData || profile_id) {
                axios
                    .get(
                        `/favourites/profile/${
                            CurrentUserData?.id
                                ? CurrentUserData?.id
                                : profile_id
                        }?lang=${
                            i18n?.language
                        }&limit=${16}&page=${currentPage}`,
                    )
                    .then((res) => {
                        setFavourites(res?.data?.favourites)
                    })
                    .catch(() => {
                        setEror(true)
                        setLoading(false)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        }
    }, [CurrentUserData, currentPage])

    return (
        <div className={`min-h-[70vh] w-full ${cls.wrapper}`}>
            <div>
                {favourites?.length > 0 && !loading && !error && (
                    <ul className="profile-grids gap-4">
                        {favourites?.map((elem, ind) => (
                            <li
                                key={ind}
                                className="inline-block hover:scale-105 duration-300"
                            >
                                <NextLink href={`/movie/${elem?.slug}`}>
                                    <a>
                                        <div
                                            className={`group w-full rounded-[4px] cursor-pointer overflow-hidden relative h-[220px] xl:h-[260px] extra:h-[280px]`}
                                        >
                                            <LazyLoadImage
                                                className="min-w-full min-h-full max-h-full object-cover"
                                                src={elem?.logo_image}
                                            ></LazyLoadImage>
                                        </div>
                                        <p className="mt-1 text-[18px] font-bold whitespace-nowrap overflow-hidden">
                                            {
                                                elem?.title?.[
                                                    `title_${i18n.language}`
                                                ]
                                            }
                                        </p>

                                        <span className="text-[16px] mt-[2px]">
                                            {elem?.payment_type === 'tvod' ? (
                                                <span className="text-[#F50057]">
                                                    {elem?.price / 100 +
                                                        ` ${t('sum')}`}
                                                </span>
                                            ) : elem?.payment_type === 'svod' ||
                                              elem?.is_megogo ||
                                              elem?.is_premier ? (
                                                <span className="text-[#4589FF]">
                                                    {t('svod')}
                                                </span>
                                            ) : (
                                                <span className="text-[#ffffff55]">
                                                    {t('free')}
                                                </span>
                                            )}
                                        </span>
                                    </a>
                                </NextLink>
                            </li>
                        ))}
                    </ul>
                    // </InfiniteScroll>
                )}
            </div>

            {loading && !error && (
                <div className="movies-grid-colums">
                    {ScalettonNumber.map((item) => (
                        <div key={item} className="gridImagesProperties]">
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
            )}

            {!favourites?.length && !loading && <NullDataFav />}
        </div>
    )
}
