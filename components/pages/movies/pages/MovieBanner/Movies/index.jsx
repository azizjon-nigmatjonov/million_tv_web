import { useEffect, useState } from 'react'
import { useTranslation } from 'i18n'
import moviesService from 'services/movies/moviesService'
import MovieCardWrapper from '../../Movie'
import { useRouter } from 'next/router'
export default function MovieBannerMovies({ CurrentUserData }) {
    const { i18n } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [movies, setMovies] = useState([])
    const [params, setParams] = useState({ page: 1, limit: 16 })
    function getFeaturedMoviesList(props) {
        const obj = {
            lang: i18n?.language,
            age_restriction:
                CurrentUserData?.profile_type === 'children'
                    ? CurrentUserData?.profile_age
                    : undefined,
            page: props?.page,
            limit: props?.limit,
        }

        moviesService
            .getFeaturedList(obj, router?.query?.category)
            .then((response) => {
                if (response?.data?.featured_list?.movies?.length) {
                    if (props?.page === 1) {
                        setMovies(response?.data?.featured_list?.movies)
                    } else {
                        setMovies((prev) => [
                            ...prev,
                            ...response?.data?.featured_list?.movies,
                        ])
                    }
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleScroll = () => {
        const page = params.page++
        const prmt = { ...params, page: page + 1 }
        setParams(prmt)

        getFeaturedMoviesList(prmt)
    }

    useEffect(() => {
        getFeaturedMoviesList(params)
    }, [params])
    return (
        <MovieCardWrapper
            loading={loading}
            list={movies}
            handleScroll={handleScroll}
        />
    )
}
