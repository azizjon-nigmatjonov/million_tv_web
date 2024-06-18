import MainButton from 'components/button/MainButton'
import React from 'react'
import cls from './error.module.scss'

export default function NullData({ title, text, textButton, icon, link }) {
    return (
        <div className={`${cls.null_data_movies}`}>
            <span>{icon}</span>
            <h2 className="mt-3" style={{ fontSize: '20px' }}>
                {title}
            </h2>
            <p className="text-[#8B97B0]">{text}</p>
            {textButton && (
                <MainButton
                    onClick={link}
                    text={textButton}
                    additionalClasses={`w-full ${cls.btn}`}
                />
            )}
        </div>
    )
}
