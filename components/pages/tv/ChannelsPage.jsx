import React, { useEffect, useState, useMemo } from 'react'
import TvChannel from 'components/cards/TvChannel'
import { useTranslation } from 'i18n'
import Skeleton from '@mui/material/Skeleton'
import { ClearIconDark, NullTvIcon } from 'components/svg'
import NullData from 'components/errorPopup/NullData'
import { Router } from 'i18n'
import CTabs from 'components/CTabs'

const ChannelsPage = ({
    channels_list,
    channel_category,
    handleTvSearch = () => {},
    currentTab,
}) => {
    const { t, i18n } = useTranslation()
    const skeletonNumber = [1, 2, 3, 4, 5]
    const [isShimmerActive, setShimmerActive] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShimmerActive(true)
        }, 500)
    }, [])

    const TabList = useMemo(() => {
        if (!i18n?.language) return
        let res = []
        const title =
            i18n.language == 'ru'
                ? 'title_ru'
                : i18n.language === 'en'
                ? 'title_en'
                : 'title_uz'
        res = channel_category?.map((item, index) => ({
            index,
            slug: item.id,
            name: item[title],
        }))
        res.unshift({ name: t('All channels'), index: 0 })
        return res
    }, [i18n, channel_category, t])

    const customization = {
        '& .MuiTabs-flexContainer': {
            border: 'none',
        },
        '& .MuiButtonBase-root': {
            background: '#111B33',
            borderRadius: '0',
            color: '#8B97B0',
            textTransform: 'none',
            fontSize: '16px',
            fontWight: '500',
            padding: '0 20px',
            textAlign: 'left',
            height: '48px',
            border: 'nones',
            borderRadius: '10px',
        },
        '& .MuiTabs-flexContainer ': {
            gap: '10px',
            display: 'inline-flex',
        },
        '& .Mui-selected': {
            color: '#fff !important',
        },
        '& .MuiTabs-indicator': {
            borderRadius: '10px',
            backgroundColor: '#03A9F4',
            height: '100%',
        },
    }

    return (
        <div className="wrapper px-4 flex flex-col text-white mt-4 mb-[100px] min-h-[620px]">
            <div className="mt-5">
                <CTabs
                    tabList={TabList}
                    currentTab={currentTab}
                    setCurrentTab={handleTvSearch}
                    passRouter={false}
                    customization={customization}
                />
            </div>

            {channels_list && isShimmerActive ? (
                <div className="grid grid-cols-3 mobile:grid-cols-8 gap-y-[18px] mb-[100px] md:gap-y-5 gap-x-4">
                    {channels_list?.tv_channels?.map((item) => (
                        <TvChannel
                            key={item.id}
                            el={item}
                            title={item[`title_${i18n?.language}`]}
                            time="12 : 00"
                            info={item[`description_${i18n?.language}`]}
                            imgSrc={item?.image}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-3 mobile:grid-cols-8 gap-4">
                        {skeletonNumber?.map((i) => (
                            <div key={i}>
                                <Skeleton
                                    sx={{
                                        bgcolor: '#111B33',
                                        width: '100%',
                                        height: '130px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!channels_list?.tv_channels?.length && isShimmerActive && (
                <div className="my-5 flex justify-center md:my-20">
                    <NullData
                        icon={<NullTvIcon />}
                        title={t('Нет телеканалы на этом  каталоги')}
                    />
                </div>
            )}
        </div>
    )
}

export default ChannelsPage
