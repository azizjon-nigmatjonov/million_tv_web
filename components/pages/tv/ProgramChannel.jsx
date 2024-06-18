import React, { useMemo, useState } from 'react'
import { ProgramMenuIcon } from 'components/svg'
import moment from 'moment'
import { ClickAwayListener } from '@material-ui/core'
import { useTranslation } from 'i18n'
import CTabs from 'components/CTabs'

export default function ProgramChannel({
    data,
    refProgram,
    program_id,
    setProgram_id,
}) {
    const [openProgramList, setOpenProgramList] = useState(false)
    const { t } = useTranslation()
    const datetime = new Date()
    const [currentTab, setCurrentTab] = useState({ index: 0 })

    const TabList = useMemo(() => {
        if (!data?.programs_info?.length) return
        let list = data.programs_info.map((item, index) => {
            return {
                name: item.day,
                index,
            }
        })
        return list
    }, [data])

    const handleChangeTab = (value) => {
        setCurrentTab(value)
    }

    const customization = {
        '& .MuiTabs-flexContainer': {
            border: 'none',
        },
        '& .MuiButtonBase-root': {
            color: '#8B97B0',
            background: 'transparent',
            borderRadius: '0',
            textTransform: 'none',
            fontSize: '16px',
            fontWight: '500',
            padding: '0 20px',
            textAlign: 'left',
            height: '0',
        },
        '& .Mui-selected': {
            color: '#FFFFFF !important',
        },
        '& .MuiTabs-indicator': {
            backgroundColor: '#03a9f4',
        },
    }

    return (
        <div ref={refProgram} className="containerProgramChannal">
            {openProgramList && (
                <div className="cont">
                    <ClickAwayListener
                        onClickAway={() => setOpenProgramList(false)}
                    >
                        <div
                            className={
                                !openProgramList
                                    ? 'program fade-out-right'
                                    : 'program fade-in-right'
                            }
                        >
                            <div className="mt-8 px-[26px]">
                                <CTabs
                                    tabList={TabList}
                                    currentTab={currentTab}
                                    handleChangeTab={handleChangeTab}
                                    passRouter={false}
                                    customization={customization}
                                />
                            </div>
                            <div className="px-[24px] overflow-y-scroll h-[300px]">
                                {data?.programs_info &&
                                    data?.programs_info[
                                        currentTab.index
                                    ]?.programme?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="text-[#F6F8F9] text-[15px] border-b border-[#fff] border-opacity-[0.1] min-h-[60px] flex justify-center flex-col py-3"
                                        >
                                            <div className="flex">
                                                <span
                                                    className={`w-2 h-2 mr-3 bg-[#fff] bg-opacity-[0.3] rounded-full mt-2  ${
                                                        currentTab.index ===
                                                            1 &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('A') ===
                                                            moment(
                                                                datetime,
                                                            ).format('A') &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('LT A') <=
                                                            moment(
                                                                datetime,
                                                            ).format('LT A') &&
                                                        moment(
                                                            item.end_time,
                                                        ).format('LT A') >=
                                                            moment(
                                                                datetime,
                                                            ).format('LT A') &&
                                                        'bg-[#38EF7D] bg-opacity-[1]'
                                                    }`}
                                                ></span>
                                                <div className="w-[90%] flex flex-col">
                                                    <div className="flex space-x-3">
                                                        <span className="font-medium text-base">
                                                            {moment(
                                                                item.start_time,
                                                            ).format('LT')}
                                                        </span>

                                                        <span className="leading-10">
                                                            {item.title}
                                                        </span>
                                                        {/* </Marquee> */}
                                                    </div>

                                                    {currentTab.index === 1 &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('A') ===
                                                            moment(
                                                                datetime,
                                                            ).format('A') &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('LT A') <=
                                                            moment(
                                                                datetime,
                                                            ).format('LT A') &&
                                                        moment(
                                                            item.end_time,
                                                        ).format('LT A') >=
                                                            moment(
                                                                datetime,
                                                            ).format(
                                                                'LT A',
                                                            ) && (
                                                            <p className="text-sm text-[#A9A7B4]">
                                                                Сейчас в эфире
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </ClickAwayListener>
                </div>
            )}
            {data?.programs_info?.[0]?.programme?.length ? (
                <button
                    className="cursor-pointer btnMenu mr-6"
                    onClick={() => setOpenProgramList(true)}
                >
                    <ProgramMenuIcon />
                    <p>{t('tvShows')}</p>
                </button>
            ) : (
                ''
            )}
        </div>
    )
}
