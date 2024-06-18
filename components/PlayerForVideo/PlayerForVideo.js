import React, { useRef, useEffect, useState, useMemo } from 'react'
import {
    Player,
    ControlBar,
    ReplayControl,
    ForwardControl,
    CurrentTimeDisplay,
    TimeDivider,
    PlaybackRateMenuButton,
    VolumeMenuButton,
    BigPlayButton,
    PlayToggle,
    LoadingSpinner,
} from 'video-react'
import HLSSource from './HLSSource'
import CircularProgress from '@mui/material/CircularProgress'
import QualityButton from './QualityButton'
import CenterFakePlace from './CenterFakePlace'
import CurrentTime from './CurrentTime'
import TopPartOfBar from './TopPartOfBar'
import DeviceDetector from 'device-detector-js'
import PassedTime from './PassedTime'
import ErrorPopup from 'components/errorPopup/ErrorPopup'
import AllEpisodes from './AllEpisodes'
import { useHover } from 'hooks/useHover'
import router from 'next/router'
import { Router } from 'i18n'
import MainButton from 'components/button/MainButton'
import { DarkPlayIcon, MillionTvIcon } from 'components/svg'
import { useTranslation } from 'i18n'
import axios from 'utils/axios'
import { parseCookies } from 'nookies'

export default function PlayerForVideo({
    data,
    indNumber,
    isTrailer,
    currentTime,
    seasonNumber,
    episodeNumber,
    track,
    integrationSeasons,
}) {
    const [lastTime, setlastTime] = useState(0)

    const [loading, setLoading] = useState(false)
    const [source, setSource] = useState('movies')
    const [leftTime, setLeftTime] = useState('00:00:00')
    const [currentSeekTime, setCurrentSeekTime] = useState(0)
    const [qualityOpen, setQualityOpen] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [paused, setPaused] = useState(true)
    const [errorCase, setErrorCase] = useState(false)
    const [openModal, setOpenModal] = useState(true)
    const [hideLogoTitle, setHideLogoTitle] = useState(false)
    const [episodeOpen, setEpisodeOpen] = useState(false)
    const [nextEpisode, setNextEpisode] = useState(false)
    const [skip, setSkip] = useState(true)
    const player = useRef(null)
    const [hoverRef, isHovered] = useHover()
    const [serialEnded, setSerialEnded] = useState(false)
    const { t } = useTranslation()
    const { user_id } = parseCookies()
    const deviceDetector = new DeviceDetector()
    const d = deviceDetector.parse(navigator.userAgent)
    const [episodeId, setEpisodeId] = useState('')
    const [movieDuration, setMovieDuration] = useState(0)
    const [passedTime, setPassedTime] = useState(0)

    const movieGenres = useMemo(() => {
        if (!data) return
        if (data.file_info?.is_megogo || data.file_info?.is_premier) {
            return router.query?.genre ?? ''
        } else {
            return (
                data?.genres
                    ?.map((item) => {
                        return item.title
                    })
                    ?.join(',') ?? ''
            )
        }
    }, [data])

    useEffect(() => {
        if (d.device.type === 'smartphone') {
            player?.current?.actions.toggleFullscreen()
        }
    }, [router.query])

    useEffect(() => {
        if (data && isTrailer === false && !data?.is_serial) {
            const auto = data?.file_info?.videos?.find(
                (item) => item.quality === 'auto',
            )

            // if (auto) {
            //     setSource(auto)
            // } else {
            //     setSource(
            //         data?.file_info
            //             ? setDefaultQuality(data?.file_info?.videos)
            //             : '',
            //     )
            // }
            setSource(
                data?.file_info
                    ? setDefaultQuality(data?.file_info?.videos)
                    : '',
            )
        }

        if (isTrailer === true) {
            const auto = data?.trailer[indNumber].videos?.find(
                (item) => item?.quality === 'auto',
            )
            // if (source === 'movies' ? '' : auto) {
            //     setSource(auto)
            // } else {
            //     setSource(
            //         data?.trailer
            //             ? setDefaultQuality(
            //                   data?.trailer[indNumber]?.videos
            //                       ? data?.trailer[indNumber]?.videos
            //                       : data?.trailer?.videos,
            //               )
            //             : '',
            //     )
            // }
            setSource(
                data?.trailer
                    ? setDefaultQuality(
                          data?.trailer[1]?.videos
                              ? data?.trailer[1]?.videos
                              : data?.trailer?.videos,
                      )
                    : '',
            )
        }

        if (data?.is_serial && !isTrailer) {
            const auto = data?.seasons[seasonNumber - 2]?.episodes[
                episodeNumber - 2
            ]?.file_info?.videos?.find((item) => item?.quality === 'auto')
            // if (auto) {
            //     setSource(auto)
            // } else {
            //     setSource(
            //         setDefaultQuality(
            //             data.seasons[seasonNumber - 1]?.episodes[
            //                 episodeNumber - 1
            //             ]?.file_info?.videos,
            //         ),
            //     )
            // }
            setSource(
                setDefaultQuality(
                    data.seasons[seasonNumber - 1]?.episodes[episodeNumber - 1]
                        ?.file_info?.videos,
                ),
            )
            return
        }
    }, [data, seasonNumber, episodeNumber, indNumber, isTrailer])

    useEffect(() => {
        player?.current?.handleFocus()
    }, [player])

    const setDefaultQuality = (videos) => {
        // const auto = videos?.find((el) => el?.quality === 'auto')
        const low = videos?.find((el) => el?.quality === '360p')
        const medium = videos?.find((el) => el?.quality === '480p')
        const better = videos?.find((el) => el?.quality === '720p')
        const high = videos?.find((el) => el?.quality === '1080p')
        const extra = videos?.find((el) => el?.quality === '2160p')
        const ultra = videos?.find((el) => el?.quality === '4k')
        const errorQuality = videos?.find((el) => el?.quality === 'original')

        return (
            // auto ||
            high || better || medium || low || extra || ultra || errorQuality
        )
    }

    const [newTrack, setNewTrack] = useState(track)

    useEffect(() => {
        setTimeout(() => {
            setHideLogoTitle(true)
        }, 5000)
    }, [])

    const skipEntity = () => {
        if (player.current) {
            player.current.actions.seek(data.skip_entity)
            setSkip(false)
        }
    }

    useEffect(() => {
        player?.current?.subscribeToStateChange(handleStateChange)
    }, [])

    function handleStateChange(state) {
        if (d.device.type === 'smartphone') {
            window.screen.orientation.lock('landscape').then(
                (success) => console.log(success),
                (failure) => console.log(failure),
            )
        }
        setPassedTime(
            new Date(state.currentTime * 1000 || 0)
                ?.toISOString()
                .substr(11, 8),
        )
        if (!state.hasStarted) {
            setLoading(true)
        } else {
            setLoading(false)
        }

        setMovieDuration(state.duration)

        const leftSeconds = state.duration - state.currentTime
        if (state.currentTime > data.skip_entity) {
            setSkip(false)
        }

        if (leftSeconds < 180) {
            setSerialEnded(true)
        } else {
            setSerialEnded(false)
        }

        setLeftTime(
            new Date(leftSeconds * 1000 || 0)?.toISOString().substr(11, 8),
        )
        setCurrentSeekTime(state.currentTime)
        setFullScreen(state.isFullscreen)
    }

    const NextEpisodeIs =
        data.is_serial &&
        data.seasons[seasonNumber - 1]?.episodes.length != episodeNumber

    const isLastSeason =
        data.is_serial && data.seasons.length === parseInt(seasonNumber)

    const dataForQuality =
        source === 'movies' || !source
            ? ''
            : isTrailer === false && !data.is_serial
            ? data?.file_info
            : isTrailer === true && !data.is_serial
            ? data?.trailer[indNumber]?.videos
            : data.is_serial
            ? data.seasons[seasonNumber - 1]?.episodes[episodeNumber - 1]
                  ?.file_info
            : ''

    const timeForPlay = newTrack ? newTrack : currentTime

    useEffect(() => {
        if (!movieGenres && !data?.file_info?.videos?.length) return
        const postAnalyticsFn = setInterval(() => {
            if (data?.title || data?.file_info?.title) {
                axios.post(`/analytics`, {
                    title:
                        data?.file_info?.is_megogo ||
                        data?.file_info?.is_premier
                            ? data?.file_info?.title
                            : data?.title,
                    episode_key: router.query.episodeNumber || '0',
                    genre: movieGenres,
                    movie_key: router?.query?.key
                        ? router.query.key
                        : router?.query?.id,
                    season_key: router.query.seasonNumber || '0',
                    user_id: user_id,
                    video_platform: 'UZD+',
                })
            }
        }, 10000)
        return () => {
            clearInterval(postAnalyticsFn)
        }
    }, [data, movieGenres, user_id])

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.keyCode === 32) {
                e.preventDefault()
                const video = player?.current.getState().player
                if (!video.muted || (video.muted && video.paused)) {
                    if (video.paused) {
                        player.current.play()
                    } else {
                        player.current.pause()
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [])

    return (
        <div id="full-player" className="video_player">
            <div
                className={`absolute right-5 top-5 z-[999] hidden mobile:block`}
            >
                <MillionTvIcon />
            </div>
            {source && !errorCase && (
                <Player
                    className="mainVideoPlayerControlbar"
                    startTime={timeForPlay}
                    autoPlay
                    preload="none"
                    ref={player}
                    crossOrigin="anonymous"
                >
                    <LoadingSpinner />
                    {source?.file_name?.includes('banner-news') ? (
                        <source
                            src={
                                source?.file_name
                                    ? source.file_name
                                    : source?.video
                            }
                        />
                    ) : (
                        <HLSSource
                            isVideoChild
                            src={
                                source?.file_name
                                    ? source?.file_name
                                    : source?.video
                                    ? source?.video
                                    : source
                            }
                            key={
                                source?.file_name
                                    ? source?.file_name
                                    : source?.video || 1
                            }
                        />
                    )}

                    {skip &&
                        data.skip_entity > 0 &&
                        (!isTrailer ? (
                            <button
                                onClick={() => skipEntity()}
                                className={`${
                                    serialEnded && !isLastSeason && !isTrailer
                                        ? 'bottom-[220px]'
                                        : 'bottom-[120px]'
                                } skip_button`}
                            >
                                Пропустить заставку
                            </button>
                        ) : null)}

                    {serialEnded &&
                        data.is_serial &&
                        !nextEpisode &&
                        !isTrailer && (
                            <MainButton
                                onClick={() => {
                                    Router.push(
                                        !NextEpisodeIs
                                            ? `/video-player?key=${
                                                  data.slug
                                              }&ind=0&seasonNumber=${
                                                  parseInt(seasonNumber) + 1
                                              }&episodeNumber=${1}`
                                            : `/video-player?key=${
                                                  data.slug
                                              }&ind=0&seasonNumber=${seasonNumber}&episodeNumber=${
                                                  parseInt(episodeNumber) + 1
                                              }`,
                                    )
                                }}
                                text={t('The next episode')} ////////////////////////
                                additionalClasses={`next_episode_button rounded-[8px]`}
                                icon={<DarkPlayIcon />}
                            />
                        )}
                    {loading && (
                        <div
                            style={{
                                color: '#BDBDBD',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <CircularProgress size={48} color="inherit" />
                        </div>
                    )}
                    <BigPlayButton disabled />
                    <ControlBar
                        autoHideTime={2000}
                        autoHide={
                            isTrailer
                                ? true
                                : serialEnded ||
                                  nextEpisode ||
                                  episodeOpen ||
                                  qualityOpen
                                ? false
                                : true
                        }
                        className={
                            d.os.name === 'iOS' || d.client.name === 'Safari'
                                ? 'IsIOSDevice ControlBarVideoPlayer'
                                : 'ControlBarVideoPlayer'
                        }
                        disableDefaultControls={false}
                    >
                        <TopPartOfBar
                            integrationSeasons={integrationSeasons}
                            fullScreen={fullScreen}
                            hideLogoTitle={hideLogoTitle}
                            player={player}
                            isTrailer={isTrailer}
                            currentTime={currentTime}
                            data={data}
                            episodeId={episodeId}
                            duration={movieDuration ? movieDuration : 0}
                        />
                        <PassedTime passedTime={passedTime} order={1} />
                        <PlayToggle order={2} />
                        <ReplayControl seconds={10} order={1} />
                        <ForwardControl seconds={10} order={3} />
                        <CurrentTimeDisplay disabled />
                        <TimeDivider disabled />
                        <PlaybackRateMenuButton disabled />
                        <VolumeMenuButton order={4} />
                        <CenterFakePlace order={5} />
                        <CurrentTime leftTime={leftTime} order={6} />

                        {data?.is_serial && (
                            <AllEpisodes
                                nextEpisode={nextEpisode}
                                episodeOpen={episodeOpen}
                                setEpisodeOpen={setEpisodeOpen}
                                setNextEpisode={setNextEpisode}
                                setQualityOpen={setQualityOpen}
                                qualityOpen={qualityOpen}
                                refHover={hoverRef}
                                data={
                                    data?.seasons[seasonNumber - 1]?.episodes[
                                        episodeNumber - 1
                                    ]
                                }
                                allData={data}
                                seasonData={data?.seasons}
                                episodeNumber={episodeNumber}
                                seasonNumber={seasonNumber}
                                slug={data.slug}
                                order={7}
                            />
                        )}
                        {integrationSeasons && integrationSeasons?.seasons && (
                            <AllEpisodes
                                nextEpisode={nextEpisode}
                                episodeOpen={episodeOpen}
                                setEpisodeOpen={setEpisodeOpen}
                                setNextEpisode={setNextEpisode}
                                setQualityOpen={setQualityOpen}
                                qualityOpen={qualityOpen}
                                refHover={hoverRef}
                                data={
                                    integrationSeasons?.seasons[
                                        seasonNumber - 1
                                    ]?.episodes[episodeNumber - 1]
                                }
                                allData={data}
                                seasonData={integrationSeasons?.seasons}
                                episodeNumber={episodeNumber}
                                seasonNumber={seasonNumber}
                                slug={integrationSeasons.id}
                                order={7}
                                integrationSeasons={
                                    integrationSeasons ? integrationSeasons : {}
                                }
                            />
                        )}
                        <QualityButton
                            setNewTrack={setNewTrack}
                            refQuality={hoverRef}
                            paused={paused}
                            setlastTime={setlastTime}
                            lastTime={lastTime}
                            player={player}
                            source={source}
                            setSource={setSource}
                            isTrailer={isTrailer}
                            data={dataForQuality}
                            nextEpisode={nextEpisode}
                            episodeOpen={episodeOpen}
                            setEpisodeOpen={setEpisodeOpen}
                            setNextEpisode={setNextEpisode}
                            setQualityOpen={setQualityOpen}
                            qualityOpen={qualityOpen}
                            dataQu
                            order={8}
                        />
                    </ControlBar>
                </Player>
            )}
            {errorCase && (
                <ErrorPopup
                    data={data}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
            )}
        </div>
    )
}
