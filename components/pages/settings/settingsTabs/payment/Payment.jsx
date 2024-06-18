import Subscription from 'components/cards/Subscription'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'i18n'
import axios from 'utils/axios'
import router from 'next/router'
import ErrorPopup from 'components/errorPopup/Popup'
import { SuccessSybscriptionIcon } from 'components/svg'
import { useIsMobile } from 'hooks/useIsMobile'
import CTabs from 'components/CTabs'
import SubscriptionList from './List'
import ListPurchased from './ListPurchased'
import { parseCookies } from 'nookies'
import { useDispatch } from 'react-redux'
import { userBalanceAction } from 'store/actions/application/userBalanceAction'

const customization = {
    '& .MuiTabs-flexContainer': {
        border: 'none',
        background: '#020C24',
        height: '50px',
        padding: '0 5px 0px 5px',
        borderRadius: '10px',
        display: 'inline-flex',
    },
    '& .MuiButtonBase-root': {
        color: '#8B97B0',
        background: 'transparent',
        borderRadius: '0',
        textTransform: 'none',
        fontSize: '16px',
        fontWight: '400',
        padding: '0 30px',
        textAlign: 'center',
        height: '40px',
    },
    '& .Mui-selected': {
        color: '#FFFFFF !important',
    },
    '& .MuiTabs-indicator': {
        backgroundColor: '#111B33',
        height: '100%',
        borderRadius: '8px',
        height: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
    },
}

