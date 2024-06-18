import { useState, useEffect } from 'react'
import megogoService from 'services/megogo/megogoService'
import { useTranslation } from 'i18n'
import { useRouter } from 'next/router'
import MovieCardWrapper from '../Movie'
import { connect } from 'react-redux'
function MegogoPageWrapper({
    categoryId,
    CurrentUserData,
    setCurrentMovieToStoreFn = () => {},
    storedMovies,
}) {
    const router = useRouter()
    const { i18n } = useTranslation()
    const [filters, setFilters] = useState({})
    const [movies, setMovies] = useState([])
    const [currentStep, setCurrentStep] = useState({})
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
    const [stopScroll, setStopScroll] = useState(false)
    const getListFn = (props) => {
        setLoading(true)
        const params = {
            age:
                CurrentUserData?.profile_type == 'children'
                    ? CurrentUserData?.profile_age
                    : '',
            age_limit: props?.age_limit,
            category_id: categoryId,
            country: props?.countries,
            lang: i18n?.language,
            limit: props?.next_page ? 8 : 16,
            sort: 'recommended',
            page: props?.next_page,
            year_from: props?.years?.length ? props.years[0] : '',
            year_to: props?.years?.length ? props.years[1] : '',
            year_id: props?.year_id,
            genre: props?.genres,
        }
        megogoService
            .getList(params)
            .then((res) => {
                let result = res?.groups[0]?.videos?.map((item) => ({
                    is_megogo: true,
                    ...item,
                }))
                if (result?.length) {
                    // if (props?.next_page) {
                    setMovies((prev) => [...prev, ...result])
                    // } else setMovies(result)

                    const obj = { next_page: res?.groups[0]?.next_page }
                    setCurrentStep(obj)
                } else {
                    setHasMore(false)
                }
            })
            .finally(() => setLoading(false))
    }

    function handleScroll() {
        const params = {
            ...filters,
            ...currentStep,
        }

        getListFn(params)
    }

    function handleMovieClick() {
        setStopScroll(false)
        setCurrentMovieToStoreFn({
            movies,
            filters,
            scrollPosition,
            currentStep,
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
            setCurrentStep(stopScroll?.currentStep)
            setMovies(storedMovies.movies)
        } else {
            getListFn(filters)
        }
        setFilters({ ...filters })
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
        <div className="text-white my-[30px] sm:my-[48px]">
            <MovieCardWrapper
                list={movies}
                handleScroll={handleScroll}
                // hasMore={hasMore}
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

export default connect(mapStateToProps)(MegogoPageWrapper)
