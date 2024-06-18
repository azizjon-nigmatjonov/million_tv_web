import { useState, useEffect } from 'react'
import router from 'next/router'
import SEO from 'components/SEO'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import { parseCookies } from 'nookies'
import axios, { authRequestForTvChannel } from 'utils/axios'
import VideoForTvChannels from 'components/pages/tv/VideoForTvChannels'
import DeviceDetector from 'device-detector-js'

export default function Movies() {
    const { access_token } = parseCookies()
    const [channels_single, setChannels_single] = useState(null)
    const [video, setVideo] = useState('videos')
    const [quality, setQuality] = useState(null)
    const [autoUrl, setAutoUrl] = useState('')

    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    useEffect(() => {
        if (access_token) {
            axios
                .get(`/tv/channel/${router?.query?.key}`, {
                    Authorization: access_token,
                })
                .then((response) => {
                    setAutoUrl(response?.data?.channel_stream_all)
                    let url = ''
                    if (device?.os?.name == 'iOS') {
                        url = response?.data?.channel_stream_ios
                    } else {
                        url = response?.data?.channel_stream_all
                    }
                    if (url) {
                        authRequestForTvChannel({
                            method: 'get',
                            url,
                        }).then((res) => {
                            // Don't write this kind of stupid code in your other project. Chapter )
                            const [baseUrl] = url.split('video')
                            const ipAddress = url.split('remote=')
                            let [_dummy, ...urls] =
                                res.data.split('RESOLUTION=')
                            urls = urls.map((el) => {
                                const [quality, restUrl] =
                                    el.split(',FRAME-RATE')
                                const orginalUrl = restUrl.split('\n')[1]
                                return {
                                    quality: quality,
                                    file_name:
                                        baseUrl +
                                        orginalUrl +
                                        '&remote=' +
                                        ipAddress[1],
                                }
                            })
                            setChannels_single(response?.data)
                            setChannels_single((el) => ({
                                ...el,
                                channel_stream_all: urls,
                            }))
                            // setVideo(urls[0])
                            // setQuality(urls[0].quality)
                        })
                    }
                })
                .catch((error) => console.log(error))
        } else {
            // router.push('/registration')
        }
    }, [access_token])

    const changeQuality = (quality) => {
        if (quality === 'auto') {
            setVideo(autoUrl)
        } else {
            setVideo(
                channels_single?.channel_stream_all?.find(
                    (item) => item.quality === quality,
                ),
            )
        }
    }

    useEffect(() => {
        if (autoUrl) {
            setVideo(autoUrl)
        }
    }, [autoUrl])

    return (
        <>
            <SEO />
            <VideoForTvChannels
                channels_single={channels_single ? channels_single : []}
                video={video ? video : []}
                quality={quality ? quality : ''}
                setQuality={setQuality}
                changeQuality={changeQuality}
            />
        </>
    )
}

// export async function getServerSideProps(ctx) {
//     const { query } = ctx
//     const cookies = parseCookies(ctx)

//     if (cookies.access_token) {
//         const urls = [
//             { endpoint: `tv/channel/${query?.key}` },
//         ]

//         const [channel] = await fetchMultipleUrls(urls, ctx)

//         return {
//             props: {
//                 channel: channel || [],
//             },
//         }
//     }
// }
