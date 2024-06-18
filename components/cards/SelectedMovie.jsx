import React, { useRef, useState } from 'react'
import { Router } from 'i18n'
import { PlayerIcon, LockIcon } from 'components/svg'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import DeviceDetector from 'device-detector-js'
import { parseCookies } from 'nookies'
import MobilePlayer from 'components/PlayerForVideo/MobilePlayer'

const SelectedMovie = ({
    imgSrc,
    text,
    slug,
    seasonNumber,
    episodeNumber,
    purchase,
    setTvotModal,
    checkSubscription,
    subscription,
    tvotModal,
    el,
    seasonsProperty,
    episodeId,
}) => {
    const { access_token } = parseCookies()
    const [errorCase, setErrorCase] = useState(false)

    const deviceDetector = new DeviceDetector()
    const [source, setSource] = useState({})
    const device = deviceDetector.parse(navigator.userAgent)
    const player = useRef(null)
    const subscriptionRef = useRef(null)

    const handleIOSPlay = () => {
        if (source) {
            if (source?.file_name?.length == 0) {
                setErrorCase(true)
            } else if (source?.quality === 'original') {
                setErrorCase(true)
            }
        } else {
            setErrorCase(true)
        }
        if (device.os.name === 'iOS') {
            access_token ? player.current?.play() : Router.push(`/registration`)
        }
    }

    const scrollToSubscription = () => {
        setTimeout(() => {
            window.scrollTo(0, subscriptionRef.current.offsetTop + 1100)
        }, 200)
    }

    return (
        <div
            onClick={() => {
                el?.payment_type === 'free' || checkSubscription.has_access
                    ? device.os.name === ' '
                        ? handleIOSPlay()
                        : el?.is_megogo
                        ? Router.push(
                              `/video-player?id=${
                                  el?.id
                              }&episodeId=${episodeId}&trailer=${false}&ind=0&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}&type=megogo${
                                  el?.last_episode?.season_key ==
                                      seasonNumber &&
                                  el?.last_episode?.episode_key ==
                                      episodeNumber &&
                                  el?.last_episode?.seconds > 0
                                      ? `&lastTime=${el?.last_episode?.seconds}`
                                      : ''
                              }`,
                          )
                        : el?.is_premier
                        ? Router.push(
                              `/video-player?id=${
                                  el?.id
                              }&episodeId=${episodeId}&trailer=${false}&ind=0&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}&type=premier${
                                  el?.last_episode?.season_key ==
                                      seasonNumber &&
                                  el?.last_episode?.episode_key ==
                                      episodeNumber &&
                                  el?.last_episode?.seconds > 0
                                      ? `&lastTime=${el?.last_episode?.seconds}`
                                      : ''
                              }`,
                          )
                        : Router.push(
                              `/video-player?key=${slug}&trailer=${false}&ind=0&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}${
                                  el?.last_episode?.season_key ==
                                      seasonNumber &&
                                  el?.last_episode?.episode_key ==
                                      episodeNumber &&
                                  el?.last_episode?.seconds > 0
                                      ? `&lastTime=${el?.last_episode?.seconds}`
                                      : ''
                              }`,
                          )
                    : setTvotModal(true) || scrollToSubscription()
            }}
            ref={subscriptionRef}
            style={{ cursor: 'pointer !important' }}
        >
            <div
                className={`relative ${
                    seasonsProperty
                        ? seasonsProperty
                        : 'w-[244px] h-[160px] md:h-[194px] md:w-[288px]'
                }`}
            >
                {/* <span
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 3,
                    }}
                >
                    {imgSrc?.length > 0 ? (
                        el?.payment_type === 'free' ||
                        purchase ||
                        checkSubscription.has_access ? (
                            <PlayerIcon />
                        ) : (
                            <LockIcon />
                        )
                    ) : null}
                </span> */}
                <span
                    className="absolute w-full h-full z-[2] hover:opacity-[0.6] duration-300"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                />
                <LazyLoadImage
                    alt={el?.id}
                    effect="blur"
                    delayTime={10000}
                    src={
                        imgSrc?.length > 0
                            ? imgSrc
                            : '../vectors/movie-image-vector.svg'
                    }
                    className={`rounded-lg object-cover ${
                        seasonsProperty
                            ? seasonsProperty
                            : 'w-[244px] h-[160px] md:h-[194px] md:w-[288px]'
                    }`}
                />
            </div>
            <span className="block text-white mt-4 text-[15px] font-semibold leading-[22px]">
                {text}
            </span>
            {device.os.name === 'iOS' && (
                <MobilePlayer
                    setSource={setSource}
                    setErrorCase={setErrorCase}
                    errorCase={errorCase}
                    source={source}
                    player={player}
                    seasonNumber={seasonNumber}
                    episodeNumber={episodeNumber}
                    movie={el}
                />
            )}
        </div>
    )
}

export default SelectedMovie
