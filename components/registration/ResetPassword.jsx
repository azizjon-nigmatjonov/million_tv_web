import { useState } from 'react'
import MainButton from 'components/button/MainButton'
import { useTranslation } from 'i18n'
import TextInput from 'components/form/input/TextInput'
import { useFormik } from 'formik'
import validateForm from 'utils/validateForm'
import * as Yup from 'yup'

const ResetPassword = ({ setStep }) => {
    const { t } = useTranslation('registration')
    const [loading, setLoading] = useState(false)
    const [resetStep, setResetStep] = useState(1)
    const formik = useFormik({
        initialValues: {
            email: '',
        },

        validationSchema: Yup.object({
            email: validateForm('email', t),
        }),
        onSubmit: (values) => {
            setLoading(true)
            // alert(JSON.stringify(values, null, 2))
            // setStep('reset-password-end')
            setResetStep(2)
        },
    })

    return (
        <form className="form" onSubmit={formik.handleSubmit}>
            <h1 className="form-title capitalize">
                {resetStep === 1 ? t('reset_password') : t('email_sent')}
            </h1>
            <p>
                {resetStep === 1
                    ? t('reset_password_text')
                    : t('follow_reset_instructions')}
            </p>
            {resetStep === 1 && (
                <>
                    <div className="my-8 grid grid-col-1 gap-4">
                        <TextInput
                            name="email"
                            placeholder={t('email')}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.email}
                            touched={formik.touched.email}
                        />
                    </div>
                    <div className="flex justify-end mt-8">
                        <MainButton
                            type="submit"
                            text={t('send_email')}
                            isLoading={loading}
                        />
                    </div>
                </>
            )}
        </form>
    )
}

export default ResetPassword
