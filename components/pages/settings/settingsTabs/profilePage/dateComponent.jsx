import React, { useState } from 'react'
import {
    Calendarprofile,
    Calendarprofile2,
} from '../../../../../components/svg'
import { withStyles } from '@material-ui/styles'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { useTranslation } from 'i18n'
import { en, id, ru, uz } from 'date-fns/locale'

const StyledDatePicker = withStyles({
    root: {
        backgroundColor: '#1C192C',
        color: '#ffffff',
        '& .MuiCalendarPicker-viewTransitionContainer': {
            '& button': {
                background: '#1C192C',
                color: 'white',
                borderRadius: '8px',
                // border: 'none',
            },
        },
    },
})(DesktopDatePicker)

export default function DatePickers({
    value,
    onChange,
    label,
    isValidated = false,
}) {
    const { i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    return (
        <div id="CDatePicker" className="relative">
            <LocalizationProvider
                locale={
                    i18n.language === 'en'
                        ? en
                        : i18n.language === 'uz'
                        ? uz
                        : i18n.language === 'ru'
                        ? ru
                        : ru
                }
                dateAdapter={AdapterDateFns}
            >
                <StyledDatePicker
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    maxDate={new Date()}
                    label={label}
                    value={value ? value : ''}
                    inputFormat="yyyy/MM/dd"
                    onChange={onChange}
                    components={{
                        OpenPickerIcon: Calendarprofile,
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onClick={(e) => setOpen(true)}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding:
                                                            '30px 8px 30px 15px',
                                                        opacity: `${
                                                            value ===
                                                            '1000-01-01'
                                                                ? 0.2
                                                                : 1
                                                        }`,
                                                    }}
                                                    onClick={() => {
                                                        params?.inputProps?.onClick()
                                                        setChange(true)
                                                    }}
                                                >
                                                    <Calendarprofile />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            backgroundColor: '#111b33',
                                            width: '100% !important',
                                            borderRadius: '8px',
                                            marginTop: '24px !important',
                                            marginBottom: '24px !important',
                                            cursor: 'pointer',
                                            '& .MuiInputBase-input': {
                                                cursor: 'pointer',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline':
                                                {
                                                    border: 'none !important',
                                                },
                                            '& .MuiFormLabel-root': {
                                                top: '-25px !important',
                                                transform: 'none !important',
                                                color: '#444 !important',
                                                fontSize: '17px !important',
                                            },
                                        }}
                                    />
                                )
                            }}
                            sx={{
                                backgroundColor: '#111b33',
                                width: '100% !important',
                                borderRadius: '8px',
                                marginTop: '24px !important',
                                marginBottom: '24px !important',
                                cursor: 'pointer',
                                padding: '0 12px 0 0',
                                border: open
                                    ? '1px solid #03a9f4'
                                    : isValidated,
                                '& .MuiInputBase-input': {
                                    cursor: 'pointer',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none !important',
                                },
                                '& .MuiFormLabel-root': {
                                    top: '-25px !important',
                                    transform: 'none !important',
                                    color: '#444 !important',
                                    fontSize: '17px !important',
                                },
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
        </div>
    )
}
