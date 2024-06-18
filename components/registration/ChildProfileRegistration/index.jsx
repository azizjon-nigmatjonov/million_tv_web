import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { CancelIcon } from '../../svg.js'
import { useTranslation } from 'i18n'
import axios from '../../../utils/axios'
import { useDispatch } from 'react-redux'
import { setRecommendationValue } from 'store/actions/application/recommendationActions'
import Modal from '@mui/material/Modal'
import cls from './style.module.scss'
import MainButton from 'components/button/MainButton.jsx'
import CRSwitch from 'components/CElements/CRSwitch'
import MoviesFilterSelect from 'components/pages/movies/Filters/Select/index.jsx'
import Collapse from '@mui/material/Collapse'
import CLabel from 'components/CElements/CLabel/index.jsx'
import CInput from 'components/CElements/CInput/index.jsx'
import { setGlobalModalData } from 'store/actions/application/websiteAction.js'
import { useRouter } from 'next/router.js'

const ChildProfileRegistration = ({ childrenName, setStep }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [childActive, setChildActive] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const [curentAge, setCurrentAge] = useState({ title: '0+', value: 0 })

    function handleClose() {
        dispatch(
            setGlobalModalData({
                type: '',
            }),
        )
    }

    const formik = useFormik({
        validationSchema: Yup.object({
            user_name: Yup.string()
                .min(3, t('min_3'))
                .required(t('required.field.error')),
        }),
        initialValues: {
            user_name: '',
            user_age: '',
        },

        onSubmit: (values) => {
            if (!formik.errors.user_age && !formik.errors.user_name) {
                axios
                    .post('/profile', {
                        name: values.user_name,
                        profile_age: values.user_age
                            ? parseInt(values.user_age)
                            : 0,
                        profile_type: childActive ? 'children' : 'adult',
                    })
                    .then((res) => {
                        if (!res) return
                        if (childActive) {
                            dispatch(setRecommendationValue(res?.data))
                            router.push(`/`)
                        } else {
                            router.push(
                                `/profile-settings?id=${res?.data?.id}${
                                    router?.query?.movie
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
                                    router?.query?.serial ? `&serial=true` : ''
                                }`,
                            )
                        }
                        handleClose()
                    })
            }
        },
    })

    const AgeList = useMemo(() => {
        return [
            {
                title: '0+',
                value: 0,
            },
            {
                title: '3+',
                value: 3,
            },
            {
                title: '9+',
                value: 9,
            },
            {
                title: '12+',
                value: 12,
            },
        ]
    }, [])

    return (
        <Modal
            open={true}
            onClose={() => {}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            keepMounted
        >
            <div className={cls.wrapper}>
                <form autoComplete="off" onSubmit={formik.handleSubmit}>
                    <div className="relative">
                        <button
                            className={cls.cancel}
                            onClick={() => handleClose()}
                        >
                            <CancelIcon fill="#8B97B0" width={10} />
                        </button>
                        <h1 className={cls.title}>{t('add_new_profile')}</h1>

                        <div className="mt-6">
                            <CInput
                                label="Введите имя"
                                placeholder="Введите имя"
                                name="user_name"
                                setValue={formik.setFieldValue}
                            />
                            {/* <TextInput
                            handleChange={(e) =>
                                formik.setFieldValue(
                                    'user_name',
                                    e.target.value,
                                )
                            }
                 
                            className={cls.input}
                        /> */}
                        </div>
                        <div className={cls.switch}>
                            <CRSwitch
                                checked={childActive}
                                onChange={(e) => {
                                    setChildActive(e ? e : false)
                                }}
                            />
                            <div>
                                {t('child profile')}
                                <p className={cls.text}>{t('checkbox info')}</p>
                            </div>
                        </div>
                        <Collapse in={childActive} timeout="auto" unmountOnExit>
                            <div className="mt-6">
                                <CLabel title="age" />
                                <MoviesFilterSelect
                                    list={AgeList}
                                    title={curentAge.title}
                                    isOpen={isOpen}
                                    handleClick={(e) =>
                                        setIsOpen((prev) => !prev)
                                    }
                                    multiple={true}
                                    width={'100%'}
                                    leftWidth={'100%'}
                                    height={180}
                                    columns={1}
                                    passRouter={false}
                                    handleSelect={(element) => {
                                        setIsOpen(false)
                                        setCurrentAge(element)
                                        formik.setFieldValue(
                                            'user_age',
                                            element.value,
                                        )
                                    }}
                                />
                            </div>
                        </Collapse>
                        <div className="flex items-center gap-3 mt-6">
                            <MainButton
                                onClick={() => handleClose()}
                                text={t('cancel')}
                                additionalClasses={`flex bg-mainColor font-semibold rounded-[8px]`}
                            />
                            <MainButton
                                text={t('save')}
                                type="submit"
                                additionalClasses={`flex text-white bg-[#03A9F4] bgHoverBlue font-semibold rounded-[8px]`}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default ChildProfileRegistration
