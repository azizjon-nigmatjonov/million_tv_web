export const setPlayerSpeed = (num, playerRef) => {
    if (playerRef.current) {
        switch (num) {
            case 0.5:
                playerRef.current.playbackRate = 0.5
                break
            case 0.75:
                playerRef.current.playbackRate = 0.75
                break
            case 1:
                playerRef.current.playbackRate = 1
                break
            case 1.25:
                playerRef.current.playbackRate = 1.25
                break
            case 1.5:
                playerRef.current.playbackRate = 1.5
                break
            case 2:
                playerRef.current.playbackRate = 2
                break
            default:
                playerRef.current.playbackRate = 1
        }
    }
}
