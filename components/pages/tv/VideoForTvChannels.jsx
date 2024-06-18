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
} from 'video-react'
import HLSSource from 'components/PlayerForVideo/HLSSource'
import { useHover } from 'hooks/useHover'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import DeviceDetector from 'device-detector-js'
import CenterFakePlace from 'components/PlayerForVideo/CenterFakePlace'
import CurrentTime from 'components/PlayerForVideo/CurrentTime'
import TopPartOfBar from 'components/PlayerForVideo/TopPartOfBar'
import ProgramChannel from './ProgramChannel'
import QualityButton from './QualityButton'
import axios from 'utils/axios'
import { parseCookies, setCookie } from 'nookies'

export default function VideoForTvChannels({
    channels_single,
    video,
    quality,
    setQuality,
    changeQuality,
}) {
    const player = useRef(null)
    const deviceDetector = new DeviceDetector()
    const [program_id, setProgram_id] = useState('')
    const d = deviceDetector.parse(navigator.userAgent)
    const [hoverRef, isHovered] = useHover()
    const channel_single = { ...channels_single, is_channel: true }
    const { user_id, profile_id } = parseCookies()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const tvInfo = sessionStorage.getItem('listSelected')
    useEffect(() => {
        if (channel_single) {
            if (user_id && profile_id) {
                if (!tvInfo) {
                    setTimeout(() => {
                        axios
                            .post(`/channels-info?channel_id`, {
                                channel_id: channel_single?.id,
                                flusonic_id: channel_single?.flusonic_id,
                                profile_id: CurrentUserData
                                    ? CurrentUserData?.id
                                    : profile_id,
                                user_id: user_id,
                            })
                            .then(() => {
                                sessionStorage.setItem('tvInfo', 'active')
                            })
                    }, 1000)
                }
            }
        }
    }, [channel_single, user_id, profile_id, CurrentUserData])

    return (
        <div
            id="full-tv__player"
            className="video_player tv_video_player tv-video"
        >
            <Player className="mainVideoPlayerControlbar" autoPlay>
                <ControlBar
                    autoHideTime={2000}
                    autoHide={isHovered ? false : true}
                    className={
                        d.os.name === 'iOS' || d.client.name === 'Safari'
                            ? 'IsIOSDevice ControlBarVideoPlayer'
                            : 'ControlBarVideoPlayer'
                    }
                    ref={player}
                >
                    <ProgramChannel
                        refProgram={hoverRef}
                        data={channels_single}
                        setProgram_id={setProgram_id}
                        program_id={program_id}
                        order={7}
                    />
                    <QualityButton
                        qualityActive={quality}
                        setQuality={setQuality}
                        changeQuality={changeQuality}
                        order={7}
                        qualities={
                            channels_single?.channel_stream_all
                                ? channels_single?.channel_stream_all
                                : []
                        }
                    />
                    <TopPartOfBar channels_single={channel_single} />
                    <PlayToggle order={2} />
                    <ReplayControl seconds={10} order={1} />
                    <ForwardControl seconds={10} order={3} />
                    <CurrentTimeDisplay disabled />
                    <TimeDivider disabled />
                    <PlaybackRateMenuButton disabled />
                    <VolumeMenuButton order={4} />
                    <CenterFakePlace order={5} />
                    <CurrentTime leftTime="00:00:00" order={6} isTv />
                </ControlBar>
                <HLSSource
                    isVideoChildt
                    src={video?.file_name ? video?.file_name : video}
                    key={video?.file_name ? video?.file_name : video || 0}
                />
                <BigPlayButton disabled />
            </Player>
        </div>
    )
}
