import moment from 'moment'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { useTranslation } from 'i18n'
export default function CommentsMessage({ list = [] }) {
    const { i18n } = useTranslation()
    const currentDate = useMemo(() => {
        const date = new Date()
        const result = moment(date).format('YYYY.MM.DD').split('.')
        const obj = {
            year: result[0],
            month: result[1],
            day: result[2],
        }
        return obj
    }, [])

    const currentLang = useMemo(() => i18n?.language, i18n)

    function getTime(time) {
        if (!time) return
        time = moment(time).format('YYYY.MM.DD HH:mm')
        const full = time.split(' ')
        const date = full[0].split('.')
        const elDate = {
            year: date[0],
            month: date[1],
            day: date[2],
            hour: full[1]?.split(':')[0] - 5 + ':' + full[1]?.split(':')[1],
        }

        const result = {}
        if (elDate.year === currentDate.year) {
            if (elDate.month === currentDate.month) {
                if (elDate.day === currentDate.day) {
                    return elDate.hour
                } else {
                    // day
                    result.day = +currentDate.day - +elDate.day
                }
            } else {
                // month
                result.month = +currentDate.month - +elDate.month
            }
        } else {
            // year
            result.year = +currentDate.year - +elDate.year
        }
        if (result.month) {
            if (currentLang === 'en') {
                return result.month > 1
                    ? result.month + ' months ago'
                    : result.month + ' month ago'
            }
            if (currentLang === 'ru') {
                return result.month > 1
                    ? result.month + ' месяца назад'
                    : result.month + ' месяц назад'
            }
            if (currentLang === 'uz') {
                return result.month + ' oy avval'
            }
        }
        if (result.day) {
            if (currentLang === 'eng') {
                return result.day > 1
                    ? result.day + ' days ago'
                    : result.day + ' day ago'
            }
            if (currentLang === 'ru') {
                return result.day > 1
                    ? result.day + ' дней назад'
                    : result.day + ' день назад'
            }
            if (currentLang === 'uz') {
                return result.day + ' kun oldin'
            }
        }
    }

    return (
        <div>
            {list?.map((element, index, row) => (
                <div
                    key={index}
                    className={`flex space-x-3 border-mainColor py-3 ${
                        index + 1 === row.length ? '' : 'border-b'
                    }`}
                >
                    <div className="max-w-[40px] w-full h-[40px] rounded-full flex items-center justify-center">
                        {element.profile_image ? (
                            <img
                                className="w-full h-full object-cover rounded-full"
                                src={element?.profile_image}
                                alt="avatar"
                            />
                        ) : (
                            <span className="text-white border border-whiteLighter w-full h-full rounded-full flex items-center justify-center uppercase">
                                {element.user_name.trim().substring(0, 1)}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="flex gap-[16px]">
                            <h3 className="text-sm font-medium text-whiteLighter">
                                {element.profile_name}
                            </h3>
                            <p className="text-[12px] text-whiteLighter">
                                {getTime(element.created_at)}
                            </p>
                        </div>
                        <p className="text-sm">{element.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
