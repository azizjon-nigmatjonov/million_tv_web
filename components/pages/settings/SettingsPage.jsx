import Breadcrumb from 'components/common/BreadCrumb'
import { useRouter } from 'next/router'
import style from './Settings.module.scss'
import TabMenu from './settingsTabs/TabMenu'

import { useIsMobile } from 'hooks/useIsMobile'
import { useTranslation } from 'i18n'
import { useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { parseCookies } from 'nookies'

export default function SettingsPage({ profile, transactions, notifications }) {
    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const { t } = useTranslation()
    const isMobile = useIsMobile()
    const router = useRouter()
    const routerFrom = router.query.from
    const { access_token } = parseCookies()

    const breadcrumbs = useMemo(() => {
        const routerFrom = router.query.from
        const items = [
            { text: t('home'), link: '/' },
            {
                text: t('settings'),
                link: '/settings',
            },
        ]

        if (routerFrom === 'favourite') {
            items.push({
                text: t('favourite'),
                link: '/settings?from=favourite',
            })
        }

        if (routerFrom === 'profile') {
            items.push({
                text: t('profile'),
                link: '/settings?from=profile',
            })
        }
        if (routerFrom === 'topUpBalance') {
            items.push({
                text: t('topUpBalance'),
                link: '/settings?from=topUpBalance',
            })
        }
        if (routerFrom === 'devices') {
            items.push({
                text: t('devices'),
                link: '/settings?from=devices',
            })
        }
        if (routerFrom === 'watched-history') {
            items.push({
                text: t('watched-history'),
                link: '/settings?from=watched-history',
            })
        }
        if (routerFrom === 'promo-codes') {
            items.push({
                text: t('promo-codes'),
                link: '/settings?from=promo-codes',
            })
        }
        // if (routerFrom === 'support') {
        //     items.push({
        //         text: t(''),
        //         link: '/settings?from=support',
        //     })
        // }
        if (routerFrom === 'bought') {
            items.push({
                text: t('bought'),
                link: '/settings?from=support',
            })
        }
        return items
    }, [router.query.from])

    useEffect(() => {
        if (!access_token) router.push('/')
    }, [access_token])

    return (
        <div className={`${style.container} wrapper`}>
            <div className={style.wrapper}>
                {isMobile[0] && (
                    <Breadcrumb
                        list={breadcrumbs}
                        additionalClasses={`${style.breadcrumb}`}
                    />
                )}
            </div>

            <div className={style.settings}>
                {!isMobile[0] && (
                    <h2 className={`${style.settings_title} block`}>
                        {t(
                            router.query.from == 'myCards'
                                ? t('myCards')
                                : router.query.from
                                ? router.query.from
                                : 'settings',
                        )}
                    </h2>
                )}
                {isMobile[0] && routerFrom && (
                    <h2 className={`${style.settings_title} block`}>
                        {t('settings')}
                    </h2>
                )}

                {routerFrom !== 'codeTv' && (
                    <TabMenu
                        profile={profile}
                        transactions={transactions}
                        notifications={notifications}
                        balanceId={balance?.balance_id}
                        balance={balance}
                    />
                )}

                {/* {routerFrom === 'subscription' && <Payment />} */}
            </div>
        </div>
    )
}
