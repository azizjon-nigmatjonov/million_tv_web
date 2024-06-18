import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default function Player({ options, onReady }) {
    const videoRef = useRef(null)
    const playerRef = useRef(null)

    useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current
            if (!videoElement) return

            const player = (playerRef.current = videojs(
                videoElement,
                options,
                () => {
                    onReady && onReady(player)
                },
            ))
        } else {
            // you can update player here [update player through props]
            // const player = playerRef.current;
            // player.autoplay(options.autoplay);
            // player.src(options.sources);
        }
    }, [options, videoRef])

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current

        return () => {
            if (player) {
                player.dispose()
                playerRef.current = null
            }
        }
    }, [playerRef])

    return (
        <div data-vjs-player>
            <video
                ref={videoRef}
                className="video-js vjs-big-play-centered"
                controls
            />
        </div>
    )
}
