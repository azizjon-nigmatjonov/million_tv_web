import Subscription from 'components/cards/Subscription'
import { useTranslation } from 'i18n'
import NullDataSubsciption from './NullData'
export default function SubscriptionList({
    list = [],
    loading = true,
    checkSubscription,
    setBuyFreeTrail,
    nullData = {},
    GetSubscriptions,
    setCurrentTab,
    currentTab,
}) {
    const { i18n, t } = useTranslation()
    return (
        <>
            <div
                className="grid mobile:grid-cols-2 gap-4 mt-[30px]"
                style={{ width: nullData?.width ? `${nullData?.width}px` : '' }}
            >
                {!loading &&
                    list?.map((item, index) => (
                        <div key={index}>
                            <Subscription
                                checkSubscription={checkSubscription}
                                setBuyFreeTrail={setBuyFreeTrail}
                                text_btn={t('buy')}
                                el={item}
                                cost={item.subscriptions}
                                title={item[`title_${i18n.language}`]}
                                text={item[`description_${i18n.language}`]}
                                GetSubscriptions={GetSubscriptions}
                                setCurrentTab={setCurrentTab}
                                currentTab={currentTab}
                            />
                        </div>
                    ))}
            </div>
            {!list?.length && (
                <NullDataSubsciption loading={loading} nullData={nullData} />
            )}
        </>
    )
}
