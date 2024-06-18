import { useDispatch, useSelector } from 'react-redux'
import { setMoviesTabCurrent } from 'store/actions/application/moivesTabActions'
import MoviePageTab from './CustomTab/Tab'
import MoviesFilter from './Filters'
import { useMegogo } from 'services/megogo/megogoService'
import { useTranslation } from 'i18n'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'utils/axios'
import MegogoPageWrapper from './pages/Megogo'
import PremierPageWrapper from './pages/Premier'
import AllMoviesPageWrapper from './pages/AllMovies'
import MovieBannerPageWrapper from './pages/MovieBanner'
import { setStoredMovie } from 'store/actions/application/storedMoviesAction'
export default function MoviePageWrapper({
    megogoCategory,
    premierCategory,
    textTab = '',
}) {
    const dispatch = useDispatch()
    const router = useRouter()
    const [filterdetails, setFilterdetails] = useState({})
    const moviesTab = useSelector(
        (state) => state.moviesTabCurrent.movies_tab_value,
    )
    const { i18n } = useTranslation()
    const { megogoFilters } = useMegogo({
        megogoFilterProps: { show_disabled_items: true, show_title: true },
    })
    const fromBanner = useMemo(() => {
        return router?.query?.featured || router?.query?.type == 'user'
    }, [router])
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const storedMovies = useSelector((state) => state.storedMovie.movie)
    const handleChangeTab = (event, newValue) => {
        dispatch(setMoviesTabCurrent(newValue))
        removeCurrentMovieFromStoreFn()
    }

    function setCurrentMovieToStoreFn(data) {
        dispatch(setStoredMovie(data))
    }

    function removeCurrentMovieFromStoreFn() {
        dispatch(setStoredMovie(null))
    }

    useEffect(() => {
        if (storedMovies?.asPath && router?.asPath !== storedMovies?.asPath) {
            removeCurrentMovieFromStoreFn()
        }
    }, [storedMovies])

    useEffect(() => {
        if (i18n?.language && router?.query?.type !== 'user') {
            axios
                .get(`/filter-details?lang=${i18n.language}`)
                .then((response) => {
                    setFilterdetails(response?.data)
                })
        }
    }, [i18n?.language, router])

    return (
        <div className="mt-7">
            {fromBanner ? (
                <MovieBannerPageWrapper CurrentUserData={CurrentUserData} />
            ) : (
                <div className="wrapper">
                    <MoviePageTab
                        textTab={textTab}
                        moviesTab={moviesTab}
                        handleChange={handleChangeTab}
                    />
                    <MoviesFilter
                        moviesTab={moviesTab}
                        filterdetails={filterdetails}
                        megogoFilters={megogoFilters}
                    />
                </div>
            )}
        </div>
    )
}
