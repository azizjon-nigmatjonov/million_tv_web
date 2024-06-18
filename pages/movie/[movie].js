import { useEffect, useState } from 'react'
import SEO from 'components/SEO'
import { useTranslation } from 'i18n'
import axios from '../../utils/axios'
import MoviePage from 'components/pages/movies/MoviePage'
import MoviePageMobile from 'components/pages/movies/MoviePageMobile'
import { useIsMobile } from 'hooks/useIsMobile'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'

export default function Movies() {
    const isMobile = useIsMobile()
    const router = useRouter()
    const { i18n } = useTranslation()
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const categories = useSelector((state) => state.categories.categories_value)
    const [movies_singlepage, setMovies] = useState()
    const [feedbacks, SetFeedbacks] = useState()
    const [related, setRelatedMovies] = useState()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { profile_id } = parseCookies()
    const [loading, setLoading] = useState(false)
    const [errorCase, setErrorCase] = useState(false)

    useEffect(() => {
        if (router?.query?.movie) {
            axios
                .get(
                    `related-movies/${router.query.movie}?lang=${i18n?.language}`,
                    {
                        params: {
                            age_restriction:
                                CurrentUserData?.profile_type === 'children'
                                    ? CurrentUserData?.profile_age
                                    : 0,
                        },
                    },
                )
                .then((response) => {
                    setRelatedMovies(response?.data)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [i18n?.language])

    const getUzdigitalMovie = () => {
        setLoading(true)
        if (i18n?.language) {
            axios
                .get(
                    `/movies/${router.query.movie}?lang=${
                        i18n?.language
                    }&profile_id=${
                        CurrentUserData?.id
                            ? CurrentUserData?.id
                            : profile_id
                            ? profile_id
                            : ''
                    }`,
                )
                .then((response) => {
                    setMovies(response?.data)
                })
                .catch((error) => {
                    setErrorCase(true)
                    console.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const getMegogoMovie = () => {
        axios
            .get(
                `megogo/movie/info?id=${router?.query?.movie}&lang=${
                    i18n?.language
                }&profile_id=${
                    CurrentUserData ? CurrentUserData?.id : profile_id
                }`,
            )
            .then((response) => {
                if (response.data) {
                    setMovies(response?.data)
                }
            })
            .catch(() => {})
            .finally(() => {})
    }

    const getPremierMovie = () => {
        axios
            .get(
                `premier/videos/${router?.query?.movie}?profile_id=${
                    CurrentUserData ? CurrentUserData?.id : profile_id
                }`,
            )
            .then((response) => {
                if (response.data) {
                    setMovies(response?.data)
                }
            })
            .catch(() => {})
            .finally(() => {})
    }

    useEffect(() => {
        if (router?.query?.type === 'megogo') {
            getMegogoMovie()
        } else if (router?.query?.type === 'premier') {
            getPremierMovie()
        } else {
            getUzdigitalMovie()
        }
    }, [])
    return (
        <>
            <SEO title={movies_singlepage?.title} />
            <MoviePage
                CurrentUserData={CurrentUserData}
                related={related?.related_movies ? related?.related_movies : []}
                categories={categories?.categories}
                el={movies_singlepage ? movies_singlepage : []}
                profile={profile}
                megago_genres={[]}
                loading={loading}
                errorCase={errorCase}
            />
        </>
    )
}
