import React, { useState } from 'react'
import style from '../Settings.module.scss'
import { Link } from 'i18n'
import ProfilePage from './profilePage/ProfilePage'
import ProfilesList from './profilesListProfile'
import Favorites from './favorites/Favorites'
import { useRouter } from 'next/router'
import Payment from './payment/Payment'
import Devices from './devices/Devices'
import BoughtMovies from './boughtMovies/Bought'
import WatchedHistory from './watchedHistory/WatchedHistory'
import { useIsMobile } from 'hooks/useIsMobile'
import {
    FavoritesIcon,
    ProfileIcon,
    PaymentIcon,
    DevicesIcon,
    BoughtFilmsIcon,
    HistoryIcon,
    PromoCodeIcon,
    SupportIcon,
} from '../menuIcons'
import { useTranslation } from 'i18n'
import NotificationsPage from './notifications/NotificationsPage'
import OrderTable from './orderTable/OrderTable'
import TopUpBalanceSettings from './topUpBalance/TopUpBalanceSettings'
import PromoCodes from './promoCodes/PromoCodes'
import MyCards from './myCards/MyCards'
import SettingsSupport from './Support'
import { numberToPrice } from 'components/libs/numberToPrice'
import { destroyCookie, parseCookies } from 'nookies'
import { useDispatch } from 'react-redux'
import { setProfile } from 'store/actions/application/profileAction'
import { setProfilesList } from 'store/actions/application/profilesAction'
import {
    setRecommendationActivator,
    setRecommendationValue,
} from 'store/actions/application/recommendationActions'
import { LogoutIcon, SubscriptionsIcon } from 'components/svg'
import axios from 'utils/axios'

