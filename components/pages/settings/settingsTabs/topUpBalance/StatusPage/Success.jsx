import { TickeckIcon } from 'components/svg'
import Modal from '@mui/material/Modal'
import cls from './style.module.scss'
import { Box } from '@mui/material'
import { useTranslation } from 'i18n'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'utils/axios'
import { setPaymentOrderId } from 'store/actions/application/profileAction'

export default function SuccessPage({ open = false, handleClose = () => {} }) {
    const router = useRouter()
    const amountSum = useMemo(() => {
        return router?.query?.amountSum
    }, [router])
    const isUzum = useMemo(() => {
        return router?.query?.uzum
    }, [router])
    const orderID = useSelector((state) => state.mainProfile.payment_order_id)
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const showCheck = () => {
        console.log('fuch yo bitch', orderID)
        axios
            .get(`receipt?order_id=${orderID}`)
            .then((res) => {
                console.log('check_url =>> ', res?.data?.receipt_url)
                if (res?.data?.receipt_url) {
                    window.location.replace(res?.data?.receipt_url)
                }
            })
            .finally(() => {
                dispatch(setPaymentOrderId(''))
            })
    }

    return (
        <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={cls.modal}>
                <TickeckIcon />
                <h2 className={cls.title}>{t('Congratulations')}</h2>
                {amountSum && (
                    <p className={cls.text}>
                        Ваш баланс пополнен на сумму: {amountSum} сум .Новая
                        карта успешно добавлена
                    </p>
                )}
                {isUzum === 'true' && (
                    <button className={cls.check} onClick={() => showCheck()}>
                        {t('show_check')}
                    </button>
                )}
                <button className={cls.button} onClick={() => handleClose()}>
                    {t('go_back')}
                </button>
            </Box>
        </Modal>
    )
}
