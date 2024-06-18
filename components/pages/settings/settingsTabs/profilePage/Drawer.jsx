import React, { useState } from 'react'
import { Drawer, Divider, Typography, Box } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@mui/material'
import { i18n, Router } from 'i18n'
import {
    EnglishFlagIcon,
    RussianIcon,
    UzFlagIcon,
    ClickedIcon,
    UnclickedIcon,
} from 'components/svg'
import axios from 'utils/axios'

const useStyles = makeStyles({
    paper: {
        backgroundColor: '#1e1b2e !important',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        paddingBottom: '34px',
        height: '262px !important',
    },
    languageHead: {
        backgroundColor: '#1e1b2e',
        padding: '16px',
        color: '#fff',
        fontSize: '22px',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        fontWeight: '700',
    },
    languageList: {
        display: 'flex',
        paddingTop: '17px',
        paddingBottom: '17px',
        paddingLeft: '16px',
        padding: '16px',
        backgroundColor: '#1e1b2e',
        color: '#fff',
        justifyContent: 'space-between',
        boxShadow: '0px -1px 0px #383641',
    },
    boxStyle: {
        width: '100',
        height: '262',
        backgroundColor: 'none',
        paddingBottom: '34px',
    },
})

export default function LangDrawer({ open, onClose }) {
    const classes = useStyles()
    const [language, setLanguage] = useState(false)

    const changeLanguage = (lang) => {
        axios.put(`/customer/change-lang`, {
            params: {
                customer_id: user_id,
                lang: lang,
            },
        })

        i18n.changeLanguage(lang)
        setLanguage(!language)
    }

    const List = [
        {
            img: <RussianIcon />,
            label: 'Русский',
            status: i18n.language === 'ru' && language,
        },
        {
            img: <EnglishFlagIcon />,
            label: 'English',
            status: i18n.language === 'en' && language,
        },
        {
            img: <UzFlagIcon />,
            label: 'Узбекча',
            status: i18n.language === 'uz' && language,
        },
    ]

    return (
        <>
            <div id="drawerStyle">
                <Drawer
                    anchor="bottom"
                    BackdropProps={{
                        style: {
                            backgroundColor: '#000',
                            opacity: 0.56,
                        },
                    }}
                    open={open}
                    onClose={onClose}
                    classes={{ paper: classes.paper }}
                >
                    <Box sx={classes.boxStyle}>
                        <Typography
                            className={classes.languageHead}
                            fontSize="22px"
                        >
                            Изменить язык
                        </Typography>
                        <Box
                            className={classes.languageList}
                            fontSize="17px"
                            onClick={() => changeLanguage('ru')}
                        >
                            <span className="flex">
                                <span className={classes.flagIcon}>
                                    <RussianIcon />
                                </span>
                                <span className="ml-[12px]">Русский</span>
                            </span>
                            <span className="">
                                {i18n.language === 'ru' ? (
                                    <ClickedIcon />
                                ) : (
                                    <UnclickedIcon />
                                )}
                            </span>
                        </Box>
                        <Box
                            className={classes.languageList}
                            fontSize="17px"
                            onClick={() => changeLanguage('en')}
                        >
                            <span className="flex">
                                <span className={classes.flagIcon}>
                                    <EnglishFlagIcon />
                                </span>
                                <span className="ml-[12px]">English</span>
                            </span>
                            <span className="">
                                {i18n.language === 'en' ? (
                                    <ClickedIcon />
                                ) : (
                                    <UnclickedIcon />
                                )}
                            </span>
                        </Box>
                        <Box
                            className={classes.languageList}
                            fontSize="17px"
                            onClick={() => changeLanguage('uz')}
                        >
                            <span className="flex">
                                <span className={classes.flagIcon}>
                                    <UzFlagIcon />
                                </span>
                                <span className="ml-[12px]">Узбекча</span>
                            </span>
                            <span className="">
                                {i18n.language === 'uz' ? (
                                    <ClickedIcon />
                                ) : (
                                    <UnclickedIcon />
                                )}
                            </span>
                        </Box>
                    </Box>
                </Drawer>
            </div>
        </>
    )
}