export default function Payment() {
    const { t, i18n } = useTranslation()
    const [subscription, setSubscription] = useState(null)
    const [subscriptionTv, setSubscriptionTv] = useState(null)
    const [checkSubscription, setCheckSubscription] = useState({})
    const [buyFreeTrail, setBuyFreeTrail] = useState(false)
    const [freeTrialExpired, setFreeTrailExpired] = useState(null)
    const [expired, setExpired] = useState(true)
    const [currentTab, setCurrentTab] = useState({ index: 0, slug: 1 })
    const [loading, setLoading] = useState(false)
    const { session_id } = parseCookies()
    const dispatch = useDispatch()

    useEffect(() => {
        const category_slug = router?.query?.category_slug
        if (router?.query?.key === 'tv' || category_slug) {
            let queries = 'key=tv'
            if (category_slug) {
                queries = `key=${category_slug}`
            }

            axios.get(`subscription/category?${queries}`).then((res) => {
                if (category_slug) {
                    setSubscription(res?.data?.categories)
                } else setSubscriptionTv(res?.data?.categories)
            })
        } else {
            GetSubscriptions()
        }
    }, [i18n, router])

    const GetSubscriptions = () => {
        setLoading(true)
        axios
            .get(`get-all-categories`)
            .then((res) => {
                setSubscription(res.data.result)
            })
            .finally(() => setLoading(false))

        if (session_id) {
            axios
                .get('user-balance', {
                    SessionId: session_id,
                })
                .then((res) => {
                    dispatch(userBalanceAction(res?.data))
                })
        }
    }

    useEffect(() => {
        if (router?.query?.key === 'tv' && router?.query?.subscriptionId) {
            setCheckSubscription({
                message: 'FREE_TRIAL_EXPIRED',
                is_watched_free_trial: true,
            })
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
                            }
                        }
                    }
                }
            }
            setFreeTrailExpired(
                getTvSingleCategoryBySubscriptionId(
                    subscriptionTv,
                    router?.query?.subscriptionId,
                ),
            )
        } else if (
            router?.query?.key === 'tv' &&
            router?.query?.freeTrial === 'false'
        ) {
            setCheckSubscription({
                message: '',
                is_watched_free_trial: false,
            })
        } else if (router?.query?.key === 'tv') {
            setCheckSubscription({
                message: 'INACTIVE',
                is_watched_free_trial: true,
            })
        }
    }, [subscriptionTv, i18n])

    const TabList = useMemo(() => {
        const list = [
            {
                name: 'subscriptions',
                index: 0,
            },
            {
                name: 'purchased_subscriptions',
                index: 1,
            },
        ]

        if (router?.query?.category_slug) {
            list.push({ name: 'recommended_subscriptions', index: 2 })
            setCurrentTab({ name: 'recommended_subscriptions', index: 2 })
        }
        return list
    }, [router])

    useEffect(() => {
        if (router?.query?.current_tab) {
            setCurrentTab({
                index: +router.query.current_tab,
                name: 'purchased_subscriptions',
            })
        }
    }, [router])

    const CurrentPage = () => {
        switch (currentTab?.index) {
            case 0:
                return (
                    <SubscriptionList
                        list={subscription?.unpurchased}
                        type={'unpurchased'}
                        loading={loading}
                        setBuyFreeTrail={setBuyFreeTrail}
                        checkSubscription={checkSubscription}
                        nullData={{
                            text: t('no_data_subscriptions'),
                        }}
                        GetSubscriptions={GetSubscriptions}
                        setCurrentTab={setCurrentTab}
                        currentTab={currentTab}
                    />
                )
            case 1:
                return (
                    <ListPurchased
                        list={subscription?.purchased}
                        loading={loading}
                        nullData={{
                            text: t('your_purchased_subscription_null'),
                            context: t('purchase_subscription_for_watching'),
                        }}
                    />
                )
            case 2:
                return (
                    <SubscriptionList
                        list={subscription ?? []}
                        type={'unpurchased'}
                        loading={loading}
                        setBuyFreeTrail={setBuyFreeTrail}
                        checkSubscription={checkSubscription}
                        nullData={{
                            text: t('no_data_subscriptions'),
                        }}
                        GetSubscriptions={GetSubscriptions}
                        setCurrentTab={setCurrentTab}
                        currentTab={currentTab}
                    />
                )
            default:
                return <p></p>
        }
    }

    return (
        <div
            className={`w-full ${
                subscription !== null && subscriptionTv !== null
                    ? 'min-h-[100vh]'
                    : 'min-h-[30vh]'
            }`}
        >
            {router?.query?.key === 'tv' ? (
                <div className="mt-8 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 2xl:gap-x-5 gap-y-8">
                    {!router?.query?.subscriptionId &&
                        subscriptionTv?.map((item, index) => (
                            <div key={index}>
                                <Subscription
                                    el={item}
                                    cost={item.subscriptions}
                                    loading={loading}
                                    checkSubscription={checkSubscription}
                                    GetSubscriptions={GetSubscriptions}
                                    setBuyFreeTrail={setBuyFreeTrail}
                                />
                            </div>
                        ))}
                    {router?.query?.subscriptionId && freeTrialExpired && (
                        <div>
                            <Subscription
                                el={freeTrialExpired}
                                loading={loading}
                                cost={freeTrialExpired.subscriptions}
                                checkSubscription={checkSubscription}
                                GetSubscriptions={GetSubscriptions}
                                setBuyFreeTrail={setBuyFreeTrail}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('subscription')}
                        </h1>
                        <p className="mb-5 text-[#8B97B0] mt-3">
                            Дают доступ к каталогу лучших фильмов, сериалов и
                            мультфильмов.
                        </p>
                        <CTabs
                            tabList={TabList}
                            customization={customization}
                            passRouter={false}
                            currentTab={currentTab}
                            setCurrentTab={(element) => {
                                setCurrentTab(element)
                                GetSubscriptions()
                            }}
                        />
                        {<CurrentPage />}
                    </div>
                </div>
            )}
            {buyFreeTrail && router?.query?.tvPlay && (
                <ErrorPopup
                    openModal={expired}
                    setOpenModal={setExpired}
                    link={() => {
                        router.push(`/tv/tv-video?key=${router?.query?.tvPlay}`)
                    }}
                    title={t('Congratulations')}
                    textButton={t('start_watch')}
                    text={t('active_free_trail')}
                    icon={<SuccessSybscriptionIcon />}
                />
            )}
        </div>
    )
}
