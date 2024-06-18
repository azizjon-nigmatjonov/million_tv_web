import { useEffect, useMemo, useRef, useState } from 'react'
import cls from './style.module.scss'
import { Player, Shortcut, ControlBar, BigPlayButton } from 'video-react'
import HLSSource from 'components/PlayerForVideo/HLSSource'
import BannerElementContents from './Contents'
export default function BannerCard({
    element,
    btnData = {},
    handlePlayMovie = () => {},
    player,
    trailer = {},
}) {
    const currentTime = useRef(null)
    const [isPlay, setIsPlay] = useState(false)
    const [isEnded, setIsEnded] = useState(false)
    const [volume, setVolume] = useState(false)

    const changeMuteState = () => {
        if (player.current) {
            player.current.muted = !player.current.muted
            setVolume(!volume)
        }
    }
    const handleLoad = () => {
        if (player.current) {
            player.current.seek(0)
            player.current.actions.play()
        }
    }

    function handleStateChange(state) {
        setIsPlay(!state.paused)
        setIsEnded(state.ended)
        currentTime.current = state.currentTime
    }

    useEffect(() => {
        player?.current?.subscribeToStateChange(handleStateChange)
    }, [])

    function handleClickCard(event) {
        event.preventDefault()
        handlePlayMovie()
    }

    return (
        <div className={cls.wrapper} onClick={handleClickCard}>
            <Player
                className="player_main_page"
                aspectratio="true"
                muted
                autoPlay
                playsInline
                ref={player}
                fluid={true}
                poster={
                    element?.file_info?.image
                        ? element?.file_info?.image
                        : element?.logo_image
                }
                preload="auto"
            >
                <Shortcut clickable={false} />
                <ControlBar className="control_bar" />
                {/* {Array.isArray(trailer) ? (
                    <source
                        src={
                            Array.isArray(trailer)
                                ? trailer[0].videos[0]?.file_name
                                : ''
                        }
                        key={
                            Array.isArray(trailer)
                                ? trailer[0].videos[0]?.file_name
                                : 1
                        }
                        // isVideoChild
                    />
                ) : ( */}
                <HLSSource
                    isVideoChild
                    src={trailer?.file_name ? trailer?.file_name : ''}
                    key={trailer?.file_name || 1}
                />
                {/* )} */}
                <BigPlayButton disabled />
            </Player>

            <div className="image_banner_bg">
                <img src={element && element?.file_info?.image} alt="image" />
            </div>

            {/* <BannerElementTitle /> */}
            <BannerElementContents
                volume={volume}
                isEnded={isEnded}
                isPlay={isPlay}
                element={element}
                btnData={btnData}
                currentTime={currentTime}
                changeMuteState={changeMuteState}
                handleLoad={handleLoad}
            />
        </div>
    )
}
