import MainButton from 'components/button/MainButton'
import { NullMovieIcon } from 'components/svg'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'i18n'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import cls from './error.module.scss'
import DeviceDetector from 'device-detector-js'
import { Router } from 'i18n'

export default function ErrorPopup({ openModal, setOpenModal, data }) {
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const { t } = useTranslation()
    const router = useRouter()
    const closeModal = () => {
        if (device.os.name === 'iOS') {
            setOpenModal(false)
            return
        }
        Router.push(
            data?.file_info?.is_megogo
                ? `/movie/${router.query.id}?type=megogo`
                : data?.file_info?.is_premier
                ? `/movie/${router.query.id}?type=premier`
                : router?.query?.key
                ? `/movie/${router.query.key}`
                : router.asPath,
        )
        setOpenModal(false)
    }
    return (
        <div className="error-popup">
            <Popup
                open={openModal}
                closeOnDocumentClick={openModal}
                // onClose={false}
            >
                <div className={cls.modal}>
                    <NullMovieIcon />
                    <h2>{t('page_not_found_title')}</h2>
                    <p>{t('page_not_found_text')}</p>
                    <div className="w-full block mt-8 md:flex md:justify-center">
                        <MainButton
                            onClick={closeModal}
                            text={t('back')}
                            additionalClasses={`w-full font-semibold md:mt-0 bg-mainColor lg:w-[300px] rounded-[8px] bgHoverBlue text-white`}
                        />
                    </div>
                </div>
            </Popup>
        </div>
    )
}
