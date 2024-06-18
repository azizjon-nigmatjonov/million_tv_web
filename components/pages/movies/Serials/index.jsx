import { useMemo, useState } from 'react'
import CTabs from 'components/CTabs'
import SerialCard from './Card'

export default function Serials({ list, slug }) {
    const [currentTab, setCurrentTab] = useState({ index: 0, slug: 1 })
    const SeasonNumber = useMemo(() => {
        let result =
            list?.map((item, index) => ({
                index,
                name: `Сезон ${index + 1}`,
                slug: index + 1,
            })) ?? []
        return result
    }, [list])

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
            height: '48px',
        },
        '& .Mui-selected': {
            color: '#FFFFFF !important',
        },
        '& .MuiTabs-indicator': {
            backgroundColor: '#03a9f4',
        },
    }

    function handleTab(element) {
        setCurrentTab(element)
    }

    const CurrentSerial = useMemo(() => {
        let result = []
        if (!list?.length || !currentTab) return result
        result =
            list.filter(
                (item) => item.season_number === currentTab.slug,
            )?.[0] ?? []
        return result
    }, [currentTab])

    return (
        <div className="text-white wrapper">
            <CTabs
                tabList={SeasonNumber}
                customization={customization}
                passRouter={false}
                currentTab={currentTab}
                setCurrentTab={handleTab}
            />
            <div className="grid grid-cols-3 mobile:grid-cols-6 gap-3">
                {CurrentSerial?.episodes?.map((item, index) => (
                    <div key={item?.id || index}>
                        <SerialCard
                            element={item}
                            seasonNumber={index + 1}
                            episodeNumber={item?.episode_number}
                            slug={slug}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
