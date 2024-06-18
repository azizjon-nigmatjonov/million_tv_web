import React, { useState, useEffect } from 'react'
import { Player, BigPlayButton } from 'video-react'
import HLSSource from './HLSSource'
import ErrorPopup from 'components/errorPopup/ErrorPopup'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'

export default function MobilePlayerIntegration({
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
    const [integrationData, setIntegrationData] = useState({})

    const router = useRouter()
    const cookies = parseCookies()
    const [megogoTrailerSource, setMegogoTrailerSource] = useState(null)

    useEffect(() => {
        if (integrationData?.videos) {
            setIntegrationData({ ...movie, is_megogo: true })
        }
    }, [])
    useEffect(() => {
        if (integrationData?.is_megogo) {
            const video = integrationData?.videos?.slice(-1)[0]?.src
            if (video) {
                setMegogoTrailerSource(video)
            }
        }
    }, [integrationData])

    return megogoTrailerSource ? (
        <div className="video_player mobile_player">
            {!errorCase && (
                <Player ref={player}>
                    <HLSSource
                        isVideoChild
                        src={megogoTrailerSource ? megogoTrailerSource : ''}
                        key={megogoTrailerSource || 1}
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
