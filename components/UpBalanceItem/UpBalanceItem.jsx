import styles from './UpBalanceItem.module.scss'

export default function UpBalanceItem({ data, onClick }) {
    return (
        <div onClick={onClick} className={styles.block}>
            {data?.icon}
            <span className="ml-2 text-xl">{data?.iconTitle}</span>
        </div>
    )
}
