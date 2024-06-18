import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'i18n'
import TextInput from 'components/form/input/TextInput'
import { Formik, useFormik } from 'formik'
import validateForm from 'utils/validateForm'
import * as Yup from 'yup'
import cls from './Index.module.scss'
import axios from '../../utils/axios'
import router from 'next/router'
import { Router } from 'i18n'
import DeviceDetector from 'device-detector-js'
import { ArrowBackUserIcon } from '../svg.js'
import { useSelector, useDispatch } from 'react-redux'
import { setCookie } from 'nookies'
import { showAlert } from 'store/reducers/alertReducer'
import DatePickers from 'components/pages/settings/settingsTabs/profilePage/dateComponent'
import moment from 'moment'
import CLabel from 'components/CElements/CLabel'
import CError from 'components/CElements/CError'

const AddUserForm = ({ setStep, setChildrenName, setProfileID, otpData }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const routerFrom = router.router.query.from
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const [device, setDevice] = useState(null)
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const profileType = useSelector((state) => state.mainProfile.profile_type)
    const [validateDate, setValidateDate] = useState(false)
    useEffect(() => {
        if (!device) {
            const deviceDetector = new DeviceDetector()
            const d = deviceDetector.parse(navigator.userAgent)
            setDevice(d)
        }
    }, [device])

    function checkSameName(arr, currentName) {
        if (!arr?.length) return false
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name?.toLowerCase() === currentName.toLowerCase()) {
                return true
            }
        }
        return false
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            pic: '',
            date_of_birth: '',
        },

        validationSchema: Yup.object({
            name: validateForm('name', t),
            date_of_birth: validateForm('date_of_birth', t),
        }),
        onSubmit: (values) => {
            if (checkSameName(ProfilesList?.profiles, values.name)) {
                dispatch(showAlert(t('user_name_is_already_exists'), 'error'))
                return
            }
            if (routerFrom !== 'profileCreate') {
                axios
                    .post('/customer/register', {
                        apple_id: '',
                        facebook_id: '',
                        fcm_token: '',
                        google_id: '',
                        name: values.name,
                        date_of_birth: values.date_of_birth,
                        phone: otpData.phone.replace(/ /g, ''),
                        platform: 0,
                        tag: '',
                    })
                    .then((res) => {
                        setProfileID(res?.data?.profile_id)
                        if (res) {
                            axios
                                .post('/customer/check-code', {
                                    code: otpData.code,
                                    phone: otpData.phone.replace(/ /g, ''),
                                    platform_name:
                                        device?.device?.brand === ''
                                            ? `${device.os.name} ${device.os.platform} | ${device.client.name} ${device.client.version}`
                                            : `${device.device.brand} ${device.device.model} | ${device.client.name} ${device.client.version}`,
                                })
                                .then((response) => {
                                    if (response) {
                                        setCookie(
                                            null,
                                            'profile_id',
                                            res?.data?.profile_id,
                                            { path: '/' },
                                        )
                                        setCookie(
                                            null,
                                            'session_id',
                                            response.data.session_id,
                                            {
                                                path: '/',
                                                maxAge: 30 * 24 * 60 * 60,
                                            },
                                        )
                                        setCookie(
                                            null,
                                            'access_token',
                                            response.data.access_token,
                                            {
                                                path: '/',
                                                maxAge: 30 * 24 * 60 * 60,
                                            },
                                        )
                                        setCookie(
                                            null,
                                            'user_id',
                                            response.data.id,
                                            {
                                                path: '/',
                                                maxAge: 30 * 24 * 60 * 60,
                                            },
                                        )
                                        Router.push(
                                            `/profile-settings?id=${
                                                res?.data?.profile_id
                                            }${
                                                Router?.query?.movie
                                                    ? `&movie=${Router?.query?.movie}`
                                                    : ''
                                            }${
                                                router?.query?.type
                                                    ? `&type=${router?.query?.type}`
                                                    : ''
                                            }${
                                                router?.query?.payment
                                                    ? `&payment=true`
                                                    : ''
                                            }${
                                                router?.query?.serial
                                                    ? `&serial=true`
                                                    : ''
                                            }`,
                                        )
                                    }
                                })
                        }
                    })
            } else {
                if (ProfilesList?.profile_limit === ProfilesList?.count) {
                    console.error(`You can't add a new profile`)
                } else {
                    if (profileType === 'adult') {
                        axios
                            .post('/profile', {
                                name: values.name,
                                profile_age: 0,
                                profile_type: profileType,
                            })
                            .then((res) => {
                                Router.push(
                                    `/profile-settings?id=${res?.data?.id}${
                                        Router?.query?.movie
                                            ? `&movie=${Router?.query?.movie}`
                                            : ''
                                    }${
                                        router?.query?.type
                                            ? `&type=${router?.query?.type}`
                                            : ''
                                    }${
                                        router?.query?.payment
                                            ? `&payment=true`
                                            : ''
                                    }${
                                        router?.query?.serial
                                            ? `&serial=true`
                                            : ''
                                    }`,
                                )
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        setChildrenName(values.name)
                        setStep('children')
                    }
                }
            }
        },
    })

    const handleChangeDate = (val) => {
        formik.setFieldValue('date_of_birth', moment(val).format('YYYY-MM-DD'))
    }

    useEffect(() => {
        setValidateDate(false)
    }, [formik.values.date_of_birth])

    const isButtonDisable = useMemo(() => {
        return !(formik.values.name.length >= 3 && formik.values.date_of_birth)
    }, [formik.values.name, formik.values.date_of_birth])

    return (
        <div className="relative">
            <button
                onClick={() => {
                    if (routerFrom === 'profileCreate') {
                        router.back()
                    } else {
                        setStep('login')
                    }
                }}
                className={`hidden md:flex absolute left-[-25px] top-[45px] bg-secondryBackground w-[50px] h-[50px] rounded-full items-center justify-center group z-[1] ${cls.backUserButton}`}
            >
                <ArrowBackUserIcon />
            </button>
            <form
                autoComplete="off"
                className={`${cls.formChooseUser} w-[400px] bg-secondryBackground`}
                onSubmit={formik.handleSubmit}
            >
                <div>
                    <h1 className="text-[28px] text-center font-medium leading-[35px]">
                        {t('add_new_profile')}
                    </h1>
                    <div className="my-4 grid grid-col-1 gap-4">
                        <TextInput
                            label="Введите имя"
                            className={`${
                                cls.input
                            } border border-mainColor focus:border-mainTextColor focus:outline-[#03a9f4] ${
                                formik.errors.name ? 'border border-error' : ''
                            } ${cls.textColor}`}
                            name="name"
                            placeholder={
                                routerFrom === 'profileCreate'
                                    ? t('write_new_user_name')
                                    : t('write name')
                            }
                            errors={formik.errors}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={name || formik.errors.name}
                            touched={formik.touched.name}
                            type="text"
                        />
                    </div>
                    <div className="mb-8 relative">
                        <CLabel title="Date_Birth" />
                        <DatePickers
                            value={formik.values.date_of_birth}
                            onChange={(val) => handleChangeDate(val)}
                            isValidated={validateDate ? '1px solid red' : ''}
                        />
                    </div>
                </div>

                <div className="flex justify-end flex-col mt-5">
                    <button
                        className={`${
                            isButtonDisable ? cls.disable : cls.buttonsubmit
                        }`}
                        type="submit"
                        onClick={() => {
                            setValidateDate(true)
                            formik.values.name.length
                                ? setName(t('mustBe_More_Than_Character3'))
                                : ''

                            !formik.values.date_of_birth
                                ? setDate('Majburiy maydon')
                                : ''
                            setTimeout(() => {
                                setName()
                                setDate()
                            }, 2000)
                        }}
                        // disabled={isButtonDisable}
                    >
                        {t('continue')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddUserForm
