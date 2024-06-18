import { PlayerIcon } from 'components/svg'
import { Router } from 'i18n'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import DeviceDetector from 'device-detector-js'
import { parseCookies } from 'nookies'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import MobilePlayer from 'components/PlayerForVideo/MobilePlayer'

const Trailer = ({ elm, imgSrc, ind, text, date, trailerPorperties }) => {
    const { access_token, profile_id } = parseCookies()
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const player = useRef(null)
    const [source, setSource] = useState({})
    const [errorCase, setErrorCase] = useState(false)
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

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
        if (device.os.name === ' ') {
            access_token
                ? player?.current?.play()
                : Router.push(`/registration`)
        }
    }
    return (
        <div
            className={`text-left cursor-pointer group mt-4 ${
                trailerPorperties
                    ? trailerPorperties
                    : 'w-[286px] md:h-[194px] md:w-[288px] h-[160px]'
            }`}
        >
            <div
                onClick={() =>
                    device.os.name === 'iOS'
                        ? handleIOSPlay()
                        : Router.push(
                              `/video-player/trailer?${
                                  !elm.is_megogo
                                      ? `key=${
                                            elm.slug
                                        }&ind=${ind}&profile_id=${
                                            CurrentUserData?.id
                                                ? CurrentUserData?.id
                                                : profile_id
                                        }`
                                      : `id=${elm.id}&ind=${ind}&type=megogo`
                              }`,
                          )
                }
                className="relative"
            >
                {imgSrc?.length > 0 ? (
                    <span
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '3',
                        }}
                    >
                        <PlayerIcon />
                    </span>
                ) : (
                    ''
                )}
                <span
                    className={`duration-300 absolute z-[2] ${
                        trailerPorperties
                            ? trailerPorperties
                            : 'w-full h-[156px] md:h-[194px]'
                    }`}
                />
                <LazyLoadImage
                    alt={text}
                    effect="blur"
                    delayTime={10000}
                    src={
                        imgSrc?.length > 0
                            ? imgSrc
                            : '../vectors/movie-image-vector.svg'
                    }
                    className={`object-cover ${
                        trailerPorperties
                            ? trailerPorperties
                            : 'w-[286px] h-[156px] md:h-[194px] md:w-[288px]'
                    }`}
                    // style={{
                    //     height: '194px !important',
                    // }}
                />
            </div>
            {device.os.name === 'iOS' && (
                <MobilePlayer
                    setSource={setSource}
                    source={source}
                    isTrailer={true}
                    player={player}
                    movie={elm}
                    indNumber={ind}
                    setErrorCase={setErrorCase}
                    errorCase={errorCase}
                />
            )}
        </div>
    )
}

export default Trailer
