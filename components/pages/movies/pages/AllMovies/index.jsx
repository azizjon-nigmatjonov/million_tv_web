import { useState, useEffect } from 'react'

import moviesService from 'services/movies/moviesService'
import { useTranslation } from 'i18n'
import { useRouter } from 'next/router'
import MovieCardWrapper from '../Movie'
import { useSelector } from 'react-redux'
import { connect } from 'react-redux'
function AllMoviesPageWrapper({
    categoryId,
    CurrentUserData,
    setCurrentMovieToStoreFn = () => {},
}) {
    const router = useRouter()
    const { i18n } = useTranslation()

    const [movies, setMovies] = useState([])

    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)
    const storedMovies = useSelector((state) => state.storedMovie.movie)
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
    const [stopScroll, setStopScroll] = useState(false)
    const [params, setParams] = useState({})

    const getListFn = (props) => {
        setLoading(true)
        const years = router?.query?.filter_years?.split('-')
        const params = {
            category: props.categoryId,
            countries: router?.query?.filter_Countries,
            genre: router?.query?.filter_genres,
            lang: i18n?.language,
            limit: '16',
            page: props?.page,
            release_year_from: years?.length ? years[0] : undefined,
            release_year_till: years?.length ? years[1] : undefined,
            age_restriction:
                CurrentUserData?.profile_type === 'children'
                    ? CurrentUserData?.profile_age
                    : 0,
        }
        moviesService
            .getList(params)
            .then((res) => {
                let result = res?.data?.movies
                if (result?.length) {
                    setMovies((prev) => [...prev, ...result])
                }

                if (result?.length < 16) {
                    setHasMore(false)
                    setLoading(false)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function handleScroll() {
        const page = params.page == 1 ? 2 : params.page++
        const prmt = { ...params, page: page + 1 }
        setParams(prmt)
        getListFn({ ...params, page })
    }

    function handleReset() {
        setMovies([])
        setScrollPosition({ x: 0, y: 0 })
    }

    useEffect(() => {
        if (!categoryId) return
        handleReset()
        const filters = {}

        if (storedMovies) {
            setParams({ params: storedMovies.params })
            setMovies(storedMovies.movies)
        } else {
            getListFn({
                ...params,
                ...filters,
                page: 1,
                categoryId: categoryId,
            })
            setParams({
                ...filters,
                ...params,
                page: 1,
                categoryId: categoryId,
            })
        }
    }, [router, storedMovies, categoryId])

    function handleMovieClick() {
        setStopScroll(false)
        setCurrentMovieToStoreFn({
            movies,
            params,
            scrollPosition,
            asPath: router?.asPath,
        })
    }

    const scrollToSoredPosition = (position) => {
        window.scrollTo(0, position)
    }

    useEffect(() => {
        if (storedMovies && stopScroll) {
            setTimeout(() => {
                scrollToSoredPosition(storedMovies.scrollPosition.y)
            }, 300)
        }
    }, [storedMovies, stopScroll])

    useEffect(() => {
        setStopScroll(true)
        const scroll = () => {
            const position = { x: window.scrollX, y: window.scrollY }
            setScrollPosition(position)
        }

        window.addEventListener('scroll', scroll)
        return () => {
            window.removeEventListener('scroll', scroll)
        }
    }, [])

    return (
        <div className="text-white">
            <MovieCardWrapper
                list={movies}
                handleScroll={handleScroll}
                hasMore={hasMore}
                loading={loading}
                handleMovieClick={handleMovieClick}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        storedMovies: state.storedMovie.movie,
    }
}

export default connect(mapStateToProps)(AllMoviesPageWrapper)
