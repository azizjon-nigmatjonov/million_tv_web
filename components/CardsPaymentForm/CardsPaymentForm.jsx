import { Box } from '@material-ui/core'
import { TableCloseIcon } from 'components/svg'
import { useTranslation } from '../../i18n'
import * as React from 'react'
import styles from './CardsPaymentForm.module.scss'
import InputMask from 'react-input-mask'
import { Button } from '@mui/material'
import PriceEnterForm from 'components/PriceEnterForm/PriceEnterForm'
import CodeVerificationForm from 'components/CodeVerificationForm/CodeVerificationForm'
import AddCardsForm from 'components/AddCardForm/AddCardForm'
import { useState } from 'react'
import next from 'next'
import SuccesPayment from 'components/SuccesPayment/SuccesPayment'
import PaySavedCards from 'components/paySavedCards/PaySavedCards'

export default function CardsPaymetnForm({
    handleClose,
    title,
    setCost,
    cost,
    setPriceModal,
    priceModal,
}) {
    const { t, i18n } = useTranslation()
    const [nextStepConditions, setNextStepConditions] = useState({
        next: 'enterPrice',
    })

    // ! handles for Add Card Step

    // ! handles for Cost Enter Step

    const handleCostSubmit = (e) => {
        e.preventDefault()
        if (cost > 1000)
            setNextStepConditions((old) => ({ ...old, next: 'addCard' }))
    }
    // ! handles for Success Step

    return <></>
}
