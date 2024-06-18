import { Box, Button } from '@material-ui/core'
import CurrencyInput from 'components/libs/currencyInput'
import { TableCloseIcon } from 'components/svg'
import React from 'react'
import { useTranslation } from '../../i18n'
import style from './PaymetnForm.module.scss'

export default function PaymentForm({
    value,
    setValue,
    handleClose,
    handleSubmit,
}) {
    const { t, i18n } = useTranslation()

    return (
        <Box className={style.modal}>
            <div
                className="absolute right-[15px] top-[15px] cursor-pointer"
                onClick={handleClose}
            >
                <TableCloseIcon />
            </div>

            <h1 className="text-[18px] text-white font-semibold leading-[24px] mb-4 text-center">
                {i18n.language !== 'uz' ? t('payment_via') : null} "Payme"
                {i18n.language === 'uz' ? t('payment_via') : null}
            </h1>
            <form
                className="flex item-center justify-center flex-col"
                onSubmit={handleSubmit}
            >
                <div className="flex item-center justify-center flex-col">
                    <label className={style.formLabel}>{t('enterCost')}</label>
                    <CurrencyInput
                        type="text"
                        placeholder={t('enterCostAmount')}
                        className={style.tableInput}
                        onChange={(e) => {
                            setValue(e.target.value)
                        }}
                    />
                </div>
                <div className={style.tableSubmitButton}>
                    <Button type="submit" variant="contained">
                        {t('pay')}
                    </Button>
                </div>
            </form>
        </Box>
    )
}
