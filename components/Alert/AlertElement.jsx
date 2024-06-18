import { Alert } from '@material-ui/lab'
import { SuccessAlertIcon } from 'components/svg'

const AlertElement = ({ id, title, type }) => {
    return (
        <div>
            <Alert
                iconMapping={{ success: <SuccessAlertIcon /> }}
                severity={type}
                className="shake-animation"
            >
                {title}
            </Alert>
        </div>
    )
}

export default AlertElement