export default function TabFixed({
    profile,
    notifications,
    balanceId,
    balance,
}) {
    const router = useRouter()
    const routerFrom = router.query.from
    const { t } = useTranslation()
    const [activeUserDialog, setActiveUserDialog] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const { session_id } = parseCookies()

    const dispatch = useDispatch()
    const logout = () => {
        axios
            .delete(`/session`, {
                data: {
                    session_id,
                },
            })
            .then((res) => {
                destroyCookie(null, 'megogo_token', {
                    path: '/',
                })
                destroyCookie(null, 'profile_id', {
                    path: '/',
                })
                destroyCookie(null, 'access_token', {
                    path: '/',
                })
                destroyCookie(null, 'session_id', {
                    path: '/',
                })
                destroyCookie(null, 'user_id', {
                    path: '/',
                })
                destroyCookie(null, 'next-i18next', {
                    path: '/',
                })
                dispatch(setProfile(null))
                dispatch(setProfilesList(null))
                dispatch(setRecommendationValue(null))
                dispatch(setRecommendationActivator(false))
                sessionStorage.removeItem('listSelected')
                sessionStorage.removeItem('userActivation')
                window.localStorage.removeItem('idImageUpload')
                router.push('/')
            })
    }

    return (
        <div className={`${style.menu}`}>
            {
                <div
                    className={
                        router.query.from
                            ? `${style.setting_tabs} ${style.mobile_tabs}`
                            : style.setting_tabs
                    }
                >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col gap-2 rounded-[10px] py-2 px-3 bg-secondryBackground">
                            <p className="text-[14px] text-whiteLighter leading-[18px] ">
                                {t('your-id')}:
                            </p>
                            <p className="font-[500] text-white text-[16px] leading-[22px]">
                                {balance?.balance_id}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-[10px] py-2 px-3 bg-secondryBackground">
                            <p className="text-[14px] text-whiteLighter leading-[18px]">
                                {t('balance')}:
                            </p>
                            <p className="font-[500] text-white text-[16px] leading-[22px]">
                                {numberToPrice(
                                    Math.round(balance?.balance / 100),
                                )}{' '}
                                {t('currency')}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`${style.setting_tab} w-full md:w-[300px] scroll`}
                    >
                        <div className="bg-secondryBackground rounded-[12px] p-4">
                            <Link href="/settings?from=profile">
                                <a
                                    className={
                                        routerFrom === 'profile'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <ProfileIcon />
                                    <span>{t('profile')}</span>
                                </a>
                            </Link>

                            <Link href="/settings?from=topUpBalance">
                                <a
                                    className={
                                        routerFrom === 'topUpBalance'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <PaymentIcon />
                                    <span>{t('topUpBalance')}</span>
                                </a>
                            </Link>
                            <Link href="/settings?from=subscription">
                                <a
                                    className={
                                        routerFrom === 'subscription'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <SubscriptionsIcon />
                                    <span>{t('subscription')}</span>
                                </a>
                            </Link>
                            {/* <Link href="/settings?from=myCards">
                                <a
                                    className={
                                        routerFrom === 'myCards'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <MyCardsIcon />
                                    <span>Мои карты</span>
                                </a>
                            </Link> */}
                            <Link href="/settings?from=devices">
                                <a
                                    className={
                                        routerFrom === 'devices'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <DevicesIcon />
                                    <span>{t('devices')}</span>
                                </a>
                            </Link>

                            <Link href="/settings?from=favourite">
                                <a
                                    className={
                                        routerFrom === 'favourite'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <FavoritesIcon />
                                    <span>{t('favourite')}</span>
                                </a>
                            </Link>

                            <Link href="/settings?from=bought">
                                <a
                                    className={
                                        routerFrom === 'bought'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <BoughtFilmsIcon />
                                    <span>{t('bought')}</span>
                                </a>
                            </Link>

                            <Link href="/settings?from=watched-history">
                                <a
                                    className={
                                        routerFrom === 'watched-history'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <HistoryIcon />
                                    <span>{t('watched-history')}</span>
                                </a>
                            </Link>
                            <Link href="/settings?from=promo-codes">
                                <a
                                    className={
                                        routerFrom === 'promo-codes'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <PromoCodeIcon />
                                    <span>{t('promo-codes')}</span>
                                </a>
                            </Link>

                            {/* <Link href="/registration?from=codeTv">
                                <a className={style.settings_link}>
                                    <span>{t('enterWithCode')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link> */}

                            {/* <Link href="/settings?from=order-table">
                                <a
                                    className={
                                        routerFrom === 'order-table'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span>{t('order-table')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link> */}
                            <Link href="/settings?from=support">
                                <a
                                    className={
                                        routerFrom === 'support'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <SupportIcon />
                                    <span>{t('support')}</span>
                                </a>
                            </Link>

                            <div
                                onClick={() => logout()}
                                className="flex items-center gap-4 px-3 text-2xl border-t border-border mobile:hidden"
                            >
                                <LogoutIcon width="30" />
                                <span>{t('logout')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {routerFrom === 'profile' && (
                <ProfilePage
                    profile={profile}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    activeUserDialog={activeUserDialog ? activeUserDialog : []}
                />
            )}
            {routerFrom === 'profile' && (
                <ProfilesList
                    from={'desktop'}
                    setDialogOpen={setDialogOpen}
                    setActiveUserDialog={setActiveUserDialog}
                />
            )}
            {routerFrom === 'favourite' && <Favorites />}
            {routerFrom === 'topUpBalance' && (
                <TopUpBalanceSettings balanceId={balanceId} />
            )}
            {routerFrom === 'myCards' && <MyCards />}
            {routerFrom === 'support' && <SettingsSupport />}
            {routerFrom === 'watched-history' && <WatchedHistory />}
            {routerFrom === 'promo-codes' && <PromoCodes />}
            {routerFrom === 'subscription' && <Payment />}
            {routerFrom === 'bought' && <BoughtMovies />}
            {routerFrom === 'devices' && <Devices />}
            {routerFrom === 'notifications' && (
                <NotificationsPage notifications={notifications} />
            )}
            {routerFrom === 'order-table' && <OrderTable />}
        </div>
    )
}
