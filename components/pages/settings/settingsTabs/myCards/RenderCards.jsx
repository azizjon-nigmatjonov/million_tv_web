import {
    EditIconCard,
    HumoIcon,
    UzCardIcon,
    DeleteIconTable,
} from 'components/svg'
import styles from './css/RenderCards.module.scss'

import * as React from 'react'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { showCardModal } from 'store/reducers/myCardsReducer'
import { useDispatch } from 'react-redux'

export default function RenderCards({
    cards,
    setShowOptionsModal,
    setDataToGive,
}) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const handleOpen = () => dispatch(showCardModal('SHOW_GLOBAL_MODAL_CARD'))

    const openConfirmation = (item) => {
        setShowOptionsModal(true)
        setDataToGive(item)
    }

    React.useEffect(() => {}, [])

    return (
        <article className={styles.cards_wrapper}>
            {cards != null &&
                cards.length > 0 &&
                cards.map((item) => {
                    return (
                        <div key={item?.id} className={styles.card}>
                            <div className={styles.left}>
                                {/* {item?.type == 'humo' && ( */}
                                {true && (
                                    <div className={styles.left_icon}>
                                        <HumoIcon />
                                    </div>
                                )}
                                {item?.type == 'uzcard' && (
                                    <div className={styles.left_icon}>
                                        <UzCardIcon />
                                    </div>
                                )}
                                <div className={styles.card_info}>
                                    <p>{item?.number}</p>
                                    <p>{item?.expire}</p>
                                </div>

                                {item?.isMain ? (
                                    <div className={styles.isMainCard}>
                                        {t('default')}
                                    </div>
                                ) : null}
                            </div>
                            <div
                                onClick={() => {
                                    openConfirmation(item)
                                }}
                                className={styles.right}
                            >
                                {item?.isMain ? (
                                    <DeleteIconTable />
                                ) : (
                                    <EditIconCard />
                                )}
                            </div>
                        </div>
                    )
                })}
            <Button
                className={styles.add_card_button}
                variant="contained"
                onClick={handleOpen}
            >
                {t('addNewCard')}
            </Button>
        </article>
    )
}
