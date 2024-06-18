import { useMemo, useState } from 'react'
import { useTranslation } from 'i18n'
import CBreadcrumbs from 'components/CElements/CBreadcrumbs'
import cls from './style.module.scss'

const months = {
    en: {
        jan: 'January',
        feb: 'February',
        march: 'March',
        apr: 'April',
        may: 'May',
        jun: 'June',
        jul: 'July',
        aug: 'August',
        sep: 'september',
        oct: 'October',
        nov: 'November',
        dec: 'December',
    },
    ru: {
        jan: 'январь',
        feb: 'февраль',
        march: 'март',
        apr: 'апрель',
        may: 'май',
        jun: 'июнь',
        jul: 'июль',
        aug: 'август',
        sep: 'сентябрь',
        oct: 'октябрь',
        nov: 'ноябрь',
        dec: 'декабрь',
    },
    uz: {
        jan: 'yanver',
        feb: 'febral',
        march: 'mart',
        apr: 'aprel',
        may: 'May',
        jun: 'iyun',
        jul: 'iyul',
        aug: 'avgust',
        sep: 'sentabr',
        oct: 'oktabr',
        nov: 'noyabr',
        dec: 'dekabr',
    },
}

export default function ActorPageTop({ actor = {} }) {
    const { t, i18n } = useTranslation()

    const actorDate = useMemo(() => {
        return actor?.birth_date?.split(' ') || []
    }, [actor])

    const ActorAge = useMemo(() => {
        if (!actorDate[3]) return
        const date = new Date()
        return date.getFullYear() - +actorDate[3]
    }, [actorDate])

    const monthsResult = useMemo(() => {
        return months[i18n?.language]?.[actorDate[1]?.toLowerCase()]
    }, [actor, i18n])

    const breadCrumbItems = useMemo(() => {
        return [
            {
                label: 'Назад',
                link: -1,
            },
            {
                label: actor.first_name + ' ' + actor.last_name,
            },
        ]
    }, [actor])
    return (
        <div className={cls.wrapper}>
            <CBreadcrumbs items={breadCrumbItems} type="link" />
            <div className="flex space-x-5 items-center mb-[36px] mt-6 relative">
                <div
                    className={`${cls.avatar} w-[136px] h-[136px] rounded-full rounded-full border border-border flex flex-column align-center justify-center`}
                >
                    {actor.photo ? (
                        <img
                            src={actor.photo}
                            alt="img"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span
                            className={` ${cls.avatar_letter} text-[50px] text-white text-center m-auto`}
                        >
                            {actor.first_name[0]}
                        </span>
                    )}
                </div>
                <div className="text-white">
                    <h2 className="text-2xl font-bold">
                        {actor.first_name} {actor.last_name}
                    </h2>
                    <p
                        className={`${cls.positionContent} text-lg mt-1 flex flex-row gap-[5px] flex-wrap`}
                    >
                        {actor.position?.map((item, index) => (
                            <span className={`text-whiteLighter`} key={index}>
                                {index === 0
                                    ? t(item).slice(0, 1).toUpperCase() +
                                      t(item).slice(1)
                                    : t(item)}
                                {index !== actor.position.length - 1 && ','}
                            </span>
                        ))}
                    </p>

                    <p
                        className={`text-whiteLighter text-lg capitalize flex flex-row flex-wrap gap-[5px]`}
                    >
                        <span>{actorDate[2]}</span>
                        <span>{monthsResult}</span>
                        <span>{actorDate[3]}</span>
                    </p>

                    <p
                        className={`${cls.infoContent} text-lg flex flex-row gap-[5px] text-whiteLighter`}
                    >
                        <span>
                            {ActorAge} {t('age')} ·
                        </span>
                        <span>
                            {Math.trunc(actor.height)} {t('sm')} ·
                        </span>
                        <span>
                            {Math.trunc(actor.weight)} {t('kg')}
                        </span>
                    </p>
                </div>
            </div>
            {/* <CTabs
                tabList={TabList}
                currentTab={currentTab}
                setCurrentTab={setcurrentTab}
                passRouter={false}
                customization={customization}
            /> */}
        </div>
    )
}
