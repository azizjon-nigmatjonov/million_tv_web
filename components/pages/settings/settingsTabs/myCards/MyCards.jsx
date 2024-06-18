import { useEffect, useState } from 'react'
import { getAllPaymentCards } from 'services/paymentService'
import {
    SuccessModalIcon,
    HumoIcon,
    TableCloseIcon,
    UzCardIcon,
    FailureModalIcon,
} from 'components/svg'
import styless from './css/RenderForms.module.scss'
import NoCards from './NoCards'
import RenderCards from './RenderCards'
import InputMask from 'react-input-mask'
import { addCard } from 'services/paymentService'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SmsCodeModal } from './SmsCodeModal'
import OptionsModal from './OptionsModal'
import { useTranslation } from 'react-i18next'
import { getGlobalMyCards, showCardModal } from 'store/reducers/myCardsReducer'

const style = (success = false) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: success ? 523 : 610,
    height: success ? 352 : 452,
    background: '#111B33',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
})

export default function MyCards() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const selectStore = useSelector(
        (state) => state?.myCardsReducer?.globalCardModal,
    )
    const cards = useSelector((state) => state?.myCardsReducer?.cards)

    // const [cards, setCards] = useState([])
    const [addCardModal, setAddCardModal] = useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)
    const [showError, setShowError] = React.useState(false)

    const handleOpen = () => dispatch(showCardModal('SHOW_GLOBAL_MODAL_CARD'))
    const handleClose = () => dispatch(showCardModal('HIDE_GLOBAL_MODAL_CARD'))
    // options modal
    const [showOptionsModal, setShowOptionsModal] = React.useState(false)
    const [dataToGive, setDataToGive] = React.useState(null)
    const childFalse = () => setShowOptionsModal(false)
    const [showSms, setShowSms] = React.useState(false)
    const handleCloseSuccess = () => setShowSuccess(false)
    const [token, setToken] = React.useState(null)
    const [wait, setWait] = React.useState(null)
    const [cardInfo, setCardInfo] = React.useState({
        card_number: '',
        card_exp: '',
    })

    // cardList.map((item) => {
    //     if (item?.isMain === true) {
    //         cardList.splice(cardList.indexOf(item), 1)
    //         cardList.unshift(item)
    //     }
    // })

    useEffect(() => {
        // console.clear()
        dispatch(getAllPaymentCards())
    }, [])

    return (
        <>
            {cards?.length > 0 ? (
                <RenderCards
                    setDataToGive={setDataToGive}
                    setShowOptionsModal={setShowOptionsModal}
                    cards={cards}
                    addCardModal={addCardModal}
                    setAddCardModal={setAddCardModal}
                />
            ) : (
                <NoCards setAddCardModal={setAddCardModal} />
            )}
            <SmsCodeModal
                showSms={showSms}
                setShowSms={setShowSms}
                setShowSuccess={setShowSuccess}
                setShowError={setShowError}
                data={{ token, wait, id: 1 }}
            />
            <OptionsModal
                data={{ ...dataToGive }}
                openModal={showOptionsModal}
                setOpenModal={childFalse}
                isMain={true}
            />
            {selectStore ? (
                <Modal
                    open={selectStore}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style()}>
                        <form className={styless.form}>
                            <div className={styless.headerContainer}>
                                <p className={styless.title}>
                                    {t('addNewCard')}
                                </p>
                                <button onClick={() => handleClose()}>
                                    <TableCloseIcon />
                                </button>
                            </div>
                            <div className={styless.hr}></div>
                            <div className={styless.label}>
                                {t('cardNumber')}
                            </div>
                            {/* card number */}
                            <div className={styless.cardInfoContainer}>
                                <InputMask
                                    onChange={(event) =>
                                        setCardInfo({
                                            ...cardInfo,
                                            card_number: event.target.value,
                                        })
                                    }
                                    value={cardInfo?.card_number}
                                    required
                                    name="cardNumber"
                                    className={styless.input}
                                    mask="9999 9999 9999 9999"
                                    alwaysShowMask={false}
                                    placeholder={t('enter_card_number')}
                                />
                                <div className={styless.cardsPlaceholder}>
                                    {cardInfo?.card_number?.startsWith(
                                        '9860',
                                    ) ? (
                                        <HumoIcon />
                                    ) : null}
                                    {cardInfo?.card_number.startsWith('8600') ||
                                    cardInfo?.card_number?.startsWith(
                                        '6262',
                                    ) ? (
                                        <UzCardIcon />
                                    ) : null}
                                </div>
                            </div>

                            {/* date issue */}
                            <div className={styless.label}>
                                {t('cardIssue')}
                            </div>
                            <InputMask
                                onChange={(event) =>
                                    setCardInfo({
                                        ...cardInfo,
                                        card_exp: event.target.value,
                                    })
                                }
                                value={cardInfo?.card_exp}
                                required
                                name="cardDate"
                                className={styless.input}
                                mask="99/99"
                                alwaysShowMask={false}
                                placeholder="ММ/ГГ"
                            />

                            {/* operation */}
                            <div className={styless.buttons}>
                                <Button
                                    className={styless.resetButton}
                                    type="reset"
                                    variant="contained"
                                    onClick={() => handleClose()}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        addCard(
                                            cardInfo,
                                            setToken,
                                            setWait,
                                            setAddCardModal,
                                            setShowSms,
                                        )
                                            .then(() => {
                                                handleClose()
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                                handleClose()
                                                setShowSuccess(true)
                                                setShowError(true)
                                            })
                                    }}
                                    className={styless.submitButton}
                                    variant="contained"
                                >
                                    {t('addSome')}
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Modal>
            ) : null}
            {showSuccess ? (
                <Modal
                    open={showSuccess}
                    onClose={handleCloseSuccess}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={style(true)}
                        style={{ outline: 'none' }}
                        className={styless.successModal}
                    >
                        <div className={styless.successIcon}>
                            {showError ? (
                                <FailureModalIcon />
                            ) : (
                                <SuccessModalIcon />
                            )}
                        </div>
                        <p className={styless.successTitle}>
                            {showError
                                ? t('errorAddingCard')
                                : t('Congratulations')}
                        </p>
                        <p className={styless.modalMessage}>
                            {showError
                                ? t('tryAddAnotherCard')
                                : t('newCardAdded')}
                        </p>
                        <Button
                            className={styless.modalBackButton}
                            variant="contained"
                            onClick={() => handleCloseSuccess()}
                        >
                            {showError ? t('tryAnotherCardMes') : t('comeBack')}
                        </Button>
                    </Box>
                </Modal>
            ) : null}
        </>
    )
}
