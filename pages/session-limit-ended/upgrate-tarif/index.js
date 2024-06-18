import Subscription from 'components/cards/Subscription'
import React, { useEffect, useState } from 'react'
import { useTranslation, Router } from 'i18n'
import axios from 'utils/axios'
import { ArrowBackIcon, MillionTvIcon } from 'components/svg'
import SEO from 'components/SEO'

export default function UpgrateTarif() {
    const { t, i18n } = useTranslation()
    const [subscription, setSubscription] = useState([])
    const [checkSubscription, setCheckSubscription] = useState({})
    const [buyFreeTrail, setBuyFreeTrail] = useState(false)

    useEffect(() => {
        axios
            .get(`subscription/category?type=${Router.query.type || ''}`)
            .then((res) => setSubscription(res.data.categories))
    }, [])

    return (
        <>
            <SEO />
            <div className="h-[100vh] wrapper">
                <div className="fixed flex justify-between items-center top-0 left-0 w-[100vw] px-6 md:px-[56px] lg:px-[96px] py-6 h-[72px] bg-[#161616]">
                    <button onClick={() => Router.push('/')}>
                        <MillionTvIcon />
                    </button>
                    <button onClick={() => Router.push('/')}>
                        <ArrowBackIcon className="w-4 h-4 md:w-auto md:h-auto" />
                    </button>
                </div>
                <div className="mt-[100px]">
                    <h2 className="text-[24px] text-white md:text-[34px] leading-[41px]">
                        {t('update_plan')}
                    </h2>
                </div>
                <div className="mt-5 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
                    {subscription.length > 0 &&
                        subscription?.map((item, i) => (
                            <div key={i}>
                                <Subscription
                                    checkSubscription={checkSubscription}
                                    setBuyFreeTrail={setBuyFreeTrail}
                                    text_btn={t('buy')}
                                    el={item}
                                    cost={item.subscriptions}
                                    title={item[`title_${i18n.language}`]}
                                    text={item[`description_${i18n.language}`]}
                                    isSessionLimit
                                />
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}
