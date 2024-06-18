import { useEffect, useState, useRef } from 'react'
import { SettingsIconPlayer, CheckIcon } from 'components/svg'
import { useTranslation } from 'i18n'
const QualityButtonTv = ({
    qualities,
    setQuality,
    qualityActive,
    changeQuality,
}) => {
    const { t } = useTranslation()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const refClear = useRef(null)
    const handleClickOutside = (e) => {
        if (!refClear?.current?.contains(e.target)) {
            setIsOpenModal(false)
        }
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    })
    const getQuality = (value) => {
        return value ? value?.split('x')[1] + 'p' : '-'
    }
    return (
        <>
            <button onClick={() => setIsOpenModal(true)} className="mr-2">
                <SettingsIconPlayer width="25" heigh="25" />
            </button>
            {isOpenModal && (
                <div ref={refClear} className="absolute bottom-20 right-4">
                    <div className="w-[190px] bg-mainColor rounded-[12px] py-5 px-4 flex flex-col space-y-[24px]">
                        <span
                            onClick={() => {
                                setQuality('')
                                changeQuality('auto')
                                setIsOpenModal(false)
                            }}
                            className="font-[600] px-[24px] relative text-base cursor-pointer text-white hover:text-opacity-[0.6] duration-150"
                        >
                            {t('autoVideoPlay')}
                            {!qualityActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2">
                                    <CheckIcon width="12px" height="9px" />
                                </span>
                            )}
                        </span>
                        {qualities &&
                            qualities?.map((quality) => (
                                <span
                                    onClick={() => {
                                        setQuality(quality.quality)
                                        changeQuality(quality.quality)
                                        setIsOpenModal(false)
                                    }}
                                    key={quality.quality}
                                    className="font-[600] px-[24px] relative text-base cursor-pointer text-white hover:text-opacity-[0.6] duration-150"
                                >
                                    {getQuality(quality?.quality)}
                                    {qualityActive &&
                                        qualityActive == quality?.quality && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2">
                                                <CheckIcon
                                                    width="12px"
                                                    height="9px"
                                                />
                                            </span>
                                        )}
                                </span>
                            ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default QualityButtonTv
