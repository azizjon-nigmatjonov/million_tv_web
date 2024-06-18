import React, { useEffect, useMemo, useState } from 'react'
import Modal from '@mui/material/Modal'
import axios from 'utils/axios'

import PaymentForm from 'components/PaymentForm/PaymetnForm'
import AddCardsForm from 'components/AddCardForm/AddCardForm'
import PaySavedCards from 'components/paySavedCards/PaySavedCards'
import SuccesPayment from 'components/SuccesPayment/SuccesPayment'
import PriceEnterForm from 'components/PriceEnterForm/PriceEnterForm'
import UpBalanceItem from 'components/UpBalanceItem/UpBalanceItem'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'
import { getAllPaymentCards } from 'services/paymentService'
import {
    HumoIcon,
    PaymeIcon,
    UzCardIcon,
    ClickIcon,
    MasterCardIcon,
    VisaCard,
    UzumIcon,
} from '../../../../svg'
import style from './TopUpBalanceSettings.module.scss'
import PaymentFormClick from 'components/PaymentForm/PaymentFormClick'
import SuccessPage from './StatusPage/Success'
import FailedPage from './StatusPage/Failed'
import { parseCookies } from 'nookies'
import { userBalanceAction } from 'store/actions/application/userBalanceAction'
import { setPaymentOrderId } from 'store/actions/application/profileAction'

const styleMui = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '558px',
    maxWidth: '85%',
    minHeight: '329px',
    bgcolor: '#020C24',
    borderRadius: '12px',
    p: 4,
    outline: 'none',
}

const baseUrl = process.env.BASE_DOMAIN

const TopUpBalanceSettings = ({ balanceId }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [paymeModal, setPaymeModal] = useState(false)
    const [clickModal, setClickModal] = useState(false)
    const [cost, setCost] = useState('')
    const [value, setValue] = useState(0)
    // uzcard modal
    const [priceModal, setPriceModal] = React.useState(false)
    const [addModal, setAddModal] = React.useState(false)
    const [responseModal, setResponseModal] = React.useState(false)
    const [savedCardsModal, setSavedCardsModal] = React.useState(false)
    const { session_id } = parseCookies()
    const handleCostChange = (e) => {
        setCost(e.target.value.replace(/\s/g, ''))
    }

    // payme logic
    const handlePaymentFormSubmit = (e) => {
        e.preventDefault()
        const amount = Number(value.toString().replace(/\D/g, '')) * 100
        axios
            .post('payme-link-v2', {
                amount: amount,
                balance_id: balanceId,
                name: CurrentUserData?.name ? CurrentUserData?.name : '',
                url: baseUrl + router.asPath + `&amountSum=${amount}`,
            })
            .then((res) => {
                if (res?.data?.link) {
                    window.location.replace(res.data.link)
                }
            })
    }

    useEffect(() => {
        if (session_id) {
            axios
                .get('user-balance', {
                    SessionId: session_id,
                })
                .then((res) => {
                    dispatch(userBalanceAction(res?.data))
                })
        }
    }, [session_id])

    const handleClickFormSubmit = (e) => {
        e.preventDefault()
        const amount = Number(value.toString().replace(/\D/g, ''))
        axios
            .post('click-link', {
                amount: amount,
                balance_id: balanceId,
                // name: CurrentUserData?.name ? CurrentUserData?.name : '',
                // url: baseUrl + router.asPath,
            })
            .then((res) => {
                if (res) {
                    window.location.replace(res?.data?.link)
                }
            })
            .catch((err) => console.log('err', err))
    }

    const PayArr = [
        {
            id: 198,
            icon: <UzCardIcon />,
            title: 'Uzcard',
            operation: function () {
                setPriceModal('uzcard')
            },
        },

        {
            id: 200,
            icon: <HumoIcon />,
            title: 'Humo',
            operation: function () {
                setPriceModal(true)
            },
        },

        {
            id: 200,
            icon: <UzumIcon />,
            title: 'UzumBank',
            operation: function () {
                setPriceModal('uzumBank')
            },
        },

        {
            id: 1,
            icon: <PaymeIcon />,
            title: 'Payme',
            operation: function () {
                setPaymeModal(true)
            },
        },

        {
            id: 200,
            icon: <ClickIcon />,
            title: 'Click',
            iconTitle: 'Click',
            operation: function () {
                setClickModal(true)
            },
        },
        {
            id: 200,
            icon: <VisaCard />,
            title: 'Visa',
            operation: function () {
                setPriceModal('visa')
            },
        },
        {
            id: 200,
            icon: <MasterCardIcon />,
            title: 'MasterCard',
            operation: function () {
                setPriceModal('masterCard')
            },
        },
    ]

    const Status = useMemo(() => {
        // console.log("router => ", router);
        return router?.query?.status
    }, [router])

    useEffect(() => {
        dispatch(getAllPaymentCards())
    }, [])

    const clearQuery = () => {
        dispatch(setPaymentOrderId(''))
        router.push('settings?from=topUpBalance')
    }

    return (
        <div className="w-full">
            <div className="w-full md:w-[648px] grid grid-cols-2 gap-4 md:grid-cols-2">
                {PayArr.map((item) => (
                    <UpBalanceItem
                        key={item.id}
                        onClick={() => item.operation()}
                        data={item}
                    />
                ))}
            </div>
            <div>
                {/* payme */}
                <Modal
                    open={paymeModal}
                    onClose={() => setPaymeModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaymentForm
                        value={value}
                        setValue={setValue}
                        handleClose={() => setPaymeModal(false)}
                        handleSubmit={handlePaymentFormSubmit}
                    />
                </Modal>

                <Modal
                    open={clickModal}
                    onClose={() => setClickModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaymentFormClick
                        value={value}
                        setValue={setValue}
                        handleClose={() => setClickModal(false)}
                        handleSubmit={handleClickFormSubmit}
                    />
                </Modal>

                {/* uzcard humo */}
                {/* price modal */}
                <Modal
                    open={priceModal}
                    onClose={() => setPriceModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PriceEnterForm
                        priceModal={priceModal}
                        setPriceModal={setPriceModal}
                        setSavedCardsModal={setSavedCardsModal}
                        setAddModal={setAddModal}
                        value={cost}
                        onChange={handleCostChange}
                        setCost={setCost}
                        // handleSubmit={handleCostSubmit}
                    />
                </Modal>

                {/* saved cards modal */}
                <Modal
                    open={savedCardsModal}
                    onClose={() => setSavedCardsModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaySavedCards
                        setAddModal={setAddModal}
                        setSavedCardsModal={() => setSavedCardsModal()}
                        cost={cost}
                    />
                </Modal>

                {/* add card modal */}
                <Modal
                    open={addModal}
                    onClose={() => setAddModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleMui}>
                        <AddCardsForm
                            cost={cost}
                            // handleSubmit={handleAddcardSubmit}
                            onCancel={setAddModal}
                        />
                    </Box>
                </Modal>

                {/* response modal success or failure */}
                <Modal
                    open={responseModal}
                    onClose={() => setResponseModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={style.modal}>
                        <SuccesPayment cost={cost} />
                    </Box>
                </Modal>
            </div>
            <SuccessPage
                open={Status === 'success'}
                handleClose={() => clearQuery()}
            />
            <FailedPage
                open={Status === 'error'}
                handleClose={() => clearQuery()}
            />
        </div>
    )
}

export default TopUpBalanceSettings
