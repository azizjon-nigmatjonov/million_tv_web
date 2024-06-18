import { useEffect, useState } from 'react'
import { useTranslation } from 'i18n'
import moviesService from 'services/movies/moviesService'
import MovieCardWrapper from '../../Movie'
export default function MovieBannnerRecommand({ CurrentUserData }) {
    const { i18n } = useTranslation()
    const [movies, setMovies] = useState([])

    function getListMovies() {
        const params = {
            genre: CurrentUserData?.favourite_genres,
            lang: i18n?.language,
        }
        moviesService.getList(params).then((res) => {
            setMovies(res?.data?.movies)
        })
    }

    useEffect(() => {
        getListMovies()
    }, [])
    return (
        <>
            <MovieCardWrapper list={movies} />
        </>
    )
}
