import * as React from 'react'
import Button from '@mui/material/Button'

import { useTranslation } from 'react-i18next'
import { MyCardsEmptyIcon } from '../../menuIcons'
import { useDispatch } from 'react-redux'
import styles from './css/NoCards.module.scss'
import { showCardModal } from 'store/reducers/myCardsReducer'

export default function NoCards({ setAddCardModal = () => {} }) {
    const { t } = useTranslation()

    const dispatch = useDispatch()
    return (
        <article className={styles.container}>
            <div className={`${styles.right} ${styles.right_top}`}>
                <MyCardsEmptyIcon />
            </div>
            <div className={styles.left}>
                <p className={styles.title_info}>{t('emptyCards')}</p>
                <p className={styles.title_advice}>{t('addYourCardsAdvice')}</p>
                <Button
                    className={styles.add_button}
                    variant="contained"
                    onClick={() => {
                        dispatch(showCardModal('SHOW_GLOBAL_MODAL_CARD'))
                    }}
                >
                    {t('addCardNull')}
                </Button>
            </div>
            <div className={`${styles.right} ${styles.right_bottom}`}>
                <MyCardsEmptyIcon />
            </div>
        </article>
    )
}
