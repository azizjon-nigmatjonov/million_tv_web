import React from 'react'
import cls from './error.module.scss'
import MainButton from 'components/button/MainButton'
import { NoMoviesCardIcon } from '../svg'

function NoBoughtMovies({ title, subtitle, link, text }) {
    return (
        <div className={cls.noMovies_content}>
            <NoMoviesCardIcon />
            <h2 className={cls.noMovies_title}>{title}</h2>
            <p className={cls.noMovies_subtitle}>{subtitle}</p>
            <MainButton
                onClick={link}
                additionalClasses="inline-flex w-auto h-[54px] rounded-[12px] bg-[#03A9F4] bgHoverBlue text-[17px] leading-[22px] font-semibold"
                text={text}
            />
        </div>
    )
}

export default NoBoughtMovies
