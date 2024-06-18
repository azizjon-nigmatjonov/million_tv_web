import React, { useEffect, useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import axios from '../../../../../utils/axios'
import { destroyCookie, parseCookies } from 'nookies'
import style from '../../Settings.module.scss'
import moment from 'moment'
import { DeleteIcon, TrashIcon, DeleteSession } from 'components/svg'
import { Router } from 'i18n'
import { useTranslation } from 'i18n'
import InfoModal from 'components/modal/InfoModal'
import MobileDevices from './MobileDevices'
import Skeleton from '@mui/material/Skeleton'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#161616',
        color: '#fff',
    },
    body: {
        fontSize: 15,
        lineHeight: '20px',
        color: '#fff',
        backgroundColor: '#262626',
        '@media screen and (max-width: 768px)': {
            backgroundColor: '#000303',
        },
    },
    root: {
        boxShadow: 'inset -1px -1px 0px rgba(255, 255, 255, 0.1) !important',
        border: 'none !important',
        '@media screen and (max-width: 768px)': {
            backgroundColor: '#000303',
            boxShadow: 'none !important',
            fontSize: '12px',
            lineHeight: '16px',
            padding: '6px 8px 6px 0',
        },
    },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#161616',
        },
    },
}))(TableRow)

const useStyles = makeStyles({
    table: {
        minWidth: '60vw',
        // borderRadius: '8px !important',
        height: '100%',
        '@media screen and (max-width: 1120px)': {
            minWidth: '55vw',
        },
        '@media screen and (max-width: 998px)': {
            minWidth: '100%',
        },
        '@media screen and (max-width: 768px)': {
            display: 'none',
        },
    },
})

export default function Devices() {
    const classes = useStyles()
    const { user_id, session_id } = parseCookies()
    const [sessionsData, setSessionsData] = useState()
    const [deleteData, setDeleteData] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [open, setOpen] = useState(false)

    const { t } = useTranslation()

    const ScalettonNumber = [1, 2, 3]
    useEffect(() => {
        if (user_id) {
            axios.get(`session/${user_id}`).then((res) => {
                const session = res.data.sessions.find(
                    (item) => item.id === session_id,
                )
                setSessionsData([
                    session,
                    ...res.data.sessions.filter(
                        (item) => item.id !== session_id,
                    ),
                ])
            })
        }
    }, [])

    const deleteSession = () => {
        axios
            .delete(`session`, {
                data: {
                    session_id: sessionId,
                },
            })
            .then((res) =>
                res.status === 200
                    ? axios.get(`session/${user_id}`).then((res) => {
                          setSessionsData(res.data.sessions)
                      })
                    : console.log(res),
            )
    }

    useEffect(() => {
        if (sessionsData?.length === 0) {
            destroyCookie({}, 'access_token', {
                path: '/',
            })
            Router.push('/')
        }
    }, [sessionsData])

    const Devices = sessionsData
    useEffect(() => {
        if (Devices) {
            for (let i = 0; i < Devices?.length; i++) {
                if (Devices[i].is_main) {
                    let saver = Devices[0]
                    Devices[0] = Devices[i]
                    Devices[i] = saver
                    return
                }
            }
        }
    }, [Devices])

    return (
        <div>
            {Devices ? (
                <div
                    className={`${classes.table} flex flex-col space-y-[18px] min-w-[60vw]`}
                >
                    {Devices?.map((item) => (
                        <div
                            key={item.id}
                            className="bg-secondryBackground p-3 rounded-[12px] flex items-center h-[64px]"
                        >
                            <div>
                                <p className="text-[17px] leading-[23px] mb-2">
                                    <span className="font-semibold">
                                        {item?.platform_name.split('|')[0]}
                                    </span>{' '}
                                    |{item?.platform_name.split('|')[1]}
                                </p>
                                <p className="text-[#808080] text-[13px]">
                                    {moment(item.created_at).format('LTS')}
                                    <span className="ml-2 text-[#BEBEBE]">
                                        {moment(item.created_at).format('L')}
                                    </span>
                                </p>
                            </div>
                            <button className="ml-auto">
                                {session_id !== item.id && (
                                    <button
                                        onClick={(e) => {
                                            setOpen(true)
                                            setSessionId(item.id)
                                        }}
                                        className={style.delete}
                                    >
                                        <p className="block lg:hidden">
                                            <DeleteIcon />
                                        </p>
                                        <span className="hidden text-[15px] lg:block text-[#F76659] hover:scale-110 duration-200">
                                            {t('delete')}
                                        </span>
                                    </button>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <ul className="flex flex-col space-y-[12px]">
                    {ScalettonNumber.map((item) => (
                        <li key={item} className="h-[65px] w-full">
                            <Skeleton
                                sx={{
                                    bgcolor: '#111B33',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '8px',
                                }}
                                variant="wave"
                            />
                        </li>
                    ))}
                </ul>
            )}
            {open && (
                <InfoModal
                    open={open}
                    setOpen={setOpen}
                    title={t('delete_session_title')}
                    onClick={() => {
                        deleteSession()
                        setOpen(false)
                    }}
                    contentStyle={'w-[426px] h-[292px]'}
                    icon={<DeleteSession />}
                />
            )}
            <MobileDevices
                icon={<TrashIcon />}
                data={sessionsData}
                open={open}
                setOpen={setOpen}
                setSessionId={setSessionId}
                setDeleteData={setDeleteData}
            />
        </div>
    )
}
