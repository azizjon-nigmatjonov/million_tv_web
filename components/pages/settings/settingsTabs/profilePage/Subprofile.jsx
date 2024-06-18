import React, { useState, useEffect, useRef } from 'react'
import style from '../../Settings.module.scss'
import InputProfile from './InputProfile'
import MainButton from 'components/button/MainButton'
import { useTranslation } from 'i18n'
import * as Yup from 'yup'
import axios from '../../../../../utils/axios'
import { useFormik } from 'formik'
import { setRecommendationValue } from 'store/actions/application/recommendationActions'
import { useDispatch } from 'react-redux'
import { setProfilesList } from 'store/actions/application/profilesAction'
import { parseCookies } from 'nookies'
import { showAlert } from 'store/reducers/alertReducer'
import { ProfileImgChange, ArrowBackIcon } from 'components/svg'

export default function Subprofile({ data, setDialogOpen }) {
    const { t } = useTranslation()
    const { session_id } = parseCookies()
    const dispatch = useDispatch()
    const BASE_URL = `${process.env.BASE_IMAGE_UPLOADER}/uzdigital/images/`

    const refImage = useRef()
    const [imgUpdate, setImgUpdate] = useState(null)
    const [imageData, setImageData] = useState()
    const imageId = data?.profile_image?.split('/')[5]

    const formik = useFormik({
        validationSchema: Yup.object({
            userName: Yup.string()
                .min(3, t('minimum length is 3 characters'))
                .required(t('required_form')),
        }),
        initialValues: {
            userName: data?.name,
            userImage: data?.profile_image,
        },
        onSubmit: (values) => {
            changeProfile(values)
        },
    })

    useEffect(() => {
        if (imgUpdate) {
            const formdata = new FormData()
            formdata.append('file', imgUpdate)
            axios
                .post('/image-upload', formdata)
                .then(
                    (res) => (
                        setImageData(res?.data?.filename),
                        window.localStorage.setItem(
                            'idImageUpload',
                            res.data.filename,
                        )
                    ),
                )
        }
    }, [imgUpdate])

    useEffect(() => {
        formik.setFieldValue('userName', data?.name)
    }, [data])

    const changeProfile = (values) => {
        if (!values.userName?.trim()?.length) {
            formik.setFieldValue('userName', '')
            return
        }
        dispatch(showAlert(t('profile_alert'), 'success'))
        if (values) {
            axios
                .put(`/profiles/${data?.id}/edit`, {
                    name: values.userName,
                    profile_image: imageData ? imageData : imageId,
                })
                .then((res) => {
                    formik.setFieldValue('userName', res?.data?.name)
                    formik.setFieldValue('userImage', res?.data?.profile_image)
                    dispatch(setRecommendationValue(res?.data))
                    updateProfilesList()
                    setDialogOpen(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const DeleteUser = (ID) => {
        axios
            .delete(`/profiles/${ID}/delete`)
            .then((res) => {
                updateProfilesList()
                dispatch(setRecommendationValue(null))
                setDialogOpen(false)
                dispatch(showAlert(t('profile_alert_delete'), 'success'))
            })
            .catch((err) => {
                console.log(err)
            })
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

    return (
        <>
            <div>
                <form
                    onSubmit={formik.handleSubmit}
                    className={style.form}
                    autoComplete="off"
                >
                    <div
                        className="absolute top-8 right-5 cursor-pointer"
                        onClick={() => setDialogOpen(false)}
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
                                        : data?.profile_type === 'children' &&
                                          data?.profile_image === ''
                                        ? '../vectors/childrenProfile.svg'
                                        : data?.profile_image
                                        ? data?.profile_image
                                        : '../vectors/movie-image-vector-user.svg'
                                }
                                alt="avatar"
                            />
                            {!data?.profile_image && (
                                <div className="absolute bottom-5 right-3">
                                    <ProfileImgChange />
                                </div>
                            )}
                        </label>
                        <span className="text-[22px] font-[600]">
                            {data?.name}
                        </span>
                        <input
                            id="upload-image"
                            accept="image/png, image/jpeg, image/jpg"
                            type="file"
                            name="profileImage"
                            className={`${style.upload_image_input} ${style.form_input}`}
                            onChange={(e) => setImgUpdate(e.target.files[0])}
                        />
                    </div>
                    <div className={style.inputs}>
                        <label htmlFor="name">{t('full_name')}</label>
                        <InputProfile
                            onChange={formik.handleChange}
                            className={style.form_input}
                            name="userName"
                            type="text"
                            value={formik.values.userName}
                            errors={formik.errors.userName}
                        />
                    </div>
                    <div className="mt-[24px] flex items-center flex-col-reverse md:flex-row md:space-x-[12px]">
                        <MainButton
                            type="submit"
                            text={t('save')}
                            additionalClasses="bg-[#03A9F4] bgHoverBlue rounded-[8px] text-[#fff] font-[600] text-[15px] leading-5 mt-[12px] md:mt-0"
                        />
                        <MainButton
                            onClick={() => DeleteUser(data?.id)}
                            text={t('delete_account')}
                            additionalClasses="bg-[#333041] bgHoverGrey rounded-[8px] font-[600] leading-5 text-[15px]"
                        />
                    </div>
                </form>
            </div>
        </>
    )
}
