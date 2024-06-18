import { useSelector } from 'react-redux'
import AlertElement from './AlertElement'

const AlertComponent = () => {
    const alerts = useSelector((state) => state.alert.alerts)

    return (
        <div
            style={{
                zIndex: '999999999999999999',
            }}
            className="alerts"
        >
            {alerts.map((alert) => (
                <AlertElement
                    key={alert.id}
                    id={alert.id}
                    title={alert.title}
                    type={alert.type}
                />
            ))}
        </div>
    )
}

export default AlertComponent
