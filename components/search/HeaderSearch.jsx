import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from '../../utils/axios'
import cls from './SearchStyle.module.scss'
import lottie from 'lottie-web'
import router from 'next/router'
import { useDebounce } from 'hooks/useDebounce'
import { useTranslation } from 'i18n'
import { setSearchAction } from 'store/actions/application/searchAction'
import { useDispatch, useSelector } from 'react-redux'
import OptimizeQuery2 from 'utils/optimizeQuery2'
import SearchList from './Movies'
import searchService from 'services/searchService'
import { parseCookies } from 'nookies'

export default function HeaderSearch({ searchOpen }) {
    const { i18n } = useTranslation()
    const dispatch = useDispatch()
    const [resultSearch, setResultSearch] = useState('')
    const serarchValue = useSelector(
        (state) => state.searchReducer.search_value,
    )
    const [loading, setLoading] = useState(true)
    const debouncedSearchTerm = useDebounce(resultSearch || serarchValue, 500)
    const refClear = useRef()
    const loadingAnim = useRef()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { user_id } = parseCookies()
    const [data, setData] = useState([])
    const [historyList, setHistoryList] = useState([])
    const searchHistory = useSelector((state) => state.deleteSearchHistory)

    useEffect(() => {
        if (debouncedSearchTerm) {
            if (i18n?.language) {
                getMovies()
            }
        } else {
            setData([])
        }
    }, [debouncedSearchTerm])

    function getMovies() {
        setLoading(true)
        let params = {
            lang: i18n.language,
            search: debouncedSearchTerm,
            age_restriction:
                CurrentUserData?.profile_type === 'children'
                    ? CurrentUserData?.profile_age
                    : 0,
        }
        if (router?.query?.id) params.category = router?.query?.id
        axios
            .get(`/movies?${OptimizeQuery2(params)}`)
            .then((res) => setData(res?.data?.movies))
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getSearchHistoryFn()
    }, [searchHistory])

    function getSearchHistoryFn() {
        if (!user_id) return
        const params = {
            user_id: user_id,
            lang: i18n.language,
        }
        setLoading(true)
        searchService
            .getSearchHistory(params)
            .then((res) => {
                setHistoryList(res?.data?.searched_movies)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (loading)
            lottie.loadAnimation({
                container: loadingAnim.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: require('../../public/data.json'),
            })
    }, [loading])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])

    function createSearchHistoryFn(item) {
        const params = {
            user_id: user_id,
            movie_slug: item.slug,
        }
        searchService.createSearchHistory(params)
    }

    const List = useMemo(() => {
        if (!serarchValue) {
            return historyList
        } else {
            return data
        }
    }, [historyList, data, serarchValue])

    useEffect(() => {
        getSearchHistoryFn()
    }, [])

    return (
        <div className={`${cls.search} scroll`}>
            <div
                className={
                    searchOpen
                        ? `${cls.fade_in_top} ${cls.search_content}`
                        : `${cls.search_content}`
                }
            >
                <div className={cls.search_center}>
                    {loading ? (
                        <div className={`${cls.loading}`} ref={loadingAnim} />
                    ) : (
                        <button
                            onClick={() => {
                                refClear.current.value = ''
                                setResultSearch('')
                                dispatch(setSearchAction(false))
                            }}
                            className={cls.clear_btn}
                        ></button>
                    )}
                </div>
            </div>
            <SearchList
                list={List}
                loading={loading}
                handleMovieClick={createSearchHistoryFn}
                serarchValue={serarchValue}
                user_id={user_id}
            />
        </div>
    )
}
