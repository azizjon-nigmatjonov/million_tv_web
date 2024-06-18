import SEO from 'components/SEO'
import { useRouter } from 'next/router'
import { useTranslation } from 'i18n'
import RedirectDownloadPage from 'components/RedirectDownloadPage/RedirectDownloadPage'
import { useState, useEffect } from 'react'
import axios from 'utils/axios'
import { useSelector } from 'react-redux'
import { parseCookies } from 'nookies'

export default function PreviewMovies() {
    const [moviesSinglepage, setMoviesSinglepage] = useState([])
    const router = useRouter()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { profile_id } = parseCookies()
    const { i18n } = useTranslation()

    useEffect(() => {
        if (!i18n?.language) return
        axios
            .get(
                `movies/${router.query.movie}?lang=${
                    i18n.language
                }&profile_id=${
                    CurrentUserData?.id
                        ? CurrentUserData?.id
                        : profile_id
                        ? profile_id
                        : ''
                }`,
            )
            .then((res) => {
                setMoviesSinglepage(res.data)
            })
            .catch((err) => {})
    }, [i18n])

    return (
        <>
            <SEO />
            <RedirectDownloadPage
                movieInfo={moviesSinglepage ? moviesSinglepage : []}
            />
        </>
    )
}
