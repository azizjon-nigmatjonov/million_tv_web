import { Box } from '@mui/system'
import { MyCardsIcon } from 'components/pages/settings/menuIcons'
import {
    CheckIconCards,
    HumoIcon,
    TableCloseIcon,
    UzCardIcon,
} from 'components/svg'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'

import styles from './PaySavedCards.module.scss'
import { numberToPrice } from 'components/libs/numberToPrice'
import { useEffect, useState } from 'react'

const styleMui = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '610px',
    height: '560px',
    bgcolor: '#111B33',
    borderRadius: '12px',
    p: 4,
    outline: 'none',
    padding: 0,
}

export default function PaySavedCards({
    setAddModal = () => {},
    setSavedCardsModal = () => {},
    cost,
}) {
    const storeCards = useSelector((state) => state?.myCardsReducer?.cards)

    const [cards, setCards] = useState([])
    const [id, setId] = useState(0)
    useEffect(() => {
        setCards(storeCards)
        console.log(cards)
    }, [])
    return (
        <Box sx={styleMui}>
            <div className={styles.container}>
                <button
                    onClick={() => setSavedCardsModal(false)}
                    className={styles.closeButton}
                >
                    <TableCloseIcon />
                </button>
                <p className={styles.head}>Оплата через "Uzcard/Humo"</p>
                <p className={styles.headInfo}>
                    С карты будет списана сумма,указанная ниже
                </p>
                <p className={styles.price}>{numberToPrice(cost)} сум</p>

                <div className={styles.hr}></div>

                <p className={styles.savedTitle}>Сохраненные карты</p>

                <div className={styles.cardWrapper}>
                    {cards.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={styles.cardContainer}
                                onClick={() => {
                                    setId(index)
                                }}
                            >
                                <div className={styles.cardLeft}>
                                    {item?.number.startsWith('9860') ? (
                                        <HumoIcon />
                                    ) : (
                                        <UzCardIcon />
                                    )}
                                    <p className={styles.mapPrice}>
                                        **** {item?.number.slice(12)}
                                    </p>
                                </div>
                                <div className={styles.cardRight}>
                                    {index == id ? <CheckIconCards /> : null}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <button
                    className={styles.addCard}
                    onClick={() => {
                        setSavedCardsModal(false)
                        setAddModal(true)
                    }}
                >
                    <MyCardsIcon />
                    <p>Добавить новую карту</p>
                </button>

                <div className={styles.operationWrapper}>
                    <Button
                        onClick={() => setSavedCardsModal()}
                        className={styles.cancel}
                        variant="contained"
                    >
                        Отменить
                    </Button>
                    <Button className={styles.process} variant="contained">
                        Оплатить
                    </Button>
                </div>
            </div>
        </Box>
    )
}
