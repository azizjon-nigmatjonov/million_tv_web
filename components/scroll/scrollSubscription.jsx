import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'components/svg'
import { useTranslation } from 'i18n'
import router from 'next/router'
import Subscription from 'components/cards/Subscription'

const ScrollSubscription = ({
    el,
    setBuyFreeTrail,
    checkSubscription,
    setSubscription,
    type,
    text,
    title,
    additionalClasses,
    cost,
}) => {
    const { i18n } = useTranslation()
    const [freeTrailExpired, setFreeTrailExpired] = useState([])
    const [freeTrailExpiredCanceled, setFreeTrailExpiredCanceled] =
        useState(false)
    const ScrollBody = useRef(null)
    const [windowWidth] = useWindowSize()
    const [currentScroll, setCurrentScroll] = useState(0)
    const [showArrow, setShowArrow] = useState(true)

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const scrollTo = (direction) => {
        if (direction === 'right') {
            ScrollBody.current.scrollLeft += windowWidth.toString()
            setCurrentScroll((ScrollBody.current.scrollLeft += windowWidth[0]))
        } else {
            ScrollBody.current.scrollLeft -= windowWidth.toString()
            setCurrentScroll((ScrollBody.current.scrollLeft -= windowWidth[0]))
        }
    }

    useEffect(() => {
        if (checkSubscription?.message === 'FREE_TRIAL_EXPIRED') {
            function getTvSingleCategoryBySubscriptionId(
                category,
                subscription_id,
            ) {
                if (Array.isArray(category) && category?.length > 0) {
                    for (let i = 0; i < category?.length; i++) {
                        for (
                            let j = 0;
                            j < category[i].subscriptions?.length;
                            j++
                        ) {
                            if (
                                category[i].subscriptions[j].id ===
                                subscription_id
                            ) {
                                let res = {
                                    category_image: category[i].category_image,
                                    id: category[i].id,
                                    title_ru: category[i].title_ru,
                                    title_en: category[i].title_en,
                                    title_uz: category[i].title_uz,
                                    description_ru: category[i].description_ru,
                                    description_en: category[i].description_en,
                                    description_uz: category[i].description_uz,
                                    status: category[i].status,
                                    number_of_channels:
                                        category[i].number_of_channels,
                                    number_of_movies:
                                        category[i].number_of_movies,
                                    subscriptions: [],
                                }
                                res.subscriptions.push(
                                    category[i].subscriptions[j],
                                )
                                return res
                            } else {
                                setFreeTrailExpiredCanceled(true)
                            }
                        }
                    }
                }
            }
            setFreeTrailExpired(
                getTvSingleCategoryBySubscriptionId(
                    el,
                    checkSubscription.subscription_id,
                ),
            )
        }
    }, [checkSubscription])

    return (
        <div
            className="text-white relative"
            onMouseEnter={() => setShowArrow(true)}
            onMouseLeave={() => setShowArrow(false)}
        >
            <div
                ref={ScrollBody}
                className="overflow-x-scroll scroll-body-smooth relative grid-cols-1 sm:grid-cols-4 w-[100%] grid"
            >
                {type === 'subscription' &&
                    (checkSubscription?.message === 'FREE_TRIAL_EXPIRED' &&
                    !freeTrailExpiredCanceled ? (
                        <div>
                            <Subscription
                                checkSubscription={checkSubscription}
                                setBuyFreeTrail={setBuyFreeTrail}
                                text_btn={text}
                                el={freeTrailExpired}
                                cost={freeTrailExpired?.subscriptions}
                                title={
                                    freeTrailExpired &&
                                    freeTrailExpired[`title_${i18n.language}`]
                                }
                                text={
                                    freeTrailExpired[
                                        `description_${i18n.language}`
                                    ]
                                }
                                additionalClasses={additionalClasses}
                            />
                        </div>
                    ) : (
                        el?.map((item, i) => (
                            <div key={i} className="mb-6 w-[95%]">
                                <Subscription
                                    checkSubscription={checkSubscription}
                                    setBuyFreeTrail={setBuyFreeTrail}
                                    text_btn={text}
                                    el={item}
                                    cost={item.subscriptions}
                                    title={item[`title_${i18n.language}`]}
                                    text={item[`description_${i18n.language}`]}
                                    additionalClasses={additionalClasses}
                                />
                            </div>
                        ))
                    ))}
            </div>
            <div
                onClick={() => scrollTo('right')}
                className={`absolute right-0 top-0 cursor-pointer h-full flex items-center duration-300 border-2 ${
                    showArrow &&
                    windowWidth[0] !== currentScroll &&
                    el?.length > 4
                        ? 'opacity-[1]'
                        : 'opacity-0'
                } ${type === 'subscription' ? 'hidden' : ''} `}
            >
                <ArrowRight width="60" height="60" />
            </div>
            <div
                onClick={() => scrollTo('left')}
                className={`rotate-180 absolute left-0 top-0 cursor-pointer h-full flex items-center duration-300 ${
                    showArrow && currentScroll > 0 ? 'opacity-[1]' : 'opacity-0'
                } ${type === 'subscription' ? 'hidden' : ''}`}
            >
                <ArrowRight className="rotate-[20deg]" width="60" height="60" />
            </div>
        </div>
    )
}

export default ScrollSubscription
