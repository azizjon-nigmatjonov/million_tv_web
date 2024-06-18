import SEO from 'components/SEO'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import MoviePageWrapper from 'components/pages/movies'

export default function Movies() {
    const router = useRouter()
    const categoriesMegogo = useSelector(
        (state) => state.categories.categories_value_megogo,
    )
    const categoriesPremier = useSelector(
        (state) => state.categories.categories_value_premier,
    )
    const [megogoCategory, setMegogoCategory] = useState(null)
    const [premierCategory, setPremierCategory] = useState(null)
    const [textTab, setTextTab] = useState('')

    useEffect(() => {
        const type = router?.query?.type
        if (type === 'tele-show' || type === 'filmy') {
            setMegogoCategory(
                categoriesMegogo?.find((item) => item.path == 'films'),
            )

            setPremierCategory(
                categoriesPremier?.find((item) => item.name == 'Фильмы'),
            )
            setTextTab('allMovies')
        } else if (type === 'test' || type === 'serialy') {
            setMegogoCategory(
                categoriesMegogo?.find((item) => item.path == 'series'),
            )

            setPremierCategory(
                categoriesPremier?.find((item) => item.name == 'Сериалы'),
            )
            setTextTab('allSeasons')
        } else {
            setMegogoCategory(
                categoriesMegogo?.find((item) => item.path == 'mult'),
            )

            setPremierCategory(
                categoriesPremier?.find((item) => item.name == 'Мультфильмы'),
            )
            setTextTab('allCartoons')
        }
    }, [router, categoriesMegogo, categoriesPremier])

    return (
        <>
            <SEO />

            <MoviePageWrapper
                megogoCategory={megogoCategory}
                premierCategory={premierCategory}
                textTab={textTab}
            />
        </>
    )
}
