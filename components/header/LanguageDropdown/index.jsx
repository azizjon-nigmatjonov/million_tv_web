import { useMemo, useState } from 'react'
import Menu from '@mui/material/Menu'
import cls from './style.module.scss'
import {
    KeyboardArrowUpRounded,
    KeyboardArrowDownRounded,
} from '@mui/icons-material'
import RussionFlag from 'public/icons/russion-flag.svg'
import EngFlag from 'public/icons/eng-flag.svg'
import UzbIcon from 'public/icons/uz-flag.svg'
import uzImg from 'public/images/uz.png'
import ruImg from 'public/images/russion.png'
import engImg from 'public/images/english.png'
import { useTranslation } from 'i18n'
import { Collapse } from '@mui/material'
// import UzbIcon from 'public/icons/uzb-icon.svg'

export default function LanguageDropdown({ changeLanguage }) {
    const { i18n } = useTranslation()
    const CurrentLang = useMemo(() => {
        const obj = {}
        switch (i18n?.language) {
            case 'ru':
                obj.flag = <img src={ruImg.src} alt="Ru Lang" />
                obj.lang = 'Ру'
                break
            case 'en':
                obj.flag = <img src={engImg.src} alt="Eng Lang" />
                obj.lang = 'En'
                break
            default:
                obj.flag = <img src={uzImg.src} alt="Uz Lang" />
                obj.lang = 'О‘z'
        }
        return obj
    }, [i18n])

    const LanguageList = useMemo(() => {
        let list = [
            {
                title: 'Русский',
                flag: <RussionFlag />,
                slug: 'ru',
            },
            {
                title: 'English',
                flag: <EngFlag />,
                slug: 'en',
            },
            {
                title: 'О‘zbekcha ',
                flag: <UzbIcon />,
                slug: 'uz',
            },
        ]
        return list.filter((el) => i18n?.language != el.slug)
    }, [i18n])

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <div className={cls.btn} onClick={handleClick}>
                <div className={cls.flag}>{CurrentLang?.flag}</div>
                <p className={cls.text}>{CurrentLang?.lang}</p>
                <div className={cls.arrow}>
                    {open ? (
                        <KeyboardArrowUpRounded />
                    ) : (
                        <KeyboardArrowDownRounded />
                    )}
                </div>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Menu
                    anchorEl={anchorEl}
                    id="language-dropdown"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                display: 'none',
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <div className={cls.menu}>
                        {LanguageList?.map((item) => (
                            <div
                                key={item.title}
                                className={cls.item}
                                onClick={() => changeLanguage(item.slug)}
                            >
                                {item.flag}
                                <p>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </Menu>
            </Collapse>
        </>
    )
}
