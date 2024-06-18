import * as React from 'react'

import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import CodeVerificationForm from 'components/CodeVerificationForm/CodeVerificationForm'
import { saveCard, verifyCodePayme } from 'services/paymentService'
import { useDispatch } from 'react-redux'
import { getGlobalMyCards } from 'store/reducers/myCardsReducer'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
}

export function SmsCodeModal({
    showSms,
    setShowSms,
    data,
    setShowSuccess,
    setShowError,
}) {
    const [res, setRes] = React.useState()
    const dispatch = useDispatch()
    // verifying code payme
    const verifyCode = async (code) => {
        setRes(await verifyCodePayme(data?.id, data?.token, code))
        console.log('verifyCode', res?.result?.card)
        dispatch(saveCard(res?.result?.card?.token))
    }

    if (res?.result?.card?.verify === true) {
        setShowSms(false)
        setShowSuccess(true)
        setShowError(false)
    } else if (res?.result?.error != undefined) {
        console.log(res?.result?.error)
        setShowSms(false)
        setShowSuccess(true)
        setShowError(true)
    }

    return (
        <div>
            <Modal
                open={showSms}
                onClose={() => setShowSms(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CodeVerificationForm
                        count={data?.wait?.wait / 1000 || 60}
                        verifyCode={verifyCode}
                    />
                </Box>
            </Modal>
        </div>
    )
}
