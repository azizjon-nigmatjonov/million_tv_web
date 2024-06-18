import { ArrowBackIcon } from 'components/svg'
import { useIsMobile } from 'hooks/useIsMobile'
import { parseCookies } from 'nookies'
import React, { useCallback, useEffect, useState } from 'react'
import axios from '../../utils/axios'
import router from 'next/router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'i18n'

export default function TopPartOfBar({
    player,
    isTrailer,
    data,
    hideLogoTitle,
    channels_single,
    episodeId,
    duration,
}) {
    const { user_id, profile_id } = parseCookies()
    const { t, i18n } = useTranslation()
    const [isMobile] = useIsMobile()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    useEffect(() => {
        const sendLastTime = async () => {
            if (
                !isTrailer &&
                data &&
                player?.current?.getState()?.player?.currentTime > 0
            ) {
                await axios.post('movie-track', {
                    duration: parseInt(duration),
                    element: data?.file_info?.is_serial
                        ? 'episode'
                        : data.is_serial
                        ? 'episode'
                        : 'movie',
                    episode_id: router?.query?.episodeId
                        ? router?.query?.episodeId
                        : episodeId
                        ? episodeId
                        : '',
                    episode_key: router?.query?.episodeNumber
                        ? router?.query?.episodeNumber
                        : '',
                    is_megogo: data?.file_info?.is_megogo ? true : false,
                    is_premier: data?.file_info?.is_premier ? true : false,
                    movie_key: data?.file_info?.is_megogo
                        ? router?.query?.id
                        : data?.file_info?.is_premier
                        ? router?.query?.id
                        : data?.slug,
                    profile_id: router.query.profile_id
                        ? router.query.profile_id
                        : CurrentUserData?.id
                        ? CurrentUserData?.id
                        : profile_id,
                    season_key: router?.query?.seasonNumber
                        ? router?.query?.seasonNumber
                        : '',
                    seconds: Math.round(
                        player?.current?.getState()?.player?.currentTime,
                    ),
                    user_id: user_id,
                })
            }
        }

        const intervalId = setInterval(() => {
            sendLastTime()
        }, 10000)

        return () => {
            clearInterval(intervalId)
        }
    }, [duration])

    useEffect(async () => {
        if (!isTrailer && data) {
            await axios.post('recently-watched', {
                episode_key: router.query.episodeNumber || '',
                movie_key: router?.query?.id
                    ? router?.query?.id
                    : router?.query?.key,
                season_key: router.query.seasonNumber || '',
                user_id: user_id,
            })
        }
    }, [])

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            channels_single?.is_channel
                ? router.replace(`/tv`)
                : router.replace(`/movie/${router.query.key}`)
        }
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', escFunction, false)

        return () => {
            document.removeEventListener('keydown', escFunction, false)
        }
    }, [])

    return (
        <div className="TopPartOfBar w-full">
            <button
                onClick={() => {
                    if (data?.is_serial || data?.file_info?.is_serial) {
                        if (router.query.recentlyMovie) {
                            router.push('/')
                            return
                        }
                        channels_single?.is_channel
                            ? router.replace(`/tv`)
                            : data?.file_info?.is_megogo || data?.is_megogo
                            ? router.replace(
                                  `/movie/${router.query.id}?type=megogo`,
                              )
                            : data?.file_info?.is_premier
                            ? router.replace(
                                  `/movie/${router.query.id}?type=premier`,
                              )
                            : router.replace(`/movie/${router.query.key}`)
                    } else {
                        history.back()
                    }
                }}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className="rounded-[50%] w-[45px] h-[45px] ml-[24px]"
            >
                <span className="w-[45px] h-[45px] inline-flex items-center justify-center">
                    <ArrowBackIcon fill="white" />
                </span>
            </button>

            {hideLogoTitle && (
                <span className="w-full text-right mobile:text-center mt-2 pr-3 mobile:pr-0">
                    <p className="text-[22px] font-[600] block tracking-wider">
                        {data?.title}
                        {data?.file_info?.is_megogo
                            ? data?.file_info?.title
                            : ''}
                        {data?.age_restriction === '' ? (
                            <span></span>
                        ) : (
                            <span>
                                {' '}
                                {data?.age_restriction
                                    ? data?.age_restriction + '+'
                                    : ''}
                            </span>
                        )}
                    </p>
                    {!data?.file_info?.is_megogo && (
                        <p className="text-base tracking-wider font-normal mt-2">
                            {router?.query?.seasonNumber && (
                                <span>
                                    {' '}
                                    {t('season')} {router?.query?.seasonNumber}
                                </span>
                            )}
                            {router?.query?.episodeNumber && (
                                <span>
                                    {' '}
                                    {t('episode')}{' '}
                                    {router?.query?.episodeNumber}
                                </span>
                            )}
                        </p>
                    )}
                </span>
            )}
            {/* {!hideLogoTitle && (
                <div className="top_title">
                    <div>
                        {data?.movie_logo_title?.length > 0 ? (
                            <img
                                className="movie_logo_title"
                                src={data?.movie_logo_title}
                                alt="logo player"
                            />
                        ) : (
                            <p>{data?.title}</p>
                        )}
                    </div>
                </div>
            )} */}

            {/* {data?.age_restriction?.length > 0 && (
                <div className="age_restriction">
                    <p>
                        {data?.age_restriction?.charAt(
                            data?.age_restriction?.length - 1,
                        ) === `+`
                            ? data?.age_restriction
                            : data?.age_restriction + '+'}
                    </p>
                </div>
            )} */}
        </div>
    )
}
