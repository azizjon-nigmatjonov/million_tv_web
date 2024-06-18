import { useTranslation } from 'i18n'
import { useEffect, useRef, useState } from 'react'
import Countdown from 'react-countdown'
import VerificationInput from 'react-verification-input'
import cls from './CodeVerificationForm.module.scss'

export default function CodeVerificationForm({
    count = 5,
    verifyCode = () => {},
}) {
    const { t } = useTranslation()

    const [time, setTime] = useState(Date.now() + count * 1000)
    const [restart, setRestart] = useState(true)
    const [wrongCode, setWrongCode] = useState(false)
    const [code, setCode] = useState('')
    const countRef = useRef('')

    const resendVerificationCode = (e, api) => {
        console.log('api', api)
        e.preventDefault()
        setTime(Date.now() + count * 1000)
    }

    function processCode() {
        console.log('processCode')
    }

    const renderer = ({ hours, minutes, seconds, completed, api }) => {
        if (completed) {
            return (
                <div className={cls.resendCode}>
                    <p
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => resendVerificationCode(e, api)}
                    >
                        Отправить смс еще раз
                    </p>
                </div>
            )
        } else {
            return (
                <div className={cls.time}>
                    <span>{minutes > 9 ? minutes : `0 ${minutes}`}</span>
                    <span>{' : '}</span>
                    <span>{seconds > 9 ? seconds : `0 ${seconds}`}</span>
                </div>
            )
        }
    }

    useEffect(() => {
        if (restart) {
            countRef?.current?.start()
        }
    }, [restart, time])

    if (code?.length === 6) {
        verifyCode(code.toString())
    }
    return (
        <>
            <div className={cls.formotp}>
                <p className="text-12 leading-14 font-semibold md:text-14 md:leading-17">
                    {t('enter_code')}
                </p>
                {/* <form handleSubmit={processCode}> */}
                <div className="mt-[6px] mb-6 grid grid-col-1 gap-1">
                    <div className={cls.otpconfirm}>
                        <VerificationInput
                            length={6}
                            autoFocus
                            placeholder=""
                            type="tel"
                            validChars="/^\d+$/"
                            onChange={(e) => {
                                setCode(e.toString())
                            }}
                            onFocus={() => <></>}
                            classNames={{
                                container: cls.container,
                                character: false ? cls.nofocus : cls.character,
                                characterInactive: cls.character__inactive,
                                characterSelected:
                                    !false && cls.character__selected,
                            }}
                        />
                    </div>
                    {wrongCode ? (
                        <div className={cls.errorMessage}>
                            Код введён не правильно
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <Countdown
                    date={time}
                    renderer={renderer}
                    autoStart={false}
                    ref={countRef}
                ></Countdown>
                <button
                    type="submit"
                    onClick={() => processCode()}
                    disabled={false}
                    className={false ? cls.disable : cls.buttonsubmit}
                >
                    Продолжить
                </button>
                {/* </form> */}
                {false && (
                    <div className={cls.loading} ref={loadingAnimation} />
                )}
            </div>
        </>
    )
}
