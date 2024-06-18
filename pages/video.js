import React, { useEffect, useRef } from 'react'
import Player from 'components/player'

export default function Video() {
    const playerRef = useRef(null)

    const videoJsOptions = {
        // lookup the options in the docs for more options
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: 'https://sharqtv-cdn.s3.eu-north-1.amazonaws.com/720p/40ce7ca62f3ec12fb02f51cb65dc6335/video.m3u8',
                type: 'application/x-mpegURL',
            },
        ],
        playsinline: true,
    }

    useEffect(() => {
        setTimeout(() => playerRef.current?.play(), 2000)
    }, [])

    const handlePlayerReady = (player) => {
        playerRef.current = player

        // you can handle player events here
        player.on('waiting', () => {
            console.log('player is waiting')
        })

        player.on('dispose', () => {
            console.log('player will dispose')
        })
    }

    // const changePlayerOptions = () => {
    //   // you can update the player through the Video.js player instance
    //   if (!playerRef.current) {
    //     return;
    //   }
    //   // [update player through instance's api]
    //   playerRef.current.src([{src: 'http://ex.com/video.mp4', type: 'video/mp4'}]);
    //   playerRef.current.autoplay(false);
    // };

    return (
        <>
            <div>Rest of app here</div>

            <Player options={videoJsOptions} onReady={handlePlayerReady} />

            <div>Rest of app here</div>
        </>
    )
}
