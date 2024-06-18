import { useTranslation } from 'i18n'
import MoviesFilter from '../movies/Filters'
import { useDispatch, useSelector } from 'react-redux'
import { useMegogo } from 'services/megogo/megogoService'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'utils/axios'
import CTabs from 'components/CTabs'
import AllMoviesPageWrapper from '../../../components/pages/movies/pages/AllMovies'
import { setStoredMovie } from 'store/actions/application/storedMoviesAction'
import { setMoviesTabCurrent } from 'store/actions/application/moivesTabActions'

export default function CatalogPageWrapper() {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const dispatch = useDispatch()

    const categories = useSelector((state) => state.categories.categories_value)

    const List = useMemo(() => {
        return categories?.categories?.map((item, index) => ({
            ...item,
            index,
        }))
    }, [categories])

    const currentCategory = useSelector(
        (state) => state.moviesTabCurrent.movies_tab_value,
    )

    const currentTab = useMemo(() => {
        if (currentCategory?.slug) {
            return currentCategory
        }
        return List[0]
    }, [currentCategory, List])

    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const moviesTab = useSelector(
        (state) => state.moviesTabCurrent.movies_tab_value,
    )
    const { megogoFilters } = useMegogo({
        megogoFilterProps: { show_disabled_items: true, show_title: true },
    })
    const [filterdetails, setFilterdetails] = useState({})
    const [collectionData, setCollectionData] = useState({})

    useEffect(() => {
        if (i18n?.language && router?.query?.type !== 'user') {
            axios
                .get(`/filter-details?lang=${i18n.language}`)
                .then((response) => {
                    setFilterdetails(response?.data)
                })
        }
    }, [i18n, router])

    const TabList = useMemo(() => {
        return (
            categories?.categories?.map((item) => ({
                ...item,
                name: item.title,
            })) ?? []
        )
    }, [categories])

    function setCurrentMovieToStoreFn(data) {
        dispatch(setStoredMovie(data))
    }

    function removeCurrentMovieFromStoreFn() {
        dispatch(setStoredMovie(null))
    }

    const handleChangeTab = (value) => {
        dispatch(setMoviesTabCurrent(value))
        removeCurrentMovieFromStoreFn()
        setCollectionData({})
    }

    return (
        <div className="text-white py-[32px]">
            <div className="wrapper">
                <h1 className="section-title oswald-family">{t('catalog')}</h1>
                <p className="mt-3 text-whiteLighter">
                    {t('search_movies_series_more')}
                </p>

                <MoviesFilter
                    moviesTab={moviesTab}
                    filterdetails={filterdetails}
                    megogoFilters={megogoFilters}
                    currentTab={currentTab}
                />
                <div className="mt-[40px]">
                    <CTabs
                        tabList={TabList}
                        passRouter={false}
                        currentTab={currentTab}
                        handleChangeTab={handleChangeTab}
                    />
                </div>
            </div>
            <div>
                <AllMoviesPageWrapper
                    categoryId={currentTab?.id}
                    CurrentUserData={CurrentUserData}
                    setCurrentMovieToStoreFn={setCurrentMovieToStoreFn}
                    collectionData={collectionData}
                    setCollectionData={setCollectionData}
                />
            </div>
        </div>
    )
}
