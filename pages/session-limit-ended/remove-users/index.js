import React, { useState } from 'react'
import { useTranslation, Router } from 'i18n'
import { RegistrationBackIcon } from 'components/svg'
import SEO from 'components/SEO'
import MainButton from 'components/button/MainButton'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import moment from 'moment'
import Checkbox from '@mui/material/Checkbox'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import axios from 'utils/axios'
import { parseCookies } from 'nookies'

export default function RemoveUsers({ users }) {
    const { t } = useTranslation()
    const { session_id } = parseCookies()
    const [selectedUsers, setSelectedUsers] = useState([])

    const handleChange = (id) => {
        if (selectedUsers.find((item) => item === id)) {
            setSelectedUsers((prev) => prev.filter((val) => val !== id))
        } else {
            setSelectedUsers((prev) => [...prev, id])
        }
    }

    const deleteSession = async () => {
        try {
            await axios.delete(`session`, {
                data: { session_id: selectedUsers.join(',') },
            })
        } catch (e) {
            console.log(e)
        }

        const profile = await axios.get('customer/profile')

        if (profile.data.customer.session_status) {
            Router.push('/')
        } else {
            Router.push('/session-limit-ended?status=offline')
        }
    }

    return (
        <>
            <SEO />
            <div className="w-full h-auto  md:h-[100vh] px-10 flex items-center justify-center md:p-0">
                <div className="relative text-white p-6 w-full h-auto mt-[100px] md:w-[500px] md:h-[600px] rounded-xl bg-formBgColor md:p-11">
                    <button
                        onClick={() =>
                            Router.replace(
                                '/session-limit-ended?status=offline',
                            )
                        }
                        className="absolute top-5 md:top-10 -left-12 md:-left-10 object-cover"
                    >
                        <RegistrationBackIcon />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-[34px] mb-4">
                            {t('delete_users')}
                        </h2>
                        <p className="text-[16px] md:text-[20px] leading-[25px] mb-6 text-[#6F6F6F]">
                            {t('session_limit_text')}
                        </p>
                    </div>
                    <div className="scroll max-h-[400px] overflow-y-scroll">
                        {users?.sessions
                            ?.filter((val) => val.id !== session_id)
                            ?.map((item, index, row) => (
                                <div
                                    key={item.id}
                                    className={
                                        index + 1 === row.length
                                            ? `p-2 md:p-4 flex items-center justify-between cursor-pointer`
                                            : `p-2 md:p-4 flex items-center justify-between border-b-[1px] border-solid border-[rgba(255,255,255,0.1)] cursor-pointer`
                                    }
                                    onClick={() => handleChange(item.id)}
                                >
                                    <div>
                                        <span className="block mb-2 text-[16px] md:text-xl font-medium">
                                            {item.platform_name}
                                        </span>
                                        <span className="text-[13px] md:text-base">
                                            {t('last_activity')}:{' '}
                                            {moment(item.created_at).format(
                                                'DD.MM.YYYY',
                                            )}
                                        </span>
                                    </div>
                                    <Checkbox
                                        disableRipple
                                        onChange={() => handleChange(item.id)}
                                        checked={selectedUsers.includes(
                                            item.id,
                                        )}
                                        icon={
                                            <CircleOutlinedIcon className="circle-outlined-color" />
                                        }
                                        checkedIcon={
                                            <CheckCircleIcon className="circle-check-color" />
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                    <MainButton
                        onClick={deleteSession}
                        disabled={!Boolean(selectedUsers.length)}
                        text={t('delete_selected')}
                        additionalClasses="bg-mainColor rounded-[8px] mt-6 bgHoverBlue"
                    />
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const cookies = parseCookies(ctx)
    if (cookies.user_id) {
        const urls = [
            {
                endpoint: `session/${cookies.user_id}?${
                    ctx.query.status === 'online'
                        ? 'session_type=online'
                        : 'session_type=online,offline'
                }`,
            },
        ]

        const [users] = await fetchMultipleUrls(urls, ctx)

        return {
            props: {
                users,
            },
        }
    }
}
