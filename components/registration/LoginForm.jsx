import { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { authorization } from 'components/config/firebase-config'
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    getAuth,
} from 'firebase/auth'
import { ArrowLeft, FacebookIconSecond, GoogleIcon } from 'components/svg'
import { Divider, Typography } from '@material-ui/core'
import cls from './Index.module.scss'
import { useTranslation } from 'i18n'
import axios from '../../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import DeviceDetector from 'device-detector-js'
import { setCookie } from 'nookies'
import { showAlert } from 'store/reducers/alertReducer'
import { Router } from 'i18n'
import { setRegistrationData } from 'store/actions/application/registrationActions'
import { setUserExist } from 'store/actions/application/profileAction'
import FInputMask from 'components/FElements/FInputMask'
import ConfidentialityContent from './Confidentiality'
import { useMobile } from 'hooks/useMobile'

const LoginForm = ({ setStep, setPhone, setExists, setLoginData, phone }) => {
    const { t, i18n } = useTranslation('common')
    const dispatch = useDispatch()
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const [googleAccaunt, setGoogleAccaunt] = useState({})
    const [facebookAccaunt, setFacebookAccaunt] = useState({})
    const registrationData = useSelector((state) => state.registrationData.data)
    const [checkConf, setCheckConf] = useState(false)
    const [openCheckbox, setOpenCheck] = useState('default')
    const [activeSocial, setActiveSocial] = useState(false)
    const mobile = useMobile('mobile')

    const signInWithApple = () => {
        const provider = new OAuthProvider('apple.com')
        provider.addScope('email')
        provider.addScope('name')

        provider.setCustomParameters({
            locale: 'en',
        })
        const auth = getAuth()
        signInWithPopup(auth, provider).then((result) => {
            const user = result.user
            const credential = OAuthProvider.credentialFromResult(result)
            const accessToken = credential.accessToken
            const idToken = credential.idToken
        })
    }

    const postData = (value) => {
        return {
            apple_id: '',
            facebook_id:
                value?.providerId !== 'google.com' ? value?.user?.uid : '',
            fcm_token: '',
            google_id:
                value?.providerId === 'google.com' ? value?.user?.uid : '',
            name: value?.user?.displayName,
            phone: value?.user?.phoneNumber ? value?.user?.phoneNumber : '',
            platform_name: `${device.os.name} ${device.os.platform} | ${device.client.name} ${device.client.version}`,
            platform: 3,
            email: value?.user?.email,
            tag: '',
        }
    }
    const saveCookies = (value) => {
        setCookie({}, 'profile_id', value.profile_id, { path: '/' })
        setCookie({}, 'session_id', value.session_id, {
            path: '/',
        })
        // if (!value.session_status) {
        //     Router.push(`/session-limit-ended?user_id=${value.id}`)
        //     return
        // }
        setCookie({}, 'access_token', value.access_token, {
            path: '/',
        })
        setCookie({}, 'user_id', value.id || value.user_id, {
            path: '/',
        })
        Router.push(Router.query.movie ? `movie/${Router.query.movie}` : '')
        dispatch(showAlert(t('login_alert'), 'success'))
    }

    const signInWithGoogle = () => {
        setActiveSocial(true)
        if (!checkConf) return
        const provider = new GoogleAuthProvider()
        signInWithPopup(authorization, provider)
            .then((res) => {
                setGoogleAccaunt(res)
            })
            .catch((error) => console.log(error))
    }

    const signInWithFacebook = () => {
        setActiveSocial(true)
        if (!checkConf) return
        const provider = new FacebookAuthProvider()
        signInWithPopup(authorization, provider)
            .then((res) => setFacebookAccaunt(res))
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        if (googleAccaunt?.operationType === 'signIn') {
            axios
                .get(`/customer/exists?google_id=${googleAccaunt.user?.uid}`)
                .then((res) => {
                    setExists(res?.data?.exists)
                    if (res.data.exists === true) {
                        axios
                            .post(
                                '/customer/login',
                                postData({ ...googleAccaunt, tag: '1' }),
                            )
                            .then((res) => {
                                saveCookies(res?.data)
                                if (!res.data.session_status) {
                                    Router.push(
                                        '/session-limit-ended?status=offline',
                                    )
                                    return
                                }
                                sessionStorage.setItem(
                                    'userActivation',
                                    'false',
                                )
                                Router.push('/')
                            })
                    } else {
                        axios
                            .post('/customer/register', postData(googleAccaunt))
                            .then((res) => {
                                setCookie(
                                    null,
                                    'profile_id',
                                    res?.data?.profile_id,
                                    { path: '/' },
                                )
                                setCookie(
                                    null,
                                    'session_id',
                                    res?.data?.session_id,
                                    {
                                        path: '/',
                                        maxAge: 30 * 24 * 60 * 60,
                                    },
                                )
                                setCookie(
                                    null,
                                    'access_token',
                                    res?.data?.access_token,
                                    {
                                        path: '/',
                                        maxAge: 30 * 24 * 60 * 60,
                                    },
                                )
                                setCookie(null, 'user_id', res?.data?.id, {
                                    path: '/',
                                    maxAge: 30 * 24 * 60 * 60,
                                })
                                setTimeout(() => {
                                    Router.push(
                                        `/profile-settings?id=${res?.data?.profile_id}`,
                                    )
                                }, 500)
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
        } else if (facebookAccaunt?.operationType === 'signIn') {
            axios
                .get(
                    `/customer/exists?facebook_id=${facebookAccaunt.user?.uid}`,
                )
                .then((res) => {
                    setExists(res.data.exists)
                    if (res.data.exists === true) {
                        axios
                            .post('/customer/login', postData(facebookAccaunt))
                            .then((res) => {
                                saveCookies(res.data)
                                if (!res.data.session_status) {
                                    Router.push(
                                        '/session-limit-ended?status=offline',
                                    )
                                    return
                                }
                                sessionStorage.setItem(
                                    'userActivation',
                                    'false',
                                )
                                Router.push('/')
                            })
                    } else {
                        axios
                            .post(
                                '/customer/register',
                                postData(facebookAccaunt),
                            )
                            .then((res) => {
                                saveCookies(res.data)
                                Router.push('/')
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
        }
    }, [googleAccaunt, facebookAccaunt])

    const formik = useFormik({
        initialValues: {
            phone_number: '',
        },

        validationSchema: Yup.object({
            phone_number: Yup.string()
                .min(17, t('invalid_number'))
                .required(t('phone_Number_Required')),
        }),

        onSubmit: (values) => {
            if (!checkConf) return
            axios
                .get(
                    `/customer/exists?phone=%2B${values.phone_number
                        .replace(/ /g, '')
                        .substring(1, values.phone_number.length)}`,
                )
                .then((res) => {
                    setExists(res.data.exists)
                    dispatch(setUserExist(res?.data?.exists))
                    setPhone(values.phone_number)
                    handleProfileData()
                    if (Router.query.from !== 'profile') {
                        if (res.data.exists === true) {
                            axios.get(
                                `/customer/send-code?phone=%2B${values.phone_number
                                    .replace(/ /g, '')
                                    .substring(1, values.phone_number.length)}`,
                            )
                            setStep('otp')
                        } else {
                            if (values.phone_number) {
                                axios.get(
                                    `/customer/send-code?phone=%2B${values.phone_number
                                        .replace(/ /g, '')
                                        .substring(
                                            1,
                                            values.phone_number.length,
                                        )}`,
                                )
                                setStep('otp')
                            }
                        }
                    } else {
                        if (res.data.exists === true) {
                            dispatch(
                                showAlert(
                                    t('This number is already registered'),
                                    'error',
                                ),
                            )
                        } else {
                            axios.get(
                                `/customer/send-code?phone=%2B${values.phone_number
                                    .replace(/ /g, '')
                                    .substring(1, values.phone_number.length)}`,
                            )
                            setStep('otp')
                        }
                    }
                })
        },
        validateOnChange: false,
        validateOnBlur: false,
    })

    function handleProfileData() {
        const data = {
            phone_number: formik.values.phone_number,
        }
        dispatch(setRegistrationData(data))
    }

    useEffect(() => {
        if (!registrationData?.phone_number) return
        formik.setFieldValue(
            'phone_number',
            registrationData.phone_number ?? [],
        )
    }, [registrationData])

    const FormSubtext = useMemo(() => {
        switch (i18n?.language) {
            case 'ru':
                return (
                    <p className={cls.formSubtext}>
                        Продолжая, вы соглашаетесь с нашими{' '}
                        <span>Условиями</span> использования и подтверждаете,
                        что прочитали наше Заявление о конфиденциальности и
                        файлах cookie.
                    </p>
                )
            case 'en':
                return (
                    <p className={cls.formSubtext}>
                        By continuing, you agree to our <span>Terms </span> of
                        Use and acknowledge that you have read our Privacy and
                        Cookies Statement.
                    </p>
                )
            default:
                return (
                    <p className={cls.formSubtext}>
                        {/* Davom etish orqali siz  */}
                        <span>Foydalanish </span> shartlariga rozilik bildirasiz
                        va Maxfiylik va Cookie-fayllar bayonnomamiz bilan
                        tanishganingizni tan olasiz.
                    </p>
                )
        }
    }, [i18n])

    function handlePhoneExist(phone) {
        axios
            .get(
                `/customer/exists?phone=%2B${phone
                    .replace(/ /g, '')
                    .substring(1, phone.length)}`,
            )
            .then((res) => {
                if (!res?.data?.exists) {
                    setOpenCheck(true)
                } else {
                    setCheckConf(true)
                    setOpenCheck(false)
                }
            })
    }

    useEffect(() => {
        if (formik?.values?.phone_number?.length > 16) {
            if (openCheckbox !== 'default') return
            handlePhoneExist(formik?.values?.phone_number)
        } else if (activeSocial) {
            setOpenCheck(true)
        } else {
            setOpenCheck('default')
        }
    }, [formik, activeSocial, openCheckbox])

    return (
        <div className="relative">
            <button
                onClick={() =>
                    Router.query.from === 'profile'
                        ? Router.push('/settings?from=profile')
                        : Router.push('/')
                }
                className={cls.backUserButton}
            >
                <ArrowLeft
                    width={`22px`}
                    height={`auto`}
                    className="group-hover:scale-125 duration-300"
                />
            </button>
            <form
                autoComplete="off"
                className={cls.form}
                onSubmit={formik.handleSubmit}
            >
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: '600',
                        lineHeight: '35px',
                    }}
                    className={cls.formtitle}
                >
                    {t('login_or_register')}
                </h1>
                <div className="relative mt-8 mb-6 grid grid-col-1 gap-2">
                    <FInputMask
                        autoFocus
                        mask={`+\\9\\9\\8 99 999 99 99`}
                        maskChar=""
                        type="tel"
                        name="phone_number"
                        placeholder={t('enterPhoneNumber')}
                        onBlur={formik.handleBlur}
                        errors={formik.errors}
                        touched={formik.touched.phone_number}
                        onKeyPress={(e) => {
                            e.code === 13 && e.preventDefault()
                        }}
                        classesInput="border border-border"
                        defaultValue={formik?.values?.phone_number}
                        alwaysShowMask={false}
                        formik={formik}
                    />
                </div>
                {openCheckbox && openCheckbox !== 'default' && (
                    <ConfidentialityContent
                        handleCheck={(val) => setCheckConf(val)}
                    />
                )}
                <button
                    className={`mt-2 w-full h-[48px] rounded-[12px] font-medium  outline-none border border-border ${
                        checkConf
                            ? 'bg-[#03A9F4] text-white'
                            : 'bg-mainColor text-whiteLighter'
                    }`}
                    type="submit"
                    id="loginButton"
                >
                    <Typography>{t('continue')}</Typography>
                </button>

                {Router.query.from !== 'profile' && (
                    <>
                        <div className="hidden md:flex items-center my-[25px]">
                            <Divider
                                width="40%"
                                style={{ backgroundColor: 'red' }}
                            />
                            <p className="text-center text-whiteLighter text-sm leading-[16px] mx-5">
                                {t('or')}
                            </p>
                            <Divider width="40%" />
                        </div>
                        <div className="md:hidden items-center my-[25px]">
                            <p className="text-center text-whiteLighter text-sm leading-[16px] mx-5">
                                {t('or enter by the')}
                            </p>
                        </div>
                        <div className={cls.integrationbuttons}>
                            <button
                                onClick={() => signInWithGoogle()}
                                className={cls.google}
                                type="button"
                            >
                                <GoogleIcon />
                                <p>{t('sign_Up_Google')}</p>
                            </button>
                            {/* <button
                                onClick={() => signInWithFacebook()}
                                className={cls.facebook}
                                type="button"
                            >
                                <FacebookIconSecond />
                                <p>{t('sign_Up_Facebook')}</p>
                            </button> */}
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}

export default LoginForm
