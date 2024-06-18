import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import MovieFilterSelectBtn from './SelectBtn'
import MovieFilterSelectMenu from './SelectMenu'
import OptimizeQuery from 'utils/optimizeQuery'
import { useDispatch } from 'react-redux'
import { setStoredMovie } from 'store/actions/application/storedMoviesAction'
export default function MoviesFilterSelect({
    title = '',
    width = 110,
    height = 320,
    leftWidth = 350,
    rightWidth = 350,
    columns = 2,
    list = [],
    isOpen = false,
    multiple = false,
    handleClick = () => {},
    handleSelect = () => {},
    passRouter = true,
}) {
    const router = useRouter()
    const queries = { ...router.query }
    const dispatch = useDispatch()
    const newList = useMemo(() => {
        let result = list
        let arr = router?.query['filter_' + title]?.split(',')
        if (arr?.length && result?.length) {
            arr.forEach((id) => {
                result.forEach((el) => {
                    if (id === el?.value) {
                        el.checked = !el.checked
                    }
                })
            })
        }

        return result
    }, [router, list, title])

    const leftList = useMemo(() => {
        if (!newList?.length) return []
        const count = newList?.length / columns
        const result = newList?.slice(0, count)
        return result
    }, [columns, newList])

    const rightList = useMemo(() => {
        if (!newList?.length) return []
        const count = newList?.length / columns
        const result = newList?.slice(count)
        return result
    }, [columns, newList])

    function handleClickElement(element) {
        handleSelect(element)
        if (!passRouter) return
        let arr = queries['filter_' + title]?.split(',') ?? []

        if (multiple) {
            if (arr.includes(element?.value)) {
                arr = arr.filter((i) => i !== element?.value)
            } else arr.push(element?.value)
        } else {
            if (arr.includes(element?.value)) arr = []
            else arr = [element?.value]
        }

        queries['filter_' + title] = arr.join(',')
        router.push({
            path: router.pathname,
            query: { ...OptimizeQuery(queries) },
        })
        dispatch(setStoredMovie(null))
    }

    return (
        <div
            style={{ width: `${width === '100%' ? '100%' : width + 'px'}` }}
            className="relative"
        >
            <MovieFilterSelectBtn
                title={title}
                handleClick={handleClick}
                isOpen={isOpen}
            />
            <MovieFilterSelectMenu
                isOpen={isOpen}
                leftList={leftList}
                rightList={rightList}
                columns={columns}
                height={height}
                leftWidth={leftWidth}
                rightWidth={rightWidth}
                position={{ y: '60px', x: '0' }}
                handleClickElement={handleClickElement}
            />
        </div>
    )
}
