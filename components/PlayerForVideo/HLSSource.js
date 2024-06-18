import React, { Component } from 'react'
import Hls from 'hls.js'

export default class HLSSource extends Component {
    constructor(props, context) {
        super(props, context)
        this.hls = new Hls({
            fragLoadingMaxRetry: 50,
            levelLoadingMaxRetry: 50,
            manifestLoadingMaxRetry: 10,
        })
    }
    componentDidMount() {
        // `src` is the property get from this component
        // `video` is the property insert from `Video` component
        // `video` is the html5 video element
        const { src, video, redirected } = this.props
        // load hls video source base on hls.js
        if (Hls.isSupported()) {
            this.hls.loadSource(src ? src : '')
            this.hls.attachMedia(video)
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (redirected) {
                    video.play()
                }
            })
        }
    }

    componentWillUnmount() {
        // destroy hls video source
        if (this.hls) {
            this.hls.destroy()
        }
    }

    render() {
        const { src, type } = this.props
        return <source src={src} type="application/x-mpegURL" />
    }
}
