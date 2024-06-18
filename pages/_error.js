import React from 'react'
import MainButton from 'components/button/MainButton'
import SEO from 'components/SEO'
import router from 'next/router'
import { useTranslation } from 'i18n'
import { MillionTvIcon } from '../components/svg'

export default function Error() {
    const { t } = useTranslation()
    return (
        <>
            <SEO />
            <div className="fixed top-0 left-0 z-[99999] w-full h-[100vh]">
                <img
                    className="absolute w-full h-[100vh] object-cover"
                    src="../images/error_image.png"
                    alt="404"
                />
                <div className="fixed top-0 left-0 w-full px-[96px] py-6 h-[72px] bg-[#161616]">
                    <MillionTvIcon />
                </div>
                <div className="absolute z-10 top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] w-[50vw] flex items-center justify-center flex-col">
                    <h3 className="text-[40px] leading-[48px] mb-4 text-white">
                        Не можете найти?
                    </h3>
                    <p className="text-[22px] leading-[28px] text-center mb-5 text-[#C6C6C6]">
                        Нам не удалось найти эту страницу. Но на главной
                        странице есть еще много всего интересного
                    </p>
                    <div className="inline-block">
                        <MainButton
                            onClick={() => {
                                router.replace('/')
                            }}
                            text={`Главная страница`}
                            additionalClasses="bg-[#F4F4F4] text-black w-full"
                        />
                    </div>
                    <p className="text-[28px] leading-[34px] text-white mt-14">
                        Код ошибки: 404
                    </p>
                </div>
            </div>
        </>
    )
}
