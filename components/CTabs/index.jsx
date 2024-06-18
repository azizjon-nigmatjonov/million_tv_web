import { useMemo } from 'react'
import CTab from './Details'
import cls from './style.module.scss'
import { useRouter } from 'next/router'
import OptimizeQuery2 from 'utils/optimizeQuery2'

export default function CTabs({
    passRouter = true,
    currentTab = {},
    setCurrentTab = () => {},
    tabList = [],
    handleChangeTab = () => {},
    customization,
}) {
    const router = useRouter()
    const queries = useMemo(() => {
        return { ...router.query }
    }, [router])

    const optimizedTabList = useMemo(() => {
        return tabList?.map((i, index) => ({
            ...i,
            index,
        }))
    }, [tabList])

    function handleTabAction(i) {
        if (!passRouter) {
            setCurrentTab(i)
            handleChangeTab(i)
            return
        }
        const newQuery = {
            tab: i?.slug || '',
        }

        router.push(router.pathname + `?${OptimizeQuery2(newQuery)}`)
    }

    const value = useMemo(() => {
        if (currentTab?.index) return currentTab.index
        if (!queries?.tab) return 0
        const tab = optimizedTabList.find((tab) => tab.slug === queries.tab)
        return tab?.index
    }, [optimizedTabList, queries, currentTab])

    return (
        <div className={cls.wrapper}>
            <CTab
                value={value}
                setValue={setCurrentTab}
                tabList={optimizedTabList}
                handleCustomClick={handleTabAction}
                styles={customization}
            />
        </div>
    )
}
