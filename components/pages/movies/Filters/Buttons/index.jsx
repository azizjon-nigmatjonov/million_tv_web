import { useRouter } from 'next/router'
import { MovieFilterSelectButton } from './Button'
import OptimizeQuery from 'utils/optimizeQuery'
import { setStoredMovie } from 'store/actions/application/storedMoviesAction'
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'
export default function MovieFilterSelectButtons({
    Genres = [],
    Countries = [],
    Years = [],
    filterTitles = [],
}) {
    const router = useRouter()
    const queries = { ...router.query }
    const dispatch = useDispatch()
    function handleClickElement(element) {
        filterTitles?.map((title) => {
            let str = 'filter_' + title
            let arr = queries[str]?.split(',')
            if (arr?.includes(element?.value)) {
                arr = arr.filter((i) => i !== element?.value)
            }
            queries['filter_' + title] = arr?.join(',') ?? ''

            router.push({
                path: router.pathname,
                query: { ...OptimizeQuery(queries) },
            })
        })
        dispatch(setStoredMovie(null))
    }

    const filterBtns = useMemo(() => {
        const result = []
        if (Genres?.length) {
            Genres.map((item) => {
                if (item.checked) {
                    result.push(item)
                }
            })
        }
        if (Countries?.length) {
            Countries.map((item) => {
                if (item.checked) {
                    result.push(item)
                }
            })
        }
        if (Years?.length) {
            Years.map((item) => {
                if (item.checked) {
                    result.push(item)
                }
            })
        }
        return result
    }, [Genres, Countries, Years])

    return (
        <div className="flex overflow-x-scroll tablet:overscroll-x-none tablet:flex-wrap gap-3 scroll">
            {filterBtns?.map((item, index) => (
                <MovieFilterSelectButton
                    key={index}
                    element={item}
                    handleClickElement={handleClickElement}
                />
            ))}
        </div>
    )
}
