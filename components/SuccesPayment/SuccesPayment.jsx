import { Button } from '@material-ui/core'
import { numberToPrice } from 'components/libs/numberToPrice'
import { useTranslation } from 'react-i18next'
import styles from './SuccesPayment.module.scss'

export default function SuccesPayment({ cost, goBack }) {
    const { t } = useTranslation()
    return (
        <div className={styles.wrapper}>
            <div className={styles.icon}>
                <img src="../images/check-o.png" alt="check" />
            </div>
            <div className={styles.title}>{t('Congratulations')}</div>
            <div className={styles.subTitle}>
                {t('balanceMes')} {numberToPrice(cost)}
                {t('currency')}. {t('newCardAdded')}
            </div>
            <Button
                className={styles.submitButton}
                type="button"
                variant="contained"
                onClick={goBack}
            >
                {t('comeBack')}
            </Button>
        </div>
    )
}
