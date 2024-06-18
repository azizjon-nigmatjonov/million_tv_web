import { useTranslation } from 'i18n'
export default function CError({ name, errors, classes }) {
    const { t } = useTranslation()
    return (
        <>
            {errors?.[name] && (
                <p
                    className={`text-error text-sm absolute -bottom-[12px] left-0 ${classes}`}
                >
                    {t(errors[name])}
                </p>
            )}
        </>
    )
}
