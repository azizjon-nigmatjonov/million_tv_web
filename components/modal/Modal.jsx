import { AttentionIcon, PaymeIcon, RemoveIcon } from 'components/svg'
import React, { useState } from 'react'
import cls from './Modal.module.scss'
import axios from '../../utils/axios'
import router from 'next/router'

export default function Modal({ setShowModal, purchaseId, el, setTvotModal }) {
    const requestToPayMe = () => {
        axios
            .post(`/payme-link`, {
                amount: el.pricing.substracted_price,
                episode_number: 0,
                is_serial: el?.is_serial,
                lang: 'ru',
                movie_slug: el.slug,
                purchase_id: purchaseId,
                season_number: 0,
                url: process.env.BASE_DOMAIN + router.asPath,
            })
            .then((res) => window.location.replace(res.data.link))
        // .catch((err) => console.log(err))
    }

    return (
        <>
            <div
                className={cls.modal}
                onClick={(e) => {
                    e.target.classList.contains(`${cls.modal}`)
                        ? setShowModal(false)
                        : null
                }}
            >
                <div className={`${cls.modal_content} ${cls.bounceIn}`}>
                    <div
                        className={cls.remove_icon}
                        onClick={() => {
                            setShowModal(false)
                            setTvotModal(false)
                        }}
                    >
                        <RemoveIcon />
                    </div>
                    <div className={cls.icon_attention}>
                        <AttentionIcon />
                    </div>
                    <h2 className={cls.modal_title}>Внимание</h2>
                    <p className={cls.modal_text}>
                        Чтобы посмотреть фильм вам нужно оплатить
                        <span> {el.pricing?.substracted_price / 100} сум</span>.
                        Для этого пожалуйсте, выберите тип оплаты
                    </p>
                    <div className={cls.modal_btns}>
                        <button
                            className={cls.remove_btn}
                            onClick={() => {
                                requestToPayMe()
                                setShowModal(false)
                            }}
                        >
                            <img src="../vectors/payme.svg" alt="payme" />
                        </button>
                        <button
                            onClick={() => {
                                setShowModal(false)
                            }}
                            className={cls.add_btn}
                        >
                            <img src="../vectors/click.svg" alt="payme" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
