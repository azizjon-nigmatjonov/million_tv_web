import { useState, useEffect } from 'react'
import premierService from 'services/premier/premierService'
import { useTranslation } from 'i18n'
import { useRouter } from 'next/router'
import MovieCardWrapper from '../Movie'
import { connect } from 'react-redux'

function PremierPageWrapper({
    categoryId,
    CurrentUserData,
    setCurrentMovieToStoreFn = () => {},
    storedMovies,
}) {
    const router = useRouter()
    const { i18n } = useTranslation()
    const [hasMore, setHasMore] = useState(true)
    const [movies, setMovies] = useState([])
    const [params, setParams] = useState({
        page: 1,
    })
    const [loading, setLoading] = useState(false)

    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
    const [stopScroll, setStopScroll] = useState(false)
    const getListFn = (props) => {
        setLoading(true)
        const params = {
            age_restriction:
                CurrentUserData?.profile_type == 'children'
                    ? CurrentUserData?.profile_age
                    : undefined,
            limit: props?.page == 1 ? 16 : 8,
            offset: props?.page * (props?.page == 1 ? 0 : 8),
            lang: i18n?.language,
            categories: categoryId,
            genres: props?.genres,
        }
        premierService
            .getList(params)
            .then((res) => {
                let result = res?.data?.movies
                if (result?.length) {
                    if (props?.page > 1) {
                        setMovies((prev) => [...prev, ...result])
                    } else setMovies(result)
                } else {
                    setHasMore(false)
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })
    }

    function handleScroll() {
        const page = params.page++
        const prmt = { page, ...params }
        setParams(prmt)

        getListFn(prmt)
    }

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
        const filters = {}
        filters.genres = router?.query?.filter_genres
        filters.countries = router?.query?.filter_Countries
        filters.years = router?.query?.filter_years?.split('-')

        if (storedMovies) {
            setParams({ ...filters, page: storedMovies.params.page })
            setMovies(storedMovies.movies)
        } else {
            getListFn({ ...params, ...filters })
            setParams({ ...filters, ...params })
        }
    }, [router, storedMovies])

    useEffect(() => {
        if (storedMovies && stopScroll) {
            setTimeout(() => {
                scrollToSoredPosition(storedMovies.scrollPosition.y)
            }, 300)
        }
    }, [storedMovies, stopScroll])

    useEffect(() => {
        setStopScroll(true)
        const handleScroll = () => {
            const position = { x: window.scrollX, y: window.scrollY }
            setScrollPosition(position)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="text-white my-[30px] sm:my-[48px] relative">
            <MovieCardWrapper
                list={movies}
                handleScroll={handleScroll}
                loading={loading}
                // hasMore={hasMore}
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

export default connect(mapStateToProps)(PremierPageWrapper)
