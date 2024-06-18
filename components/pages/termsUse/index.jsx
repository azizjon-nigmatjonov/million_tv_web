import TermsEn from './En'
import TermsRu from './Ru'
import TermsUz from './Uz'
import { useTranslation } from 'i18n'
export default function TermsOfUseWrapper() {
    const { i18n } = useTranslation()
    return (
        <div className="wrapper">
            {i18n?.language === 'uz' ? (
                <TermsUz />
            ) : i18n?.language === 'ru' ? (
                <TermsRu />
            ) : (
                <TermsEn />
            )}
        </div>
    )
}
