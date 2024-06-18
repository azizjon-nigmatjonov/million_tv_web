import InfoModal from 'components/modal/InfoModal'
import { DeleteIcon } from 'components/svg'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'i18n'
import style from '../../Settings.module.scss'
import { parseCookies } from 'nookies'

function MobileDevices({ data, open, setDeleteData, setOpen, setSessionId }) {
    const { t } = useTranslation()
    const { session_id } = parseCookies()

    return (
        <div className={`${style.mobile_devices}`}>
            {data?.map((item) => (
                <div
                    key={item.id}
                    className="bg-secondryBackground text-white rounded-lg mb-4"
                >
                    <div className="p-4 relative">
                        <h2 className=" text-[20px] leading-[25px] mb-4">
                            {item?.platform_name}
                        </h2>
                        <p className="text-[17px] leading-[22px] text-[#A9A7B4]">
                            {/* {t('last_activity')}:{' '} */}
                            {moment(item.created_at).format('L')}
                        </p>
                        {session_id !== item.id && (
                            <button
                                onClick={() => {
                                    setOpen(true)
                                    setSessionId(item.id)
                                }}
                                className="absolute top-[50%] right-2 transform translate-y-[-50%] p-2 "
                            >
                                <DeleteIcon fill="#F76659" />
                            </button>
                        )}
                    </div>
                    {/* <div className="p-4">
                        <p className="text-[17px] leading-[22px] text-[#B0BABF]">
                            IP {t('address')}: {item?.ip_address}
                        </p>
                    </div> */}
                    {/*{open && (*/}
                    {/*    <InfoModal*/}
                    {/*        open={open}*/}
                    {/*        setOpen={setOpen}*/}
                    {/*        title={t('delete_session_title')}*/}
                    {/*        text={t('delete_session_text')}*/}
                    {/*        onClick={() => {*/}
                    {/*            setDeleteData(item.id)*/}
                    {/*            setOpen(false)*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*)}*/}
                </div>
            ))}
        </div>
    )
}

export default MobileDevices
