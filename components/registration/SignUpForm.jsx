import { useState } from 'react'
import MainButton from 'components/button/MainButton'
import { useTranslation } from 'i18n'
import TextInput from 'components/form/input/TextInput'
import { useFormik } from 'formik'
import validateForm from 'utils/validateForm'
import * as Yup from 'yup'
import { AppleIcon, FacebookIcon, GoogleIcon, LineIcon } from 'components/svg'
import RegistrationButton from 'components/button/RegistrationButton'

const SignUpForm = ({ setStep }) => {
    const { t } = useTranslation('registration')
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },

        validationSchema: Yup.object({
            email: validateForm('email', t),
            password: validateForm('password', t),
        }),
        onSubmit: (values) => {
            setLoading(true)
            // alert(JSON.stringify(values, null, 2))
            setStep('addUser')
        },
    })

    return (
        <div className="form">
            <form autoComplete="off" onSubmit={formik.handleSubmit}>
                <h1 className="form-title capitalize">{t('registration')}</h1>
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
                    <TextInput
                        name="password"
                        type="password"
                        placeholder={t('password')}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.password}
                        touched={formik.touched.password}
                    />
                </div>
                <p className="text-7 leading-8 font-medium">
                    <span className="text-textGray">
                        {t('already signedUp?')}
                    </span>{' '}
                    <button
                        type="button"
                        className="text-white cursor-pointer hover:underline"
                        onClick={() => setStep('login')}
                    >
                        {t('Login here')}
                    </button>
                </p>

                <div className="flex justify-end mt-8">
                    <MainButton
                        type="submit"
                        text={t('registration')}
                        isLoading={loading}
                    />
                </div>
            </form>
            <div className="w-full text-center my-8 capitalize flex flex-row justify-between items-center text-9 leading-9 text-medium">
                <LineIcon />
                <span>{t('or')}</span>
                <LineIcon />
            </div>
            <div className="grid grid-col-1 gap-3">
                <RegistrationButton
                    icon={<GoogleIcon />}
                    text={t('login Google')}
                    // isLoading={loading} make it inside RegistrationButton
                    additionalClasses="bg-white text-black"
                />
                <RegistrationButton
                    icon={<FacebookIcon />}
                    text={t('login Facebook')}
                    // isLoading={loading} make it inside RegistrationButton
                    additionalClasses="bg-[#3B5998]"
                />
                <RegistrationButton
                    icon={<AppleIcon />}
                    text={t('login Apple')}
                    // isLoading={loading} make it inside RegistrationButton
                    additionalClasses="bg-white text-black"
                />
            </div>
        </div>
    )
}

export default SignUpForm
