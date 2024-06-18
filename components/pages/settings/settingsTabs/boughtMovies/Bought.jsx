import React, { useEffect, useState } from 'react'
import NextLink from 'components/common/link'
import axios from '../../../../../utils/axios'

import { parseCookies } from 'nookies'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useTranslation } from 'i18n'
import NullDataFav from '../favorites/NullDataFav'
import formatMoney from 'utils/formatMoney'
import CScrollText from 'components/CElements/CScrollText'

export default function BoughtMovies() {
    const { session_id } = parseCookies()
    const [movies, setMovies] = useState([])
    const { t, i18n } = useTranslation()

    useEffect(() => {
        axios
            .get('/purchases', {
                params: {
                    SessionId: session_id,
                    limit: 10,
                    page: 1,
                    lang: i18n?.language,
                },
            })
            .then((res) => {
                setMovies(res?.data?.purchases ?? [])
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const [isShimmerActive, setShimmerActive] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShimmerActive(true)
        }, 400)
    }, [])

    return (
        <>
            {movies?.length > 0 ? (
                <div className="w-full">
                    {isShimmerActive ? (
                        <div className="w-full movies-grid-colums">
                            {movies?.map((item, index) => (
                                <div
                                    key={item.movie_slug}
                                    className="inline-block w-full"
                                >
                                    <NextLink
                                        href={`/movie/${item.movie_slug}`}
                                    >
                                        <a>
                                            <div className="rounded-[8px] w-full overflow-hidden hover:scale-105 duration-300">
                                                <LazyLoadImage
                                                    className="object-cover gridImagesProperties w-full"
                                                    src={item.logo_image}
                                                ></LazyLoadImage>
                                            </div>
                                            <p className="mt-[10px] text-[18px] font-bold whitespace-nowrap overflow-hidden">
                                                {/* {item.title} */}
                                                <CScrollText
                                                    element={item}
                                                    text={item.title}
                                                />
                                            </p>
                                            <p className="text-[#3DE8FF]">
                                                {formatMoney(item.price) + ' '}{' '}
                                                {t('sum')}
                                            </p>
                                        </a>
                                    </NextLink>
                                </div>
                            ))}
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                ''
            )}
            {!movies?.length && (
                <NullDataFav
                    subtext={'lets_buy'}
                    loading={!isShimmerActive}
                    count={2}
                />
            )}
        </>
    )
}
