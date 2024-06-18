import React, { useState, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import DatePickers from './dateComponent'
import style from '../../Settings.module.scss'
import MainButton from 'components/button/MainButton'
import axios from 'utils/axios'
import InputMask from 'react-input-mask'
import InputProfile from './InputProfile'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'i18n'
import * as Yup from 'yup'
import { destroyCookie, parseCookies } from 'nookies'
import { showAlert } from 'store/reducers/alertReducer'
import SelectMenu from 'components/form/select'
import InfoModal from 'components/modal/InfoModal'
import { ProfileImgChange } from '../../../../svg.js'
import LanguageDrawer from './Drawer'
import { useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import Subprofile from './Subprofile'
import { setProfilesList } from 'store/actions/application/profilesAction'

import {
    LogoutIcon,
    RussianIcon,
    DropDownIcon,
    ArrowBackIcon,
} from 'components/svg'
import moment from 'moment'
import { i18n, Router } from 'i18n'
import { ActiveIcon } from 'components/form/costumeSelect/filterSVG'
import {
    setRecommendationValue,
    setRecommendationActivator,
} from 'store/actions/application/recommendationActions'
import { setProfile } from 'store/actions/application/profileAction'

export default function ProfilePage({
    profile,
    dialogOpen,
    setDialogOpen,
    activeUserDialog,
}) {
    const [open, setOpen] = useState(false)
    const [imgUpdate, setImgUpdate] = useState(null)
    const [imageData, setImageData] = useState()
    const [imageSubprofile, setImageSubprofile] = useState()
    const [language, setLanguage] = useState()
    const [openDrawer, setOpenDrawer] = useState(false)
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const imageId = profile?.avatar?.split('/')[5]
    const refImage = useRef()
    const { user_id } = parseCookies()
    const { session_id } = parseCookies()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const BASE_URL = `${process.env.BASE_IMAGE_UPLOADER}/uzdigital/images/`
    const handleDrawer = () => {
        setOpenDrawer(true)
    }

    const handleDrawerClose = () => {
        setOpenDrawer(false)
    }

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang)

        axios.put(`/customer/change-lang`, {
            params: {
                customer_id: user_id,
                lang: lang,
            },
        })
    }

    const handleLanguage = () => {
        if (language) {
            if (language.slug === 'ru') {
                changeLanguage('ru')
            } else if (language.slug === 'en') {
                changeLanguage('en')
            } else if (language.slug === 'uz') {
                changeLanguage('uz')
            } else {
                console.log('error')
            }
        } else {
            console.log('the language did not change')
        }
    }

    const customerProfile = () => {
        if (session_id) {
            axios
                .get('/customer/profile')
                .then((response) => {
                    dispatch(setProfile(response?.data?.customer))
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    useEffect(() => {
        customerProfile()
    }, [])

    const changeProfile = (values) => {
        if (!values.userName?.trim()?.length) {
            formik.setFieldValue('userName', '')
            return
        }
        if (values) {
            axios
                .put(`/customer/profile/${user_id}`, {
                    address: 'string',
                    avatar: imageData ? imageData : imageId,
                    birth_day: moment(values.date).format('YYYY-MM-DD'),
                    gender: values.sex,
                    lastname: '',
                    name: values.userName,
                    password: 'string',
                    phone: values.telNumber
                        ? values.telNumber.replace(/ /g, '')
                        : '',
                })
                .then((res) => {
                    dispatch(showAlert(t('profile_alert'), 'success'))
                    setDialogOpen(false)
                    customerProfile()
                })
        }
        if (CurrentUserData?.is_main) {
            axios
                .put(`/profiles/${CurrentUserData?.id}/edit`, {
                    name: values.userName,
                    profile_image: imageData ? imageData : imageId,
                })
                .then((res) => {
                    updateProfilesList()
                    dispatch(setRecommendationValue(res?.data))
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        handleLanguage()
    }

    const updateProfilesList = () => {
        axios
            .get('/profiles', {
                headers: {
                    SessionId: session_id,
                },
            })
            .then((res) => {
                dispatch(setProfilesList(res?.data ? res?.data : null))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const logout = () => {
        axios
            .delete(`/session`, {
                data: { session_id },
            })
            .then((res) => {
                destroyCookie(null, 'megogo_token', {
                    path: '/',
                })
                destroyCookie(null, 'profile_id', {
                    path: '/',
                })
                destroyCookie({}, 'access_token', {
                    path: '/',
                })
                destroyCookie({}, 'session_id', {
                    path: '/',
                })
                destroyCookie({}, 'user_id', {
                    path: '/',
                })
                destroyCookie({}, 'next-i18next', {
                    path: '/',
                })
                dispatch(setProfile(null))
                dispatch(setProfilesList(null))
                dispatch(setRecommendationValue(null))
                dispatch(setRecommendationActivator(false))
                sessionStorage.removeItem('listSelected')
                sessionStorage.removeItem('userActivation')
                window.localStorage.removeItem('idImageUpload')
                Router.push('/')
            })
    }

    useEffect(() => {
        if (imgUpdate) {
            const formdata = new FormData()
            formdata.append('file', imgUpdate)
            axios
                .post('/image-upload', formdata)
                .then(
                    (res) => (
                        setImageData(res?.data?.filename),
                        setImageSubprofile(res?.data?.filename),
                        window.localStorage.setItem(
                            'idImageUpload',
                            res.data.filename,
                        )
                    ),
                )
        }
    }, [imgUpdate])

    const formik = useFormik({
        validationSchema: Yup.object({
            date: Yup.date().max(
                new Date(),
                'Date should not be after maximal date',
            ),
            userName: Yup.string()
                .min(3, t('minimum length is 3 characters'))
                .required(t('required_form')),
        }),
        initialValues: {
            userName: profile?.name,
            telNumber: profile?.phone,
            sex: profile?.gender,
            date: profile?.date_of_birth,
            langueage: i18n.language,
            email: profile?.email,
        },
        onSubmit: (values) => {
            // axios
            //     .get(
            //         `customer/exists?phone=%2B${values.telNumber
            //             .replace(/ /g, '')
            //             .slice(1)}`,
            //     )
            //     .then((res) => {
            //         if (!res.data.exists) {
            changeProfile(values)
            //     } else {
            //         if (
            //             values.telNumber === formik.initialValues.telNumber
            //         ) {
            //             changeProfile(values)
            //         } else {
            //             dispatch(
            //                 showAlert('nomer oldin kiritilgan', 'error'),
            //             )
            //         }
            //     }
            // })
        },
    })

    const dataLanguage = [
        { value: 'Русский', label: 'Русский', slug: 'ru' },
        { value: 'English', label: 'English', slug: 'en' },
        { value: 'O’zbekcha', label: 'O’zbekcha', slug: 'uz' },
    ]
    const dataPol = [
        { value: t('women'), label: t('women'), slug: 'female' },
        { value: t('man'), label: t('man'), slug: 'male' },
    ]

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    return (
        <div className="scroll">
            <Dialog
                id="dialogProfile"
                BackdropProps={{
                    style: { backgroundColor: 'rgba(0,0,0,0.85)' },
                }}
                style={{
                    zIndex: 99999999,
                }}
                open={dialogOpen}
                onClose={handleDialogClose}
                dialogClassName="scroll"
            >
                <div id="profilePage">
                    {activeUserDialog && !activeUserDialog?.is_main ? (
                        <Subprofile
                            setDialogOpen={setDialogOpen}
                            data={activeUserDialog ? activeUserDialog : []}
                        />
                    ) : (
                        <form
                            autoComplete="off"
                            className={`${style.form}`}
                            onSubmit={formik.handleSubmit}
                        >
                            <div
                                className="absolute top-9 right-5 cursor-pointer"
                                onClick={handleDialogClose}
                            >
                                <ArrowBackIcon />
                            </div>
                            <div className="text-center mb-6">
                                {t('edit_profile_photo')}
                            </div>
                            <div className={style.profile_image}>
                                <label
                                    htmlFor="upload-image"
                                    className={style.image_upload}
                                >
                                    <img
                                        ref={refImage}
                                        src={
                                            imageData
                                                ? `${BASE_URL}${imageData}`
                                                : profile?.profile_type ===
                                                      'children' &&
                                                  profile?.profile_image === ''
                                                ? '../vectors/childrenProfile.svg'
                                                : profile?.avatar
                                                ? profile?.avatar
                                                : '../vectors/movie-image-vector.svg'
                                        }
                                        alt="avatar"
                                    />
                                    {!profile?.avatar && (
                                        <div className="absolute bottom-6 right-3">
                                            <ProfileImgChange />
                                        </div>
                                    )}
                                </label>
                                <span className="text-[22px] font-[600]">
                                    {profile?.name}
                                </span>
                                <input
                                    id="upload-image"
                                    accept="image/png, image/jpeg, image/jpg"
                                    type="file"
                                    name="profileImage"
                                    className={`${style.upload_image_input} ${style.form_input}`}
                                    onChange={(e) =>
                                        setImgUpdate(e.target.files[0])
                                    }
                                />
                            </div>
                            <div className={style.inputs}>
                                <label htmlFor="name">{t('full_name')}</label>
                                <InputProfile
                                    id="name"
                                    onChange={formik.handleChange}
                                    className={style.form_input}
                                    name="userName"
                                    type="text"
                                    value={formik.values.userName}
                                    errors={formik.errors.userName}
                                />
                                {profile.email && (
                                    <>
                                        <label htmlFor="email">
                                            {t('email')}
                                        </label>
                                        <InputProfile
                                            id="email"
                                            onChange={formik.handleChange}
                                            className={style.form_input}
                                            name="email"
                                            disabled
                                            type="email"
                                            value={formik.values.email}
                                            errors={formik.errors.email}
                                        />
                                    </>
                                )}
                                {profile?.apple_id ||
                                profile?.facebook_id ||
                                profile?.google_id
                                    ? null
                                    : formik.values.telNumber && (
                                          <div>
                                              <label htmlFor="number">
                                                  {t('tell_number')}
                                              </label>
                                              <InputMask
                                                  name="telNumber"
                                                  className={
                                                      style.form_input_number
                                                  }
                                                  readOnly={true}
                                                  id="number"
                                                  mask={`+\\9\\9\\8 99 999 99 99`}
                                                  maskChar=""
                                                  onChange={formik.handleChange}
                                                  value={
                                                      formik.values.telNumber
                                                  }
                                                  alwaysShowMask
                                                  onClick={() =>
                                                      Router.push(
                                                          '/registration?from=profile',
                                                      )
                                                  }
                                              />
                                          </div>
                                      )}

                                <div className="profile_select">
                                    <label htmlFor="">{t('floor')}</label>
                                    <div className="flex mb-6 space-x-3 items-center">
                                        {dataPol.map((item, i) => (
                                            <div
                                                key={i}
                                                onClick={() =>
                                                    formik.setFieldValue(
                                                        'sex',
                                                        item.slug,
                                                    )
                                                }
                                                className="cursor-pointer border relative py-[14px] px-4 border-none w-full bg-[#111B33] rounded-lg"
                                            >
                                                <p className="text-[17px] font-medium leading-[25px]">
                                                    {item.label}
                                                </p>
                                                {formik.values.sex ===
                                                    item.slug && (
                                                    <span className="absolute top-[50%] transform translate-y-[-50%] right-4">
                                                        <ActiveIcon />
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <DatePickers
                                    label={t('Date_Birth')}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            'date',
                                            moment(value).format('YYYY-MM-DD'),
                                        )
                                    }
                                    name="date"
                                    value={formik.values.date}
                                    className={style.form_input}
                                />
                                <div className="profile_select">
                                    <SelectMenu
                                        placeholder={t('Program_language')}
                                        defaultValue={dataLanguage.find(
                                            (item) =>
                                                item.slug === i18n.language,
                                        )}
                                        isClearable={false}
                                        name="langueage"
                                        label={t('Program_language')}
                                        options={dataLanguage}
                                        onChange={(option) => {
                                            setLanguage(option)
                                        }}
                                        icon={true}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        getOptionValue={(option) =>
                                            option.value
                                        }
                                    />
                                </div>

                                <div
                                    className={style.profileSelectDrawer}
                                    onClick={handleDrawer}
                                >
                                    <div className={style.profileMenu}>
                                        <label htmlFor="">Язык программы</label>
                                        <div className={style.profileInput}>
                                            <div
                                                className={
                                                    style.profileMenuItems
                                                }
                                            >
                                                <RussianIcon />
                                                <div className="ml-[8px]">
                                                    Русский
                                                </div>
                                            </div>
                                            <DropDownIcon />
                                        </div>
                                    </div>
                                </div>
                                <LanguageDrawer
                                    languag={language}
                                    open={openDrawer}
                                    onClose={handleDrawerClose}
                                />
                            </div>
                            <div className={style.profile_btns}>
                                <MainButton
                                    type="submit"
                                    text={t('save')}
                                    additionalClasses={style.addBtn}
                                />
                                <MainButton
                                    onClick={() => {
                                        setOpen(true)
                                    }}
                                    text={t('logout')}
                                    additionalClasses={`${style.backBtn}`}
                                />
                            </div>
                        </form>
                    )}
                    {open && (
                        <InfoModal
                            open={open}
                            icon={<LogoutIcon />}
                            mainButton={t('logout')}
                            bgColorMain="bg-[#383641]"
                            bgColorCencel="bg-[#E1DAE01]"
                            textColorMain="text-[#fff]"
                            setOpen={setOpen}
                            title={t('logout_title')}
                            text={t('logout_text')}
                            onClick={() => {
                                logout()
                            }}
                        />
                    )}
                </div>
            </Dialog>
        </div>
    )
}
