import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useTranslation } from 'i18n'
import cls from './style.module.scss'
export default function MovieFilterSelectBtn({
    title,
    isOpen = false,
    handleClick = () => {},
}) {
    const { t } = useTranslation()
    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                handleClick(e)
            }}
            className={`${cls.btn} relative z-[98] cursor-pointer bg-mainColor rounded-[12px] h-[54px] px-4 flex items-center justify-between`}
        >
            <p className="text-white">{t(title)}</p>
            {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </div>
    )
}
