import MainButton from 'components/button/MainButton'
import { NullMovieIcon } from 'components/svg'
import router from 'next/router'
import React from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import cls from './error.module.scss'

export default function ErrorPopup({
    openModal,
    setOpenModal,
    title,
    text,
    link,
    textButton,
    icon,
}) {
    // const closeModal = () => setOpenModal(true)
    return (
        <>
            <Popup open={openModal}>
                <div className={cls.modal}>
                    {icon}
                    <h2>{title}</h2>
                    <p>{text}</p>
                    <div className="w-full block mt-8 md:flex md:justify-center">
                        <MainButton
                            onClick={link}
                            text={textButton}
                            additionalClasses={`w-full mr-[0px] md:mr-3 md:w-[200px] rounded-[8px] ${cls.popup_btn}`}
                        />
                    </div>
                </div>
            </Popup>
        </>
    )
}
