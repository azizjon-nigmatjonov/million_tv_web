import styles from './PriceEnterForm.module.scss'
import InputMask from 'react-input-mask'
import { useTranslation } from '../../i18n'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { TableCloseIcon } from 'components/svg'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import axios from 'utils/axios'
import { useState } from 'react'
import { setPaymentOrderId } from 'store/actions/application/profileAction'
const baseUrl = process.env.BASE_DOMAIN
// const baseUrl = 'https://test.milliontv.uz/'

export default function PriceEnterForm({
    setPriceModal = () => {},
    value,
    onChange,
    setCost,
    priceModal,
}) {
    const { t } = useTranslation()
    const router = useRouter()

    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const mainProfileData = useSelector((state) => state.mainProfile)
    const dispatch = useDispatch()

    const [phoneNumber, setPhoneNumber] = useState(
        mainProfileData.profile_value.phone,
    )

    const handleNumberChange = (e) => {
        setPhoneNumber(e.target.value)
    }

    const submitPrice = () => {
        // console.log("value => ", value);
        // console.log("phoneNumber => ", phoneNumber);
        if (value.startsWith('0') || !value?.length) return true

        if (priceModal === 'uzumBank') {
            axios
                .post('uzum-link', {
                    amount: Number(value),
                    balance_id: balance?.balance_id,
                    phone_number: phoneNumber,
                    name: CurrentUserData?.name ? CurrentUserData?.name : '',
                    redirect_url:
                        baseUrl +
                        router.asPath.substring(1) +
                        '&status=success' +
                        '&uzum=true' +
                        `&amountSum=${Number(value)}`,
                    error_url:
                        baseUrl + router.asPath.substring(1) + '&status=error',
                })
                .then((res) => {
                    dispatch(setPaymentOrderId(res?.data?.order_id))
                    console.log('orderID =>> ', res?.data?.order_id)
                    if (res?.data?.link) window.location.replace(res.data.link)
                })
                .finally(() => setCost(''))
        } else {
            axios
                .post('payze-link', {
                    amount: Number(value),
                    balance_id: balance?.balance_id,
                    name: CurrentUserData?.name ? CurrentUserData?.name : '',
                    redirect_url:
                        baseUrl +
                        router.asPath.substring(1) +
                        '&status=success' +
                        'uzum=false' +
                        `&amountSum=${Number(value)}`,
                    error_url:
                        baseUrl + router.asPath.substring(1) + '&status=error',
                })
                .then((res) => {
                    if (res?.data?.link) window.location.replace(res.data.link)
                })
                .finally(() => setCost(''))
        }
    }

    return (
        <Box className={styles.modal}>
            <button
                className={styles.headerButton}
                onClick={() => setPriceModal(false)}
            >
                <TableCloseIcon />
            </button>
            <p className={styles.header}>
                Оплата через{' '}
                {priceModal === 'masterCard'
                    ? 'MasterCard'
                    : priceModal === 'visa'
                    ? 'Visa'
                    : priceModal === 'uzcard'
                    ? 'Uzcard'
                    : priceModal === 'uzumBank'
                    ? 'UzumBank'
                    : 'Humo'}{' '}
            </p>
            <div className={styles.form}>
                <div className={styles.label}>{t('enterCost')}</div>
                <InputMask
                    required
                    maskChar=""
                    mask="99999999"
                    onChange={onChange}
                    value={value}
                >
                    {() => (
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder={t('enterCostAmount')}
                            className={styles.input}
                        />
                    )}
                </InputMask>

                {priceModal === 'uzumBank' &&
                    !mainProfileData.profile_value.phone && (
                        <>
                            <div className={styles.label}>
                                {t('enterPhoneNumber')}
                            </div>
                            <InputMask
                                required
                                maskChar=""
                                mask={`+\\9\\9\\8 99 999 99 99`}
                                onChange={handleNumberChange}
                                value={phoneNumber}
                                placeholder="+998"
                            >
                                {() => (
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="+998"
                                        className={styles.input}
                                    />
                                )}
                            </InputMask>
                        </>
                    )}
                {/* <div className="relative mt-8 mb-6 grid grid-col-1 gap-2">
                    <FInputMask
                        mask={`+\\9\\9\\8 99 999 99 99`}
                        maskChar=""
                        type="tel"
                        name="phone_number"
                        placeholder={t('enterPhoneNumber')}
                        // onBlur={formik.handleBlur}
                        // errors={formik.errors}
                        // touched={formik.touched.phone_number}
                        onKeyPress={(e) => {
                            e.code === 13 && e.preventDefault()
                        }}
                        classesInput="border border-border"
                        defaultValue={phoneNumber}
                        alwaysShowMask={false}
                        // formik={formik}
                    />
                </div> */}
                <Button
                    className={styles.submitButton}
                    onClick={() => submitPrice()}
                    variant="contained"
                >
                    {t('pay')}
                </Button>
            </div>
        </Box>
    )
}
