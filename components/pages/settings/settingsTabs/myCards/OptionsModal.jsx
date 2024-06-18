import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { MyCardsEmptyIcon } from '../../menuIcons'
import { HumoIcon, TableCloseIcon, UzCardIcon } from 'components/svg'
import styles from './css/OptionsModal.module.scss'
import { useTranslation } from 'react-i18next'
import { deletePaymentCard } from 'services/paymentService'
import { useDispatch } from 'react-redux'
import nookies from 'nookies'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    height: 320,
    boxShadow: 24,
    background: '#111B33',
    outline: 'none',
    border: 'none',
    borderRadius: '12px',
    p: 4,
}

export default function OptionsModal({ data, openModal, setOpenModal }) {
    const [t] = useTranslation()
    const dispatch = useDispatch()

    const makeDefaultCard = () => {
        // request to set Default Card
        if (data?.isMain === true) {
            setOpenModal(false)
        }
    }

    const cookies = nookies.get()
    const token = cookies.access_token
    const uuid = cookies.session_id

    const deleteCard = () => {
        console.log(token, uuid)
        dispatch(deletePaymentCard(data?.token, uuid, token))
    }
    return (
        <>
            {openModal === true && data != null ? (
                <Modal
                    // open={openModal}
                    open={true}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={styles.modalContainer} sx={style}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeadIcon}>
                                {data?.isMain === true ? (
                                    <MyCardsEmptyIcon />
                                ) : (
                                    <div className={styles.modalHeadCard}>
                                        <span></span>
                                        <div
                                            className={styles.modalHeadCardIcon}
                                        >
                                            {/* {data?.type === 'humo' ? ( */}
                                            {true ? <HumoIcon /> : null}
                                            {data?.type === 'uzcard' ? (
                                                <UzCardIcon />
                                            ) : null}
                                        </div>
                                        <p className={styles.modalHeadNumber}>
                                            {data?.number?.slice(12)}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setOpenModal(false)
                                    console.log('imma working')
                                }}
                            >
                                <TableCloseIcon />
                            </button>
                        </div>

                        <div className={styles.modalButtons}>
                            <Button
                                onClick={() => makeDefaultCard()}
                                variant="outlined"
                                className={styles.modalCancel}
                            >
                                {data?.isMain === true
                                    ? t('leaveCard')
                                    : t('makeMainCard')}
                            </Button>
                            <Button
                                onClick={() => deleteCard()}
                                variant="outlined"
                                className={styles.modalAction}
                            >
                                {t('deleteCard')}
                            </Button>
                        </div>
                    </Box>
                </Modal>
            ) : null}
        </>
    )
}
