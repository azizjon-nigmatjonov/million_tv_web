import BannerCard from '../Card'
import { useEffect, useMemo, useState } from 'react'
import { parseCookies } from 'nookies'
import axios from 'utils/axios'
import { useTranslation } from 'i18n'
import { useRouter } from 'next/router'
import OptimizeQuery2 from 'utils/optimizeQuery2'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useRef } from 'react'
import { BannerArrowRight, BannerArrowLeft } from 'components/svg'

export default function DesktopBannerSlider({ list = [] }) {
    const player = useRef(null)
    const { access_token, profile_id } = parseCookies()
    const [currentElement, setCurrentElement] = useState({})
    const [btnData, setBtnData] = useState({})
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const sliderRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const newList = useMemo(() => {
        return list?.map((item, index) => ({
            ...item,
            index,
        }))
    }, [list])

    function checkAccess(item) {
        axios
            .post(`/check-purchase-access`, {
                movie_slug: item?.slug,
            })
            .then((res) => {
                //setBoughtData(res?.data)
                if (res?.data?.has_access) {
                    handleBtnActions({ text: t('watch') })
                } else {
                    let text =
                        i18n.language === 'ru' || i18n.language === 'en'
                            ? `${t('buy')} ${
                                  i18n.language === 'en' ? 'for' : 'за'
                              } ${item?.pricing?.substracted_price / 100} ${t(
                                  'sum',
                              )}`
                            : `${
                                  item?.pricing?.substracted_price / 100
                              } so'mga sotib oling`
                    handleBtnActions({
                        text,
                        background: 'bg-lightyellow',
                    })
                }
            })
    }

    function checkSubscriptionAccess(item) {
        axios
            .post(
                `check-subscription-access`,
                {
                    key: item.category?.slug,
                },
                { Authorization: access_token },
            )
            .then((response) => {
                setCheckSubscription(response.data)
                if (response.data?.has_access) {
                    handleBtnActions({ text: t('Смотреть') })
                } else {
                    response?.data?.is_watched_free_trial
                        ? handleBtnActions({
                              text: t('buy_subscription'),
                          })
                        : handleBtnActions({ text: t('start_free') })
                }
            })
    }

    function handleCheckPurchase(item) {
        if (!item?.payment_type) return
        switch (item?.payment_type) {
            case 'svod':
                checkSubscriptionAccess()
                break
            case 'tvod':
                checkAccess(item)
                break
            case 'free':
                handleBtnActions({ text: t('Смотреть'), purchased: true })
                break
            default:
                break
        }
    }

    const handlePlayMovie = () => {
        if (currentElement?.is_news) {
            if (currentElement.link !== 'https://example.com') {
                window.open(currentElement.link, '_blank')
            }
            if (currentElement?.is_tvchannel) {
                router.push(`/tv/tv-video?key=${currentElement.tv_channel_id}`)
            }
            return
        }
        function movieType() {
            const obj = {}
            if (currentElement?.is_megogo) {
                obj.type = 'megogo'
                obj.id = currentElement.id
            } else if (currentElement?.is_premier) {
                obj.type = 'premier'
                obj.id = currentElement.id
            } else {
                obj.type = 'uzdigital'
                obj.id = currentElement.slug
            }
            return obj
        }
        const url = `/movie/${movieType().id}`
        router.push(url)
    }

    function handleBtnActions(props) {
        let obj = {}
        obj.text = props?.text
        obj.purchased = props?.purchased ? props.purchased : false
        obj.background = props?.background ? props.background : 'bg-mainColor'
        setBtnData(obj)
    }

    function handleRouteMovie(url, props) {
        router.push(url + '?' + OptimizeQuery2(props))
    }

    const handlePrevButtonClick = () => {
        sliderRef.current.slickPrev() // Slide the slider to the previous slide
    }

    const handleNextButtonClick = () => {
        sliderRef.current.slickNext() // Slide the slider to the next slide
    }

    const handleAfterChange = (index) => {
        setCurrentIndex(index)
    }

    useEffect(() => {
        const currentelement = newList.find((i) => i.index === currentIndex)
        if (currentelement) {
            setCurrentElement(currentelement)
            handleCheckPurchase(currentelement)
        }
    }, [currentIndex, newList])

    const settings = {
        afterChange: handleAfterChange,
        dots: true,
        className: 'center',
        centerMode: true,
        infinite: true,
        centerPadding: '240px',
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 7000,
        speed: 500,
        AuthenticatorAttestationResponse,
    }

    const Trailer = useMemo(() => {
        if (!currentElement?.trailer?.length) return []

        const Auto = currentElement.trailer[0].videos?.find(
            (item) => item?.quality === 'auto',
        )

        const Ordinary = currentElement.trailer[0].videos[0]

        if (Auto) return Auto
        else return Ordinary ?? []
    }, [currentElement])

    return (
        <div id="bannerdesktop">
            <Slider
                ref={(slider) => (sliderRef.current = slider)}
                {...settings}
            >
                {newList?.map((item, index) => (
                    <BannerCard
                        key={index}
                        element={item}
                        btnData={btnData}
                        handlePlayMovie={handlePlayMovie}
                        player={player}
                        trailer={Trailer}
                    />
                ))}
            </Slider>
            {newList?.length > 1 && (
                <div>
                    <button className="btnLeft" onClick={handlePrevButtonClick}>
                        <BannerArrowLeft
                            width="30"
                            height="30"
                            stroke="#8B97B0"
                        />
                    </button>
                    <button
                        className="btnRight"
                        onClick={handleNextButtonClick}
                    >
                        <BannerArrowRight fill="#8B97B0" />
                    </button>
                </div>
            )}
        </div>
    )
}
