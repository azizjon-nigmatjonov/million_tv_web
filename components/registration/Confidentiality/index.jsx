import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'i18n'

export default function ConfidentialityContent({
    isAgreeError = false,
    handleCheck = () => {},
    handleClick = () => {},
    handleClickText = () => {},
    registrationData = {},
}) {
    const { i18n, t } = useTranslation()
    const router = useRouter()
    const [check, setCheck] = useState(false)

    function handleCheckbox() {
        setCheck((prev) => !prev)
    }

    useEffect(() => {
        handleCheck(check)
    }, [check])

    useEffect(() => {
        if (!registrationData?.confidentiality) return
        setCheck(registrationData.confidentiality)
    }, [registrationData])

    const ExtraConfidentiality = useMemo(() => {
        console.log('i18n?.language', i18n?.language)
        switch (i18n?.language) {
            case 'uz':
                return (
                    <p>
                        {/* Davom etish orqali siz{' '} */}
                        <span
                            className="text-mainTextColor"
                            onClick={() => router.push('/terms-of-use')}
                        >
                            Foydalanish shartlari
                        </span>{' '}
                        va
                        <span
                            onClick={() => router.push('/privacy-policy')}
                            className="text-mainTextColor"
                        >
                            {' '}
                            maxfiylik siyosatiga{' '}
                        </span>
                        rozilik bildiraman
                    </p>
                )
            case 'en':
                return (
                    <p>
                        By continuing, you agree to our{' '}
                        <span
                            className="text-mainTextColor"
                            onClick={() => router.push('/terms-of-use')}
                        >
                            Terms of Use
                        </span>{' '}
                        and{' '}
                        <span
                            onClick={() => router.push('/privacy-policy')}
                            className="text-mainTextColor"
                        >
                            Privacy Policy
                        </span>
                        <span className="text-mainTextColor">
                            the terms of use
                        </span>{' '}
                    </p>
                )
            default:
                return (
                    <p>
                        Продолжая, вы соглашаетесь с нашими{' '}
                        <span
                            className="text-mainTextColor"
                            onClick={() => router.push('/terms-of-use')}
                        >
                            Условиями использования
                        </span>{' '}
                        и{' '}
                        <span
                            onClick={() => router.push('/privacy-policy')}
                            className="text-mainTextColor"
                        >
                            Политикой конфиденциальности
                        </span>
                    </p>
                )
        }
    }, [i18n])

    return (
        <div className="flex gap-2 cursor-pointer relative my-5">
            <div className="w-5 h-5">
                <span
                    onClick={(e) => {
                        e.preventDefault()
                        handleCheckbox()
                        handleClick()
                    }}
                    className={`border-2 w-5 h-5 rounded-[4px] flex items-center justify-center ${
                        check
                            ? 'border-mainTextColor bg-mainTextColor'
                            : 'border-[#ffffff88]'
                    }`}
                >
                    {check && (
                        <CheckIcon
                            style={{ color: '#03A9F4', fontSize: '16px' }}
                        />
                    )}
                </span>
            </div>
            <p
                onClick={(e) => {
                    e.preventDefault()
                    handleClickText()
                }}
                className="text-dark text-sm font-medium relative"
            >
                {ExtraConfidentiality}
            </p>
            {isAgreeError && (
                <p className="text-error text-[13px] absolute -bottom-5 left-0">
                    {t('itis_required_to_know_uses_cases')}
                </p>
            )}
        </div>
    )
}
