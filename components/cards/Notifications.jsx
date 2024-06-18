import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
    NotificationsActiveIcon,
    NotificationsIcon,
    NotificationsNullDataIcon,
    NotificationTriangleIcon,
} from 'components/svg'
import Info from 'components/errorPopup/Info'
import { useTranslation } from 'i18n'
import moment from 'moment'
import axios from 'utils/axios'
import { makeStyles } from '@material-ui/core/styles'
import {
    setNotification,
    setNotificationUnread,
} from 'store/actions/application/notificationAction'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const useStyles = makeStyles({
    root: {
        postion: 'absolute',
        color: '',
        marginLeft: '425px !important',
        marginTop: '-20px !important',
    },
})

export default function Notifications({ notificationsUnread, notifications }) {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState(null)
    const [notificationsData, setNotificationsData] = useState(notifications)
    const [notifUnRead, setNotifUnRead] = useState(notificationsUnread)
    const open = Boolean(anchorEl)
    const [showNotification, setShowNotification] = useState(false)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleTextOpen = (value, condition) => {
        if (!condition) {
            axios
                .put('/update-status', {
                    id: value.toString(),
                    is_read: true,
                })
                .then(() => {
                    axios
                        .get('/user-notifications?page=1&limit=100')
                        .then(({ data }) => {
                            setNotificationsData(data)
                            dispatch(setNotification(data))
                            axios
                                .get('/user-unread-notification-count')
                                .then(({ data }) => {
                                    setNotifUnRead(data.count)
                                    dispatch(setNotificationUnread(data?.count))
                                })
                        })
                })
        }
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleNotificationtrue = (id) => {
        setShowNotification((prev) => !prev)
        notificationsData?.user_notifications.find((item) => {
            if (item.id === id) {
                item.isOpen = true
            }
        })
    }
    const handleNotificationfalse = (id) => {
        setShowNotification((prev) => !prev)
        notificationsData?.user_notifications.find((item) => {
            if (item.id === id) {
                item.isOpen = false
            }
        })
    }

    const classes = useStyles()

    return (
        <div className="relative">
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                className="relative"
                sx={{ width: '50px !important', height: '50px !important' }}
            >
                {notifUnRead > 0 && (
                    <span className="absolute top-[8px] right-[8px] w-3 h-3 rounded-full bg-[#4589FF]" />
                )}
                {anchorEl ? (
                    <NotificationsActiveIcon fill="white" />
                ) : (
                    <NotificationsIcon
                        fill={
                            router.pathname === '/movie/[movie]'
                                ? 'white'
                                : '#8B97B0'
                        }
                    />
                )}
            </IconButton>

            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    style: {
                        borderRadius: '12px !important',
                        color: '#fff',
                        backgroundColor: '#111B33',
                        boxShadow:
                            'inset 0px 2px 0px #383641, inset 0px -2px 0px #393939 !important',
                    },
                    sx: {
                        overflow: 'visible',
                        mt: 4.0,
                        width: '472px',
                        maxHeight: '60vh',
                        borderRadius: '12px !important',
                        position: 'absolute',
                        marginLeft: '10px',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div className={classes.root}>
                    <NotificationTriangleIcon />
                </div>

                {notificationsData?.count !== '0' &&
                notificationsData?.count ? (
                    <li className="scroll max-h-[50vh] overflow-y-scroll overflow-x-hidden relative">
                        {notificationsData?.user_notifications?.map(
                            (option) => {
                                return (
                                    <MenuItem
                                        style={{
                                            padding: '20px 18px',
                                        }}
                                        key={option.id}
                                        onClick={() => {
                                            handleTextOpen(
                                                option?.id,
                                                option?.is_read,
                                            )
                                        }}
                                    >
                                        {!option.is_read ? (
                                            <span className="w-[2px] h-[60px] absolute left-0 bg-[#4589FF]" />
                                        ) : (
                                            ''
                                        )}
                                        {/*<img
                                            src={
                                                option?.image?.length > 0
                                                    ? option?.image
                                                    : '../vectors/movie-image-vector.svg'
                                            }
                                            alt="1"
                                            className="block max-w-[124px] h-[78px] object-cover rounded-[8px] mr-4"
                                        />*/}
                                        <div className="w-full mr-4">
                                            <h3 className="text-[17px] w-full whitespace-pre-wrap break-words leading-[22px]">
                                                {
                                                    option[
                                                        `title_${i18n.language}`
                                                    ]
                                                }
                                            </h3>
                                            <h5 className="text-[13px] w-full whitespace-pre-wrap notification_text break-words leading-[18px]">
                                                {option[
                                                    `message_${i18n.language}`
                                                ]
                                                    .split(' ')
                                                    .slice(
                                                        0,
                                                        option?.isOpen
                                                            ? 1000
                                                            : 20,
                                                    )
                                                    .join(' ')}{' '}
                                                {option[
                                                    `message_${i18n.language}`
                                                ].split(' ').length <
                                                31 ? null : (
                                                    <>
                                                        {!option?.isOpen ? (
                                                            <span
                                                                className="text-blue-500"
                                                                onClick={() =>
                                                                    handleNotificationtrue(
                                                                        option.id,
                                                                    )
                                                                }
                                                            >
                                                                {t('open_all')}
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="text-blue-500"
                                                                onClick={() =>
                                                                    handleNotificationfalse(
                                                                        option.id,
                                                                    )
                                                                }
                                                            >
                                                                {t('close')}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </h5>
                                            <p className="text-[15px] leading-[20px] text-[#6F6F6F] mt-[4px]">
                                                {moment(
                                                    option.created_at,
                                                ).format('L')}
                                            </p>
                                        </div>
                                    </MenuItem>
                                )
                            },
                        )}
                    </li>
                ) : (
                    <Info
                        icon={<NotificationsNullDataIcon />}
                        title={t('notif_title')}
                        // text={t('notif_text')}
                    />
                )}
            </Menu>
        </div>
    )
}
