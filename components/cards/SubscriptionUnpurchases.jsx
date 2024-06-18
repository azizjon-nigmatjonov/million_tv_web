import { DeviceIcon, DeviceIconTv } from 'components/svg'
import { useTranslation } from 'i18n'
import moment from 'moment'

const Subscription = ({ title, text, el, additionalClasses }) => {
    const { t, i18n } = useTranslation()
    return (
        <div
            className={`rounded-[12px] overflow-hidden text-white toTopAnimation ${
                additionalClasses ? additionalClasses : ''
            }`}
        >
            <div className="overflow-hidden h-[200px] relative w-full subscriptionImageBackgroundColor">
                {el?.category_image && (
                    <img
                        src={el?.category_image}
                        alt="img"
                        className="w-full h-full object-cover z-[99]"
                    />
                )}
                <h2 className="text-[18px] md:text-[22px] font-semibold absolute bottom-4 left-5 md:leading-13 z-[2]">
                    {title ? title : el[`title_${i18n?.language}`]}
                </h2>
            </div>
            <div className="p-3 bg-[#1D1A2C]">
                <div className="min-h-[130px]">
                    <div className="w-full grid grid-flow-row-dense grid-cols-2 mb-3 gap-2">
                        {el?.number_of_channels !== 0 ? (
                            <div className="flex items-center bg-[#fff] bg-opacity-[0.04] rounded-[10px] py-[8px] px-[10px]">
                                <DeviceIconTv width={'20'} />
                                <div className="text-[#E9E9E9] ml-[5px]">
                                    <p className="text-sm font-semibold">
                                        {el?.number_of_channels !== 0
                                            ? el?.number_of_channels
                                            : null}
                                    </p>
                                    <p className="text-[10px] whitespace-nowrap">
                                        {t('tvChannels')}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                        {el?.number_of_mas !== 0 ? (
                            <div className="flex items-center bg-[#fff] bg-opacity-[0.04] rounded-[10px] py-[8px] px-[8px]">
                                <div className="w-[20px]">
                                    <DeviceIcon width="20" height="16" />
                                </div>
                                <div className="text-[#E9E9E9] ml-[6px]">
                                    <p className="text-[15px] font-semibold">
                                        {el?.number_of_mas !== 0
                                            ? el?.number_of_mas
                                            : null}
                                    </p>
                                    <p className="text-[10px] whitespace-nowrap">
                                        {t('filmAndSerials')}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                        {el?.number_of_cartoons !== 0 ? (
                            <div className="flex items-center bg-[#fff] bg-opacity-[0.04] rounded-[10px] py-[8px] px-[10px]">
                                <DeviceIconTv width={'20'} />
                                <div className="text-[#E9E9E9] ml-[5px]">
                                    <p className="text-sm font-semibold">
                                        {el?.number_of_cartoons !== 0
                                            ? el?.number_of_cartoons
                                            : null}
                                    </p>
                                    <p className="text-[10px] whitespace-nowrap">
                                        {t('tvChannels')}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="min-h-[93px] max-h-[93px] text-[15px] text-[#D9D8E0] overflow-hidden">
                    {text ? text : el[`description_${i18n?.language}`]}
                </div>
                <div className="w-full h-[1px] bg-[#333044] my-3"></div>
                <div>
                    {el?.subscriptions?.map((value) => (
                        <div key={value.id}>
                            <span className="text-[#B0BABF]">
                                {value.status === 'ACTIVE'
                                    ? t('endSubcription')
                                    : t('Trial ends')}
                                :{' '}
                            </span>
                            {moment(value.end_date + '+00:00')
                                .locale('ru')
                                .format('LL')}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Subscription
