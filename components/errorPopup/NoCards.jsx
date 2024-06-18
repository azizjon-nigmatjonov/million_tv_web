import MainButton from 'components/button/MainButton'
import React from 'react'
import cls from './error.module.scss'

function NoCards({ icon, title, text, button }) {
    return (
        <div className={cls.no_cards_content}>
            {icon && (
                <span className="w-[96px] h-[96px] flex items-center justify-center bg-mainColor rounded-full">
                    {icon}
                </span>
            )}
            <h2>{title}</h2>
            <p>{text}</p>
            {button && (
                <MainButton
                    onClick={button.onClick}
                    additionalClasses="bg-mainColor bgHoverBlue w-auto text-[17px] leading-[22px] h-[52px] text-center text-white mt-8"
                    text={button.text}
                />
            )}
        </div>
    )
}

export default NoCards
