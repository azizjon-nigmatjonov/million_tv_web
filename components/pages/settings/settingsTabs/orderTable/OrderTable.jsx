import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import style from './orderTable.module.scss'
import {
    DeleteIconTable,
    TableCloseIcon,
    NullDataIconTable,
} from '../../../../svg'
import Modal from '@mui/material/Modal'
import { Formik, Form, Field } from 'formik'
import axios from '../../../../../utils/axios'
import { parseCookies } from 'nookies'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { showAlert } from 'store/reducers/alertReducer'
import { useTranslation } from 'i18n'
import NullData from 'components/errorPopup/NullData'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

const SignupSchema = Yup.object().shape({
    filmName: Yup.string()
        .min(2, 'Too Short!')
        .max(70, 'Too Long!')
        .required('Required'),
})

const OrderTable = () => {
    const { profile_id, user_id } = parseCookies()
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [response, setResponse] = useState([])
    const dispatch = useDispatch()
    const [postResponse, setPostResponse] = useState({})
    const [checked, setChecked] = useState([])
    const [openDelete, setOpenDelete] = useState(false)
    const { t } = useTranslation()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const [windowWidth] = useWindowSize()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const getOrderTable = () => {
        axios
            .get(
                `/order/get-order/${
                    CurrentUserData?.id
                        ? CurrentUserData?.id
                        : profile_id
                        ? profile_id
                        : ''
                }`,
            )
            .then((res) => {
                if (res) {
                    setResponse(res.data.response)
                }
            })
            .catch((err) => console.log('err', err))
    }

    const deleteOrderTable = (id) => {
        axios
            .delete(`/order/delete-order/${id}`)
            .then((res) => {
                getOrderTable()
            })
            .catch((err) => console.log('err', err))
            .finally(() => {
                dispatch(showAlert(t('deleted-successfully'), 'success'))
            })
    }
    useEffect(() => {
        getOrderTable()
    }, [postResponse])

    const deleteOrderTableMobile = () => {
        for (let index = 0; index < checked.length; index++) {
            const element = checked[index]
            if (element) {
                axios
                    .delete(`/order/delete-order/${element}`)
                    .then((res) => {
                        getOrderTable()
                    })
                    .catch((err) => console.log('err', err))
            }
            dispatch(showAlert(t('deleted-successfully'), 'success'))
        }
    }

    const handleChange = (isChecked) => {
        if (isChecked) return setChecked(response.map((res) => res.id))
        else setChecked([])
    }

    const handleChange1 = (isChecked, id) => {
        const index = checked.indexOf(id)

        if (isChecked) return setChecked((state) => [...state, id])

        if (!isChecked && index > -1)
            return setChecked((state) => {
                state.splice(index, 1)
                return JSON.parse(JSON.stringify(state)) // Here's the trick => React does not update the f* state array changes even with the spread operator, the reference is still the same.
            })
    }

    const styleMui = {
        position: 'absolute',
        top: windowWidth[0] > 1150 ? '50%' : '',
        bottom: windowWidth[0] > 1150 ? '' : '0',
        left: '50%',
        transform:
            windowWidth[0] > 1150
                ? 'translate(-50%, -50%)'
                : 'translate(-50%, 0%)',
        boxShadow: 24,
        p: 4,
        width: windowWidth[0] > 1150 ? '432px' : '100%',
        height: windowWidth[0] > 1150 ? '425px' : '82%',
        padding: windowWidth[0] > 1150 ? '32px' : '16px',
        background: windowWidth[0] > 1150 ? '#111B33' : '#010614',
        borderRadius: '12px',
        border: 'none',
        outline: 'none',
    }

    return (
        <>
            <div className="w-full relative">
                {response.length > 0 ? (
                    windowWidth[0] > 1150 ? (
                        <div>
                            <div className={style.tableButton}>
                                <Button
                                    variant="contained"
                                    onClick={handleOpen}
                                >
                                    {t('order-movie')}
                                </Button>
                            </div>
                            <div className={style.wrapperOrderTable}>
                                <div className={style.tableTitle}>
                                    <div>
                                        <h5>{t('movie-title')}</h5>
                                    </div>
                                    <div className={style.tableTime}>
                                        <h5>{t('order-date')}</h5>
                                    </div>
                                    <div className={style.tableStatus}>
                                        <h5>{t('status')}</h5>
                                    </div>
                                    <div className={style.tableComment}>
                                        <h5>{t('comment')}</h5>
                                    </div>
                                    <div className={style.lastDiv}>
                                        <h5></h5>
                                    </div>
                                </div>
                                <div>
                                    {response.map((item) => {
                                        const create_time = format(
                                            new Date(item.created_at),
                                            'dd.MM.yyyy',
                                        )
                                        return (
                                            <div
                                                className={`${
                                                    style.tableBody
                                                } ${
                                                    item.id !==
                                                    response[
                                                        response.length - 1
                                                    ].id
                                                        ? 'border-b-[0.5px] border-gray-500'
                                                        : ''
                                                }`}
                                                key={item.title}
                                            >
                                                <div
                                                    className={`${
                                                        style.firstDiv
                                                    } ${
                                                        item?.img
                                                            ? ''
                                                            : 'items-center'
                                                    }`}
                                                >
                                                    {item?.img ? (
                                                        <img
                                                            src={item.img}
                                                            alt={item.title}
                                                        />
                                                    ) : null}

                                                    <h4>{item.title}</h4>
                                                </div>
                                                <div
                                                    className={style.tableTime}
                                                >
                                                    {create_time}
                                                </div>
                                                <div
                                                    className={
                                                        style.tableStatus
                                                    }
                                                >
                                                    {item.status ===
                                                    'rejected' ? (
                                                        <span className="text-[#F2271C]">
                                                            {t('denied')}
                                                        </span>
                                                    ) : item.status ===
                                                      'in-process' ? (
                                                        <span className="text-[#F8DD4E]">
                                                            {t('queue')}
                                                        </span>
                                                    ) : item.status ===
                                                      'uploaded' ? (
                                                        <span className="text-[#1BA129]">
                                                            {t('added')}
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                                <div
                                                    className={
                                                        style.tableComment
                                                    }
                                                >
                                                    {item.comment ? (
                                                        <h6>{item.comment}</h6>
                                                    ) : (
                                                        <span className="text-center w-full">
                                                            ---
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={style.lastDiv}>
                                                    <Button
                                                        sx={{
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            width: '70px',
                                                            height: '70px',
                                                            justifyContent:
                                                                'center',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                        onClick={() =>
                                                            deleteOrderTable(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        <DeleteIconTable />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className={style.tableDeleteButton}>
                                <Button
                                    sx={{
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onClick={() =>
                                        setOpenDelete((prev) => !prev)
                                    }
                                >
                                    {openDelete ? (
                                        <TableCloseIcon
                                            width="20"
                                            height="21"
                                        />
                                    ) : (
                                        <DeleteIconTable fill="#ffffff" />
                                    )}
                                </Button>
                            </div>
                            <div className={style.tableMobileButton}>
                                <Button
                                    variant="contained"
                                    onClick={handleOpen}
                                >
                                    {t('order-movie')}
                                </Button>
                            </div>
                            <div className={style.tableMobileDeleteButton}>
                                <Button
                                    variant="contained"
                                    onClick={deleteOrderTableMobile}
                                >
                                    {t('deleteSelects')}
                                </Button>
                            </div>
                            {openDelete ? (
                                <div>
                                    <FormControlLabel
                                        label="выбрать все"
                                        control={
                                            <Checkbox
                                                checked={
                                                    checked.length ===
                                                    response.length
                                                }
                                                indeterminate={
                                                    checked.length !==
                                                        response.length &&
                                                    checked.length > 0
                                                }
                                                onChange={(event) =>
                                                    handleChange(
                                                        event.target.checked,
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </div>
                            ) : null}

                            {response.map((item, ind) => {
                                const create_time = format(
                                    new Date(item.created_at),
                                    'dd.MM.yyyy',
                                )
                                return (
                                    <div
                                        className={style.mobileWrapperTable}
                                        key={item.id}
                                    >
                                        {openDelete ? (
                                            <div
                                                className={style.tableCheckBox}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        ml: 3,
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={checked.includes(
                                                                    item.id,
                                                                )}
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    handleChange1(
                                                                        event
                                                                            .target
                                                                            .checked,
                                                                        item.id,
                                                                    )
                                                                }
                                                            />
                                                        }
                                                    />
                                                </Box>
                                            </div>
                                        ) : null}

                                        <div className={style.mobileTableAll}>
                                            <div
                                                className={`${style.mobileTable} border-b-[0.5px] border-gray-500`}
                                            >
                                                <div>
                                                    <h5>{t('movie-title')}</h5>
                                                </div>
                                                <div>
                                                    <h5>{item.title}</h5>
                                                </div>
                                            </div>
                                            <div
                                                className={`${style.mobileTable} border-b-[0.5px] border-gray-500`}
                                            >
                                                <div>
                                                    <h5>{t('order-date')}</h5>
                                                </div>
                                                <div>
                                                    <h5>{create_time}</h5>
                                                </div>
                                            </div>
                                            <div className={style.mobileTable}>
                                                <div>
                                                    <h5>{t('status')}</h5>
                                                </div>
                                                <div>
                                                    <h5>
                                                        {item.status ===
                                                        'rejected' ? (
                                                            <span className="text-[#F2271C]">
                                                                {t('denied')}
                                                            </span>
                                                        ) : item.status ===
                                                          'in-process' ? (
                                                            <span className="text-[#F8DD4E]">
                                                                {t('queue')}
                                                            </span>
                                                        ) : item.status ===
                                                          'uploaded' ? (
                                                            <span className="text-[#1BA129]">
                                                                {t('added')}
                                                            </span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                ) : (
                    <div className="my-5 flex justify-center md:my-10 w-[70%] mx-auto">
                        <NullData
                            icon={<NullDataIconTable />}
                            title={t('oops')}
                            text={t('no-ordered_films')}
                            textButton={t('order-movie')}
                            link={handleOpen}
                        />
                    </div>
                )}
            </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    keepMounted
                >
                    <div style={styleMui}>
                        <div className={style.tableModal}>
                            {windowWidth[0] > 1150 ? (
                                <div
                                    className="absolute right-[37px] top-[37px] cursor-pointer"
                                    onClick={handleClose}
                                >
                                    <TableCloseIcon />
                                </div>
                            ) : null}

                            <div className="mt-1 lg:mt-7">
                                <h1 className="leading-[35px] text-[28px] font-[600] text-white mb-[32px]">
                                    {t('order-movie')}
                                </h1>
                                <Formik
                                    initialValues={{
                                        filmName: '',
                                        filmLink: '',
                                    }}
                                    validationSchema={SignupSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        if (user_id) {
                                            axios
                                                .post(
                                                    `/order/order-movie-create?link=${
                                                        values.filmLink
                                                    }&profile_id=${
                                                        CurrentUserData?.id
                                                            ? CurrentUserData?.id
                                                            : profile_id
                                                            ? profile_id
                                                            : ''
                                                    }&title=${
                                                        values.filmName
                                                    }&user_id=${user_id}`,
                                                )
                                                .then((res) => {
                                                    setPostResponse(res.data)
                                                    dispatch(
                                                        showAlert(
                                                            t('reviewed-order'),
                                                            'success',
                                                        ),
                                                    )
                                                })
                                                .catch(() =>
                                                    dispatch(
                                                        showAlert(
                                                            t('error'),
                                                            'error',
                                                        ),
                                                    ),
                                                )
                                                .finally(() => {
                                                    handleClose()
                                                })
                                        }
                                        resetForm({ values: '' })
                                    }}
                                >
                                    {({
                                        isSubmitting,
                                        errors,
                                        touched,
                                        values,
                                    }) => {
                                        return (
                                            <Form className="flex item-center justify-center flex-col">
                                                <div className="flex item-center justify-center flex-col">
                                                    <label
                                                        className={
                                                            style.formLabel
                                                        }
                                                    >
                                                        {t('enter-movie_name')}
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="filmName"
                                                        placeholder={t('enter')}
                                                        value={values.filmName}
                                                        className={
                                                            style.tableInput
                                                        }
                                                        style={{
                                                            border:
                                                                errors.filmName &&
                                                                touched.filmName
                                                                    ? '1px solid red'
                                                                    : '',
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex item-center justify-center flex-col">
                                                    <label
                                                        className={
                                                            style.formLabel
                                                        }
                                                    >
                                                        {t('add-link')}
                                                    </label>
                                                    <Field
                                                        type="url"
                                                        name="filmLink"
                                                        placeholder={t('enter')}
                                                        value={values.filmLink}
                                                        className={
                                                            style.tableInput
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        style.tableSubmitButton
                                                    }
                                                >
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={isSubmitting}
                                                    >
                                                        {t('order')}
                                                    </Button>
                                                </div>
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default OrderTable
