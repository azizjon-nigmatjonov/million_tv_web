import React from 'react'
import { useTranslation } from 'i18n'
import PrivasyUz from 'components/pages/PrivasyPolicy/Uz'
import PrivasyEn from 'components/pages/PrivasyPolicy/En'
import PrivasyRu from 'components/pages/PrivasyPolicy/Ru'

const Privacy = () => {
    const { i18n } = useTranslation()

    return (
        <div className="wrapper-privacyPolicy">
            {i18n?.language === 'uz' ? (
                <PrivasyUz />
            ) : i18n?.language === 'en' ? (
                <PrivasyEn />
            ) : (
                <PrivasyRu />
            )}
        </div>
    )
}

export default Privacy
