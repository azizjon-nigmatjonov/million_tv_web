import React, { useState } from 'react'
import SEO from 'components/SEO'
import { useTranslation } from 'i18n'
import { CancelIcon, LogoIcon, MillionTvIcon } from 'components/svg'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import validateForm from 'utils/validateForm'
import { Link } from 'i18n'
import TextInput from 'components/form/input/TextInput'
import MainButton from 'components/button/MainButton'

export default function Registration() {
    const { t } = useTranslation()
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
        },
    })
    // const [step, setStep] = useState('signup')
    return (
        <>
            <SEO />
            <div className="registration_container">
                <div className="min-h-screen flex items-center justify-center relative">
                    <div className="absolute w-screen flex justify-between px-[100px] pt-6 top-0 text-10 text-white">
                        <span className="cursor-pointer">
                            <h1 className="sr-only">Sharq tv</h1>
                            <MillionTvIcon />
                        </span>
                        <Link href="/">
                            <a>
                                <span className="cursor-pointer w-4 h-4">
                                    <CancelIcon />
                                </span>
                            </a>
                        </Link>
                    </div>
                    <form className="form" onSubmit={formik.handleSubmit}>
                        <h1 className="form-title capitalize">
                            {t('change_password')}
                        </h1>
                        <div className="my-8 grid grid-col-1 gap-4">
                            <TextInput
                                name="password"
                                type="password"
                                placeholder={t('new_password')}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.password}
                                touched={formik.touched.password}
                            />
                            <TextInput
                                name="confirm_password"
                                type="password"
                                placeholder={t('confirm_new_password')}
                                value={formik.values.confirm_password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.confirm_password}
                                touched={formik.touched.confirm_password}
                            />
                        </div>
                        <div className="flex justify-end pt-8">
                            <MainButton
                                type="button"
                                text={t('cancel')}
                                // isLoading={loading}
                                additionalClasses="bg-blackDark"
                            />
                        </div>
                        <div className="flex justify-end mt-3">
                            <MainButton
                                type="submit"
                                text={t('save')}
                                isLoading={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
