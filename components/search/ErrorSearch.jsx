import React, { useRef } from 'react'
import { useTranslation } from 'i18n'
import cls from './SearchStyle.module.scss'
import { NullDataSearchIcon } from '../../components/svg'
import MainButton from '../../components/button/MainButton'
import { Router } from 'i18n'
import { useDispatch } from 'react-redux'
import {
    setSearchAction,
    setSearchValue,
} from '../../store/actions/application/searchAction'
export default function ErrorSearch() {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    return (
        <div className={`${cls.error} text-center flex flex-col items-center`}>
            <NullDataSearchIcon />
            <p
                className={`text-xl text-white text-opacity-[0.6] mx-auto md:w-[480px] mt-4 ${cls.nullDataText}`}
            >
                {t('search_null_subtitle')}
            </p>

            {/* <button
                onClick={() => {
                    dispatch(setSearchAction(false))
                    dispatch(setSearchValue(''))
                    // Router.push('/')
                }}
                className="bg-[#03A9F4] text-[17px] leading-[22px] font-medium w-[207px] h-[54px] text-white rounded-[12px] mt-[22px]"
            >
                {t('back')}
            </button> */}
        </div>
    )
}
