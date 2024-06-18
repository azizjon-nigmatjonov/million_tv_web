import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { IMDBIcon } from 'components/svg'
import router from 'next/router'
import { Pagination } from 'swiper'

const MobileBanner = ({ movies }) => {
    const [sortedArr, setSortedArr] = useState([])
    const handleRedirect = (item) => {
        if (item?.is_news) {
            if (item.link !== 'https://example.com') {
                window.open(item.link, '_blank')
            }
            if (item?.is_tvchannel) {
                router.push(`/tv/tv-video?key=${item.tv_channel_id}`)
            }
            return
        }
        function movieType() {
            const obj = {}
            if (item?.is_megogo) {
                obj.type = 'megogo'
                obj.id = item.id
            } else if (item?.is_premier) {
                obj.type = 'premier'
                obj.id = item.id
            } else {
                obj.type = 'uzdigital'
                obj.id = item.slug
            }
            return obj
        }
        const url = `/movie/${movieType().id}`
        router.push(url)
    }

    useEffect(() => {
        let responsiveMovies = movies
            .sort(() => Math.random() - 0.5)
            .slice(0, movies.length)
        setSortedArr(responsiveMovies)
    }, [movies])
    return (
        <>
            <div className="h-full px-[10px]">
                <Swiper
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    spaceBetween={16}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    loop={true}
                    // navigation={true}
                    // modules={[Navigation]}
                    className="h-full mobileSwiper p-[0]"
                >
                    {sortedArr?.map((item, ind) => {
                        return (
                            <SwiperSlide key={ind}>
                                <div className="relative h-[548px]">
                                    <div className="h-full">
                                        <div className="after_gradient"></div>

                                        <img
                                            onClick={() => handleRedirect(item)}
                                            className="h-full w-full object-cover rounded-[12px] flex justify-center"
                                            src={
                                                item?.file_info
                                                    ?.image_for_mobile
                                                    ? item.file_info
                                                          .image_for_mobile
                                                    : item?.file_info?.image
                                            }
                                            alt="image"
                                        />
                                    </div>
                                    <div className="absolute left-0 bottom-[0px] z-[5] w-full bg-linear-wrapper">
                                        <div className="mb-0 wrapper banner-wrapper p-[160px]">
                                            <span className="text-3xl font-semibold text-[#ffffff]">
                                                {item?.title}
                                            </span>
                                            <div className="text-sm font-medium text-[#EDEDED] flex mt-2">
                                                {item?.rating_imdb
                                                    ?.rating_imdb && (
                                                    <span className="text-sm font-semibold text-white mr-2 flex">
                                                        <IMDBIcon width="30" />
                                                        <span className="ml-[7px]">
                                                            {' '}
                                                            {
                                                                item
                                                                    ?.rating_imdb
                                                                    ?.rating_imdb
                                                            }{' '}
                                                            <span className="text-[#D5DADD] w-[6px] h-[6px]">
                                                                ·
                                                            </span>
                                                        </span>
                                                    </span>
                                                )}
                                                {item?.is_megogo && (
                                                    <span className="text-sm font-semibold text-white mr-2.5 flex items-center">
                                                        <IMDBIcon />
                                                        <span className="ml-[7px]">
                                                            {' '}
                                                            {item?.rating}{' '}
                                                            <span className="text-[#D5DADD]">
                                                                ·
                                                            </span>
                                                        </span>
                                                    </span>
                                                )}
                                                {item?.country ? (
                                                    <span className="mr-2 ptext">
                                                        {item?.country}
                                                        <span className="round"></span>
                                                    </span>
                                                ) : null}
                                                {item?.release_year > 0 ? (
                                                    <span className="mr-2  ptext">
                                                        {item?.release_year}
                                                        <span className="round"></span>
                                                    </span>
                                                ) : null}
                                                {/* {item.genres ? (
                                                    !item?.is_megogo ? (
                                                        <span>
                                                            {`${
                                                                item?.genres
                                                                    ?.length >
                                                                    0 &&
                                                                item?.genres[0]
                                                                    ?.title
                                                            }`}{' '}
                                                            <span className="ml-0.5 mr-1">
                                                                {' '}
                                                                ·
                                                            </span>
                                                        </span>
                                                    ) : filterGenres.length >
                                                      0 ? (
                                                        `${filterGenres[0]?.title}`
                                                    ) : item?.is_megogo ? (
                                                        item?.genres[0]
                                                    ) : (
                                                        ''
                                                    )
                                                ) : null} */}

                                                {item.age_restriction ? (
                                                    <span className="ring-1 ring-border-xl ring-[#E9E9E9] px-1 rounded ml-1">
                                                        {item?.age_restriction
                                                            ?.toString()
                                                            .charAt(
                                                                item?.age_restriction?.toString()
                                                                    .length - 1,
                                                            ) === `+`
                                                            ? item?.age_restriction
                                                            : ` ${item?.age_restriction?.toString()}+`}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </>
    )
}

export default MobileBanner
