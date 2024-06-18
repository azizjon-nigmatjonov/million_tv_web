import { useEffect, useMemo, useState } from 'react'
import {
    FullScreenIcon,
    MoreIcon,
    MuteIcon,
    ReloadIcon,
    VolumeIcon,
    IMDBIcon,
    MoreIconFilled,
} from 'components/svg'
import MainButton from 'components/button/MainButton'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import axios from 'utils/axios'
import { parseCookies } from 'nookies'

export default function BannerElementContents({
    element,
    isEnded = false,
    volume = false,
    currentTime,
    changeMuteState = () => {},
    handleLoad = () => {},
}) {
    const router = useRouter()
    const { t, i18n } = useTranslation()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [like, setLike] = useState(false)
    const { access_token } = parseCookies()

    const movieDuration = useMemo(() => {
        if (element?.duration) {
            let hours = Math.floor(element?.duration / 3600)
            let minutes = Math.floor((element?.duration % 3600) / 60)
            return hours + `${t('hour')}` + ' ' + minutes + `${t('minutes')}`
        }
    }, [element])

    const handleFavourite = () => {
        if (!access_token) {
            router.push(`/registration?movie=${element?.slug}`)
            return
        }
        let method = 'delete'
        let data = {
            slug: element?.slug,
        }
        if (!like) {
            method = 'post'
            data = {
                is_megogo: element?.is_megogo ? true : false,
                is_premier: element?.is_premier ? true : false,
                lang: i18n?.language,
                logo_image: element?.is_megogo
                    ? element?.trailer?.image
                    : element?.is_premier
                    ? element.file_info?.image
                    : element?.image?.original ?? '',
                movie_id: element?.id,
                payment_type: element.payment_type,
                price: element?.price ? element?.price : 0,
                rating_imdb: element?.is_megogo
                    ? parseInt(element?.rating)
                    : element?.rating_imdb?.rating_imdb
                    ? parseInt(element?.rating_imdb.rating_imdb)
                    : 0,
                slug: element?.slug ? element?.slug : '',
                title: {
                    title_en: i18n?.language === 'en' ? 'en' : '',
                    title_ru: i18n?.language === 'ru' ? 'ru' : '',
                    title_uz: i18n?.language === 'uz' ? 'uz' : '',
                },
            }
        }

        axios[method](
            `/favourites/profile/${
                CurrentUserData?.id ? CurrentUserData?.id : profile_id
            }`,
            like ? { data } : data,
        ).then((res) => {
            setLike((prev) => !prev)
        })
    }

    useEffect(() => {
        setLike(!!element?.is_favourite)
    }, [element?.is_favourite])

    return (
        <div className="banner_content z-[2] absolute right-0 bottom-[-2px] w-full flex justify-between items-end h-[300px]">
            <div className="w-full pb-[50px] md:pb-[115px] xl:pb-[50px] wrapper relative">
                <div className="text-white md:w-1/2">
                    <div className="mb-6 md:pl-9 xl:pl-0">
                        {/* {element?.movie_logo_title ? (
                            <img
                                src={element?.movie_logo_title}
                                alt={element?.title}
                                className="object-cover"
                                style={{
                                    maxWidth: '350px',
                                }}
                            />
                        ) : ( */}
                        <span className="text-3xl font-semibold oswald-family">
                            {element?.title}
                        </span>
                        {/* )} */}
                    </div>
                </div>
                <div className="flex justify-between items-center z-[2] space-x-4 relative pb-10">
                    <div className="text-lg font-medium text-[#D5DADD] flex">
                        {element?.release_year > 0 && (
                            <span className="mr-2">
                                {element?.release_year} ·
                            </span>
                        )}
                        {element?.country && (
                            <span className="mr-2">{element?.country} ·</span>
                        )}

                        {element?.rating_imdb?.rating_imdb && (
                            <span className="text-xl font-semibold text-white mr-2 hidden sm:flex">
                                <IMDBIcon />
                                <span className="ml-[7px]">
                                    {element?.rating_imdb?.rating_imdb}{' '}
                                    <span className="text-[#D5DADD]">·</span>
                                </span>
                            </span>
                        )}
                        {element?.is_megogo && (
                            <span className="text-xl font-semibold text-white mr-2.5 hidden flex">
                                <IMDBIcon />
                                <span className="ml-[7px]">
                                    {element?.rating}{' '}
                                    <span className="text-[#D5DADD]">·</span>
                                </span>
                            </span>
                        )}

                        {movieDuration && (
                            <span className="ml-2">{movieDuration} </span>
                        )}
                        {element?.age_restriction && (
                            <span>
                                {element?.age_restriction
                                    ? `${element?.age_restriction}+`
                                    : `0+`}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {element?.link &&
                            !element.link.includes('https://example.com/') && (
                                <MainButton
                                    onClick={() =>
                                        window.open(element.link, '_blank')
                                    }
                                    text={t('more')}
                                    additionalClasses="font-medium h-[44px] bg-mainColor rounded-[8px]"
                                    icon={<MoreIcon />}
                                    margin="mr-[5px]"
                                />
                            )}

                        {!element.is_news && (
                            <MainButton
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleFavourite()
                                }}
                                text={t('selected_movie')}
                                additionalClasses={`h-[44px] bg-mainColor rounded-[8px] ${
                                    like ? '' : 'text-whiteLighter'
                                }`}
                                icon={
                                    like ? (
                                        <MoreIconFilled />
                                    ) : (
                                        <MoreIcon
                                            stroke={like ? 'white' : '#8B97B0'}
                                        />
                                    )
                                }
                                margin="mr-[5px]"
                            />
                        )}

                        {(element?.trailer?.length > 0
                            ? element?.trailer
                            : [])[0]?.videos[0]?.file_name?.length > 0 && (
                            <div className="hidden md:flex space-x-4">
                                {!isEnded ? (
                                    <>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                changeMuteState()
                                            }}
                                            className="rounded-[8px] w-[44px] h-[44px] videPlayBtnsBackground flex justify-center items-center cursor-pointer"
                                        >
                                            {volume ? (
                                                <VolumeIcon />
                                            ) : (
                                                <MuteIcon />
                                            )}
                                        </div>

                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(
                                                    `/video-player/trailer?key=${
                                                        element?.slug
                                                            ? element.slug
                                                            : element?.title
                                                    }&ind=0&currentTime=${
                                                        currentTime?.current
                                                    }`,
                                                )
                                            }}
                                            className={`rounded-[8px] w-[44px] h-[44px] videPlayBtnsBackground flex justify-center items-center cursor-pointer ${
                                                element.is_news ? 'hidden' : ''
                                            }`}
                                        >
                                            <FullScreenIcon />
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleLoad()
                                        }}
                                        className="rounded-xl w-[44px] h-[44px] videPlayBtnsBackground flex justify-center items-center cursor-pointer"
                                    >
                                        <ReloadIcon />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
