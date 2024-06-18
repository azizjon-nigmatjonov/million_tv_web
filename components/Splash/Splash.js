import { LogoIcon, MillionTvIcon } from 'components/svg'
import React from 'react'
import cls from './Splash.module.scss'

export default function Splash() {
    return (
        <>
            <div className={cls.container}>
                <MillionTvIcon />
            </div>
        </>
    )
}
