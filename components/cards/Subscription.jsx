import MainButton from 'components/button/MainButton'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'i18n'
import axios from '../../utils/axios'
import { parseCookies } from 'nookies'
import router from 'next/router'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import { useSelector, useDispatch } from 'react-redux'
import { showAlert } from 'store/reducers/alertReducer'
import cls from './style.module.scss'
import formatMoney from 'utils/formatMoney'
import InfoModal from 'components/modal/InfoModal'
import CardBack from 'public/images/subsciption.png'

const Subscription = ({
    text,
    el,
    cost,
    checkSubscription,
    setBuyFreeTrail,
    GetSubscriptions = () => {},
    setCurrentTab,
    currentTab,
}) => {
    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const [price, setPrice] = useState(cost ? cost.reverse()[0] : '')
    const [open, setOpen] = useState(false)
    const { t, i18n } = useTranslation()
    const { user_id, session_id } = parseCookies()
    const dispatch = useDispatch()
    const IN_AKTIVE =
        cost &&
        cost.find((item) =>
            item.id === checkSubscription?.subscription_id
                ? checkSubscription?.subscription_id
                : router?.query?.subscriptionId,
        )

    const getSubscriptionTv = (subscription) => {
        if (router?.query?.message === 'INACTIVE') {
            for (let j = 0; j < subscription.subscriptions?.length; j++) {
                if (subscription.subscriptions[j].id === price.id) {
                    axios
                        .post(`user-subscription`, {
                            subscription_id: price.id,
                            user_id: user_id,
                        })
                        .then((res) => {
                            if (
                                price?.free_trial === 0 ||
                                checkSubscription.is_watched_free_trial === true
                            ) {
                                axios
                                    .post(`payme-link/svod`, {
                                        amount:
                                            checkSubscription?.message ===
                                                'INACTIVE' ||
                                            checkSubscription?.message ===
                                                'CANCELLED' ||
                                            checkSubscription?.message ===
                                                'FREE_TRIAL_EXPIRED'
                                                ? IN_AKTIVE?.price
                                                : price.price,
                                        lang: i18n?.language,
                                        movie_key: router.query.movie,
                                        path_key: router.asPath,
                                        purchase_id: res.data.id,
                                        url: router?.query?.tvPlay
                                            ? process.env.BASE_URL_REDIRECT
                                            : checkSubscription.is_watched_free_trial
                                            ? `${process.env.BASE_URL_REDIRECT}${router.asPath}`
                                            : process.env.BASE_URL_REDIRECT,
                                    })
                                    .then((res) => {
                                        window.location.replace(res.data.link)
                                    })
                            } else {
                                setBuyFreeTrail(true)
                            }
                        })
                }
            }
        }
    }
    const buySubscription = () => {
        const subscriptionAmount =
            checkSubscription?.message === 'INACTIVE' ||
            checkSubscription?.message === 'CANCELLED' ||
            checkSubscription?.message === 'FREE_TRIAL_EXPIRED'
                ? IN_AKTIVE?.price
                : price?.price

        if (balance?.balance >= subscriptionAmount / 100) {
            axios
                .post(`user-subscription`, {
                    subscription_id:
                        checkSubscription?.message === 'INACTIVE' ||
                        checkSubscription?.message === 'CANCELLED' ||
                        checkSubscription?.message === 'FREE_TRIAL_EXPIRED'
                            ? IN_AKTIVE?.id
                            : IN_AKTIVE?.id
                            ? price?.id
                            : price?.id,
                    sessionId: session_id,
                })
                .then((res) => {
                    if (res.data.id) {
                        axios
                            .get('buy-subscription-svod', {
                                params: {
                                    SessionId: session_id,
                                    balance_id: balance?.balance_id,
                                    amount: subscriptionAmount / 100,
                                    user_subscription_id: res.data.id,
                                },
                            })
                            .then((res) => {
                                GetSubscriptions()
                                router.push(
                                    '/settings?from=subscription&current_tab=1',
                                )
                            })
                            .catch((err) => console.log('err', err))
                    }
                })
        } else {
            dispatch(showAlert(t('enoughFunds'), 'error'))
        }
    }

    const SelectInput = styled(InputBase)(({ theme }) => ({
        width: '100%',
        borderRadius: '8px',
        minHeight: 'auto',
        padding: '0',
        '& .MuiInputBase-input': {
            border: '1px solid #111B33',
            backgroundColor: '#020C24',
            borderRadius: '8px',
            minHeight: 'auto',
            width: '100%',
            padding: '10px 25px 10px 16px !important',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        '& .MuiSvgIcon-root': {
            fill: 'white',
        },
    }))

    useEffect(() => {
        setPrice(el?.subscriptions?.[0])
        if (
            checkSubscription.is_watched_free_trial === false &&
            checkSubscription.message === ''
        ) {
            for (let j = 0; j < el.subscriptions.length; j++) {
                if (el.subscriptions[j].free_trial > 0) {
                    setPrice(el.subscriptions[j])
                }
            }
        } else if (
            checkSubscription.is_watched_free_trial === true &&
            checkSubscription.message === 'INACTIVE'
        ) {
            setPrice(el.subscriptions[0])
        } else if (
            checkSubscription?.subscription_id &&
            checkSubscription.message === 'FREE_TRIAL_EXPIRED'
        ) {
            for (let j = 0; j < el.subscriptions?.length; j++) {
                if (
                    el.subscriptions[j].id ===
                    checkSubscription?.subscription_id
                ) {
                    setPrice(el.subscriptions[j])
                } else {
                    el.subscriptions[0]
                }
            }
            setPrice
        }
    }, [checkSubscription, price, el, i18n, currentTab])

    const TextModal = useMemo(() => {
        if (open.type === 'buy') {
            let res = `Вы уверенны, что хотите Оформить подписку ${open.name} ?`
            if (i18n?.language === 'uz')
                res = `Haqiqatan ham ${open.name} ga obuna boʻlishni xohlaysizmi?`
            if (i18n?.language === 'en')
                res = `Are you sure you want to Subscribe to ${open.name} ?`
            return res
        }
        return t('enoughFunds')
    }, [open, i18n])

    return (
        <div id="subsciptionPage">
            <div
                className={`rounded-[12px] overflow-hidden text-white toTopAnimation border border-border h-[auto] p-4 ${cls.subscription}`}
            >
                <img className={cls.image} src={CardBack.src} alt="image" />
                <div className="relative h-full z-[3]">
                    <div>
                        <h1 className="mb-3 text-2xl font-bold">
                            {el[`title_${i18n.language}`]}
                        </h1>

                        <p className="mt-[16px] mb-[24px]">
                            {text ? text : el[`description_${i18n.language}`]}
                        </p>
                        <div className="left-0 w-full">
                            {el.subscriptions.length ? (
                                <div>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Select
                                            input={<SelectInput />}
                                            displayEmpty
                                            defaultValue={price}
                                            inputProps={{
                                                'aria-label': 'Without label',
                                            }}
                                        >
                                            {el.subscriptions?.length &&
                                                el.subscriptions
                                                    .sort((a, b) => {
                                                        return (
                                                            a.title_en.slice(
                                                                0,
                                                                3,
                                                            ) -
                                                            b.title_en.slice(
                                                                0,
                                                                3,
                                                            )
                                                        )
                                                    })
                                                    .map(
                                                        (
                                                            subscription,
                                                            index,
                                                        ) => {
                                                            return (
                                                                <div
                                                                    onClick={() =>
                                                                        setPrice(
                                                                            subscription,
                                                                        )
                                                                    }
                                                                    key={index}
                                                                    value={
                                                                        subscription
                                                                    }
                                                                    className={`flex justify-between w-full font-medium bg-[#020C24] px-4 py-2 cursor-pointer ${cls.menuItem}`}
                                                                >
                                                                    {
                                                                        subscription[
                                                                            `title_${i18n.language}`
                                                                        ]
                                                                    }{' '}
                                                                    {t('for')}{' '}
                                                                    {formatMoney(
                                                                        subscription?.price /
                                                                            100,
                                                                    )}{' '}
                                                                    {t('sum')}
                                                                </div>
                                                            )
                                                        },
                                                    )}
                                        </Select>
                                    </FormControl>
                                </div>
                            ) : (
                                <div className="h-[45px]"></div>
                            )}

                            <MainButton
                                onClick={() => {
                                    if (router?.query?.message === 'INACTIVE') {
                                        getSubscriptionTv(el)
                                    } else
                                        setOpen({
                                            name: el[`title_${i18n.language}`],
                                            active: true,
                                            type: 'buy',
                                        })
                                }}
                                text={
                                    price?.free_trial === 0 ||
                                    checkSubscription.is_watched_free_trial ===
                                        true
                                        ? t('buy_subscription')
                                        : t('start_free')
                                }
                                additionalClasses="w-full bg-[#03a9f4] rounded-[8px] mt-3 bgHoverBlue duration-300"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <InfoModal
                open={open?.active}
                mainButton={t(open?.type === 'buy' ? 'yes' : 'topUpBalance')}
                bgColorMain="bg-[#111B33]"
                bgColorCencel="bg-[#03A9F4]"
                textColorMain="text-[#fff]"
                setOpen={setOpen}
                title={TextModal}
                onClick={() => {
                    buySubscription()
                }}
            />
        </div>
    )
}

export default Subscription
