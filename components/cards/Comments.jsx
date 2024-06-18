import React from 'react'
import { useTranslation } from 'i18n'
import moment from 'moment'
import { FavIconComment, DislikeIconComment } from 'components/svg'

const Comments = ({ item }) => {
    const t = useTranslation()

    return (
        <>
            <div
                className={`relative bg-mainColor rounded-[12px] p-4 md:p-[18px] w-[300px]`}
            >
                <h4 className="mb-[8px] text-[13px] md:text-[17px] font-semibold text-white overflow-hidden break-words">
                    {item?.user_name}
                </h4>

                <p className="text-[15px] font-medium text-white h-[40px] sm:h-[50px] overflow-hidden">
                    {t.i18n.language === 'ru'
                        ? item?.comment_id?.name?.ru
                        : t.i18n.language === 'uz'
                        ? item?.comment_id?.name?.uz
                        : item?.comment_id?.name.en}
                </p>
                <div className="sm:flex items-center justify-between w-full mt-[12px] text-[#A9A7B4] hidden">
                    {moment(item?.created_at).format('LL')}
                    {/* <span className="ml-[8px]">
                        {moment(item.created_at).format('L')}
                    </span> */}
                    {item && item?.comment_type === 'like' ? (
                        <FavIconComment />
                    ) : (
                        <DislikeIconComment />
                    )}
                </div>
            </div>
        </>
    )
}

export default Comments
