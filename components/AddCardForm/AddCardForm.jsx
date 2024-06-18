import InputMask from 'react-input-mask'
import styles from './AddCardForm.module.scss'

import { Button } from '@mui/material'
import { numberToPrice } from 'components/libs/numberToPrice'
import { useTranslation } from '../../i18n'
import { useState } from 'react'
import axios from 'utils/axios'
import { useSelector } from 'react-redux'
const baseUrl = process.env.BASE_DOMAIN

export default function AddCardsForm({ handleSubmit, cost, onCancel }) {
    const { t } = useTranslation()

    const [form, setForm] = useState({
        cardNumber: '8600069195406311',
        cardExp: '0399',
        saveCard: false,
    })
    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const saveSendCard = () => {
        axios
            .post('payze-link', {
                amount: cost,
                balance_id: balance?.balance_id,
                name: CurrentUserData?.name ? CurrentUserData?.name : '',
                url: baseUrl + Router.asPath,
            })
            .then((res) => {
                if (res?.data?.link) window.location.replace(res.data.link)
            })
    }
    return (
        <form className={styles.form}>
            <div className={styles.costInfo}>
                <div className={styles.label}>
                    С карты будет списана сумма,указанная ниже
                </div>
                <div className={styles.cost}>{numberToPrice(cost)} сум</div>
            </div>

            <div className={styles.label}>{t('cardNumber')}</div>
            {/* card number */}
            <InputMask
                required
                name="cardNumber"
                className={styles.input}
                mask="9999 9999 9999 9999"
                alwaysShowMask={false}
                placeholder="8600 1234 567 8910"
                value={form.cardNumber}
                onChange={(event) =>
                    setForm({ ...form, cardNumber: event.target.value })
                }
            />

            {/* date issue */}
            <div className={styles.label}>{t('cardIssue')}</div>
            <InputMask
                required
                name="cardDate"
                className={styles.input}
                mask="99/99"
                alwaysShowMask={false}
                placeholder="ММ/ГГ"
                value={form.cardExp}
                onChange={(event) =>
                    setForm({ ...form, cardExp: event.target.value })
                }
            />

            {/* save */}
            <label className={styles.radio}>
                Запомнить карту
                <input
                    type="checkbox"
                    name="save"
                    defaultChecked={form.saveCard}
                    onChange={(event) => {
                        setForm({ ...form, saveCard: !form.saveCard })
                    }}
                />
                <span className={styles.checkmark}></span>
            </label>

            {/* operation */}
            <div className={styles.buttons}>
                <Button
                    className={styles.resetButton}
                    type="reset"
                    variant="contained"
                    onClick={() => onCancel(false)}
                >
                    {t('cancel')}
                </Button>
                <Button
                    className={styles.submitButton}
                    onClick={() => saveSendCard()}
                    // type="submit"
                    variant="contained"
                >
                    {t('pay')}
                </Button>
            </div>
        </form>
    )
}
