import { FailedTicked } from 'components/svg'
import Modal from '@mui/material/Modal'
import cls from './style.module.scss'
import { Box } from '@mui/material'
import { useTranslation } from 'i18n'

export default function FailedPage({ open = false, handleClose = () => {} }) {
    const { t } = useTranslation()
    return (
        <>
            <Modal
                open={open}
                onClose={() => handleClose()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cls.modal}>
                    <FailedTicked />
                    <h2 className={cls.title}>{t('errorAddingCard')}</h2>
                    <p className={cls.text}>{t('tryAddAnotherCard')}</p>
                    <button
                        className={cls.button}
                        onClick={() => handleClose()}
                    >
                        {t('go_back')}
                    </button>
                </Box>
            </Modal>
        </>
    )
}
