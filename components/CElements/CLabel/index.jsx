import cls from './style.module.scss'
import { useTranslation } from 'i18n'
export default function CLabel({ title = 'label', required, styles = {} }) {
    const { t } = useTranslation()
    return (
        <p className={cls.label} style={{ ...styles }}>
            {required ? <span className={cls.required}>*</span> : ''}
            {t(title)}
        </p>
    )
}
