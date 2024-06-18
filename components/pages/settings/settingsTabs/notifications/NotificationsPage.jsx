import Info from 'components/errorPopup/Info'
import { NotificationsNullDataIcon } from 'components/svg'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'i18n'
import axios from 'utils/axios'

function NotificationsPage({ notifications }) {
    const { t, i18n } = useTranslation()
    const textRef = useRef()
    const [notificationsData, setNotificationsData] = useState(notifications)

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
                        })
                })
        }
    }

    return (
        <ul>
            {notificationsData?.count !== '0' ? (
                <li>
                    {notificationsData?.user_notifications?.map((option) => (
                        <div
                            key={option.id}
                            className="w-full mb-3 p-3 bg-mainColor rounded-[12px] relative flex"
                            onClick={handleTextOpen(
                                option?.id,
                                option?.is_read,
                            )}
                        >
                            <div className="min-w-[120px] h-[100px]">
                                <img
                                    src={
                                        option?.image?.length > 0
                                            ? option?.image
                                            : '../vectors/movie-image-vector.svg'
                                    }
                                    alt="1"
                                    className="block w-full h-full object-cover rounded-lg mr-4"
                                />
                            </div>
                            <div className="w-full pl-[12px]">
                                <div className="w-full mr-4">
                                    <h3 className="text-[17px] w-full whitespace-pre-wrap break-words leading-[22px]">
                                        {option[`title_${i18n.language}`]}
                                    </h3>
                                </div>
                                <p className="text-[15px] leading-[20px] text-[#6F6F6F]">
                                    {moment(option.created_at).format('L')}
                                </p>
                            </div>

                            {!option.is_read ? (
                                <div className="absolute top-[15px] right-[5px] min-w-[8px] w-[8px] h-2 bg-[#4589FF] rounded-full mr-2" />
                            ) : (
                                ''
                            )}
                        </div>
                    ))}
                </li>
            ) : (
                <Info
                    icon={<NotificationsNullDataIcon />}
                    title={t('notif_title')}
                    text={t('notif_text')}
                />
            )}
        </ul>
    )
}

export default NotificationsPage
