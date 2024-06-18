import { SubscriptionIcon } from 'components/svg'
import cls from './style.module.scss'
export default function NullDataSubsciption({ loading, nullData }) {
    return (
        <div>
            {loading ? (
                ''
            ) : (
                <div className={cls.nulldata}>
                    <SubscriptionIcon />
                    {nullData?.text && (
                        <p className={cls.text}>{nullData?.text}</p>
                    )}
                    {nullData?.context && (
                        <p className={cls.context}>{nullData?.context}</p>
                    )}
                </div>
            )}
        </div>
    )
}
