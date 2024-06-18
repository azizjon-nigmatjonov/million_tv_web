import React, { useEffect, useState } from 'react'
import { Player, BigPlayButton } from 'video-react'
import HLSSource from './HLSSource'
import ErrorPopup from 'components/errorPopup/ErrorPopup'
import { useRouter } from 'next/router'
import { fetchQuery } from 'utils/fetchQuery'
import { parseCookies } from 'nookies'

export default function MobilePlayer({
    indNumber = 0,
    isTrailer = false,
    seasonNumber = 1,
    episodeNumber = 1,
    player,
    movie,
    setSource,
    source,
    setErrorCase,
    errorCase,
}) {
    const [openModal, setOpenModal] = useState(true)
    const [data, setData] = useState(movie || null)

    const router = useRouter()
    const cookies = parseCookies()

    async function getMovie() {
        const movies = await fetchQuery(`movies/${router.query.movie}`, null, {
            Authorization: `${cookies.access_token}`,
        })
        setData(movies)
    }

    useEffect(() => {
        if (!movie) getMovie()
    }, [])

    useEffect(() => {
        if (isTrailer === false && !data?.is_serial) {
            setSource(
                data?.file_info
                    ? setDefaultQuality(
                          data?.file_info.videos ? data?.file_info.videos : [],
                      )
                    : data
                    ? setDefaultQuality(data?.videos ? data?.videos : [])
                    : null,
            )
        }
        if (isTrailer === true && !data?.is_serial) {
            setSource(
                data
                    ? setDefaultQuality(
                          data.trailer[indNumber].videos
                              ? data?.trailer[indNumber].videos
                              : data?.trailer,
                      )
                    : data?.trailer
                    ? setDefaultQuality(
                          data.trailer[indNumber].videos
                              ? data?.trailer[indNumber].videos
                              : data?.trailer,
                      )
                    : '',
            )
        }
    }, [data])

    useEffect(() => {
        if (data?.is_serial) {
            setSource(
                data
                    ? setDefaultQuality(
                          data?.seasons[seasonNumber - 1]?.episodes[
                              episodeNumber - 1
                          ]?.file_info.videos,
                      )
                    : '',
            )
        }
    }, [data, seasonNumber])
    useEffect(() => {
        if (movie.is_channel) {
            setSource(movie?.url?.length > 0 ? movie?.url : '')
        }
    }, [movie])

    const setDefaultQuality = (videos) => {
        const low = videos?.find((el) =>
            el?.quality
                ? el?.quality === '360p'
                : el?.bitrate
                ? el?.bitrate === 360
                : '',
        )
        const medium = videos?.find((el) =>
            el?.quality
                ? el?.quality === '480p'
                : el?.bitrate
                ? el?.bitrate === 480
                : '',
        )
        const better = videos?.find((el) =>
            el?.quality
                ? el?.quality === '720p'
                : el?.bitrate
                ? el?.bitrate === 720
                : '',
        )
        const high = videos?.find((el) =>
            el?.quality
                ? el?.quality === '1080p'
                : el?.bitrate
                ? el?.bitrate === 1080
                : '',
        )
        const ultra = videos?.find((el) => el?.quality === '4k')
        const errorQuality = videos?.find((el) => el?.quality === 'original')

        return high || better || medium || low || ultra || errorQuality
    }

    return data ? (
        <div className="video_player mobile_player">
            {!errorCase && (
                <Player ref={player}>
                    <HLSSource
                        isVideoChild
                        src={
                            source?.file_name?.length > 0
                                ? source?.file_name
                                : movie?.is_channel
                                ? source
                                : ''
                        }
                        key={source?.file_name || 1}
                    />
                    <BigPlayButton disabled />
                </Player>
            )}
            {errorCase && (
                <ErrorPopup
                    setErrorCase={setErrorCase}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
            )}
        </div>
    ) : (
        ''
    )
}
