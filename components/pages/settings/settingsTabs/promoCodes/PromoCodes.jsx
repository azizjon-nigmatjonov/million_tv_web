import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import style from '../orderTable/orderTable.module.scss'
import { TableCloseIcon, NullDataIconTable } from '../../../../svg'
import Modal from '@mui/material/Modal'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'i18n'
import NullData from 'components/errorPopup/NullData'
import { PromoCodeIcon } from '../../menuIcons'
import axios from 'utils/axios'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'
import CInput from 'components/CElements/CInput'

const SignupSchema = Yup.object().shape({
    promoCode: Yup.string()
        .min(2, 'Too Short!')
        .max(70, 'Too Long!')
        .required('Required'),
})

const styleMui = (windowWidth) => ({
    position: 'absolute',
    top: windowWidth[0] > 1150 ? '50%' : '',
    left: '50%',
    bottom: windowWidth[0] > 1150 ? '' : '0',
    transform:
        windowWidth[0] > 1150 ? 'translate(-50%, -50%)' : 'translate(-50%, 0%)',
    boxShadow: 24,
    p: 4,
    width: windowWidth[0] > 576 ? '432px' : '100%',
    height: windowWidth[0] > 576 ? '329px' : '82%',
    padding: windowWidth[0] > 576 ? '32px' : '40px 16px 16px 16px',
    background: windowWidth[0] > 1150 ? '#111B33' : '#010614',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
})

const PromoCodes = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [error, serError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [promoCodes, setPromoCodes] = useState([])
    const { t } = useTranslation()
    const { user_id } = parseCookies()
    const [activate, setActivate] = useState(false)

    const [windowWidth] = useWindowSize()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    useEffect(() => {
        if (!open) {
            serError(false)
        }
    }, [open])

    const getPromoCode = (id) => {
        axios.get(`get-user-promo-code/${id}`).then((res) => {
            setPromoCodes(res.data.result)
        })
    }

    useEffect(() => {
        if (user_id) {
            getPromoCode(user_id)
        }
    }, [user_id])

    const ActivePromoCod = (values) => {
        if (user_id) {
            axios
                .post(`create-user-promo-code/${user_id}`, {
                    title: values.promoCode,
                })
                .then((res) => {
                    if (res.data) {
                        getPromoCode(user_id)
                        setOpen(false)
                    }
                    setActivate(false)
                })
                .catch((err) => {
                    serError(true)
                    setErrorMessage(err.data.data)
                    getPromoCode(user_id)
                })
        }
    }

    return (
        <>
            {promoCodes?.length && !activate ? (
                <div className={style.promocodeWrapper}>
                    {promoCodes.map((element, index) => (
                        <ul key={index} className={style.list}>
                            <li className={style.item}>
                                <p className={style.title}>
                                    {t('promo-code_login')}
                                </p>
                                <p className={style.text}>{element.title}</p>
                            </li>
                            <li className={style.item}>
                                <p className={style.title}>{t('status')}</p>
                                <p
                                    className={style.text}
                                    style={{ color: '#24A148' }}
                                >
                                    {t(element.status?.toLowerCase())}
                                </p>
                            </li>
                            <li className={style.item}>
                                <p className={style.title}>
                                    {t('descriptionPromo')}
                                </p>
                                <p className={style.text}>
                                    {element.description}
                                </p>
                            </li>
                            <li className={style.item}>
                                <p className={style.title}>
                                    {t('activation_date')}
                                </p>
                                <p className={style.text}>
                                    {format(
                                        new Date(element?.started_time),
                                        'dd.MM.yyyy',
                                    )}
                                </p>
                            </li>
                            <li className={style.item}>
                                <p className={style.title}>
                                    {t('shutdown_date')}
                                </p>
                                <p className={style.text}>
                                    {format(
                                        new Date(element?.end_time),
                                        'dd.MM.yyyy',
                                    )}
                                </p>
                            </li>
                        </ul>
                    ))}
                    <div>
                        <button
                            onClick={() => setActivate(true)}
                            type="button"
                            className={style.addPromocodeBtn}
                        >
                            <div className="mr-2">
                                <PromoCodeIcon />
                            </div>
                            {t('activate-promo_code')}
                        </button>
                    </div>
                </div>
            ) : (
                ''
            )}

            {activate || !promoCodes?.length ? (
                <div className="w-[600px]">
                    <h1 className="text-2xl font-bold mb-3">
                        {t('activate-promo2')}
                    </h1>
                    <Formik
                        initialValues={{
                            promoCode: '',
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values, { resetForm }) => {
                            ActivePromoCod(values)
                            resetForm({ values: '' })
                        }}
                    >
                        {({ errors, touched, values }) => {
                            return (
                                <Form className="flex item-center justify-center flex-col">
                                    <div className="flex item-center justify-center flex-col relative">
                                        <Field
                                            type="text"
                                            name="promoCode"
                                            placeholder={t('enter-promo')}
                                            value={values.promoCode}
                                            className={style.tableInput}
                                            style={{
                                                border:
                                                    (errors.promoCode &&
                                                        touched.promoCode) ||
                                                    error
                                                        ? '1px solid #D31919'
                                                        : '',
                                            }}
                                        />
                                        {error &&
                                        errorMessage ===
                                            ' PromoCode not found' ? (
                                            <span className="text-[#D31919] absolute top-14">
                                                {t('promoCodeNotFound')}
                                            </span>
                                        ) : error &&
                                          errorMessage ===
                                              ' Promcode is already exists' ? (
                                            <span className="text-[#D31919] absolute top-14">
                                                {t('promoCodeAlreadyUse')}
                                            </span>
                                        ) : null}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={values.promoCode?.length < 1}
                                        className={`${style.buttonsubmit} ${
                                            values.promoCode?.length < 1
                                                ? style.disable
                                                : ''
                                        }`}
                                    >
                                        {t('activate')}
                                    </button>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            ) : (
                ''
            )}
        </>
    )
}

export default PromoCodes
