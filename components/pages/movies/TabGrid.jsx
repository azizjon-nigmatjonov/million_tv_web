import { useTranslation } from 'i18n'

export default function TabGrid({ el, ganres }) {
    const { t } = useTranslation()
    return (
        <>
            <div className="flex flex-col">
                <div className="py-4 flex items-center justify-between">
                    <span className="flex-1 text-[22px] text-white text-opacity-[0.6]">
                        {t('genres')}:
                    </span>
                    <span className="flex-1 text-right text-[22px]">
                        {ganres}
                    </span>
                </div>
                <div className="w-full h-[1px] bg-[#fff] bg-opacity-[0.25]"></div>
                <div className="py-4 flex items-center justify-between">
                    <span className="flex-1 text-[22px] text-white text-opacity-[0.6]">
                        {t('production_year')}:
                    </span>
                    <span className="flex-1 text-right text-[22px]">
                        {el.release_year}
                    </span>
                </div>
            </div>
        </>
    )
}
