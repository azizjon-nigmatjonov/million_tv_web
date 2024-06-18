import { HumoIcon, UzCardIcon } from 'components/svg'
import styles from './UzcardOrHumo.module.scss'

export default function UzcardOrHumo() {
    return (
        <div className={styles.items}>
            <div className={styles.item}>
                <UzCardIcon />
            </div>
            <div className={styles.item}>
                <HumoIcon />
            </div>
        </div>
    )
}
