import cls from './style.module.scss'
import CardBack from 'public/images/subsciption.png'
import { useTranslation } from 'i18n'
import moment from 'moment'
export default function UnpurchasedCard({ element }) {
    const { i18n, t } = useTranslation()
    console.log('element', element)

    function getTime(time) {
        if (i18n?.language === 'ru') {
            return 'Действует до ' + time
        }
        if (i18n?.language === 'en') {
            return 'Connected untill ' + time
        }
        if (i18n?.language === 'uz') {
            return time + ' yilgacha ulangan'
        }
    }

    return (
        <div className={cls.card}>
            <img className={cls.image} src={CardBack.src} alt="image" />
            <div className={cls.content}>
                <h1 className={cls.title}>
                    {element?.[`title_${i18n?.language}`]}
                </h1>
                <p className={cls.text}>
                    {element?.[`description_${i18n?.language}`]}
                </p>
                <div className={cls.bottom}>
                    {element.subscriptions?.map((item) => (
                        <div key={item.id}>
                            <div className={cls.btn}>
                                {item?.[`title_${i18n?.language}`] +
                                    ' / ' +
                                    item.price}{' '}
                                {t('currency')}
                            </div>
                            <p className={cls.info}>
                                {getTime(
                                    moment(item.end_date).format('DD.MM.YYYY'),
                                )}
                            </p>
                            <p className={cls.startDate}>
                                {moment(item.start_date).format('DD.MM.YYYY')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
