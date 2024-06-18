import { useEffect, useMemo, useState } from 'react'
import ActorPagewRapper from 'components/pages/Actor/ActorPage'
import SEO from 'components/SEO'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import { useTranslation } from 'i18n'
import axios from 'utils/axios'
import router from 'next/router'

export default function Movies() {
    const { i18n } = useTranslation()
    const [actorData, setActorData] = useState({})
    useEffect(() => {
        let result = {}
        if (i18n?.language && router?.query?.id) {
            axios
                .get(`staff/${router.query.id}`, {
                    params: {
                        lang: i18n.language,
                    },
                })
                .then((response) => {
                    setActorData(response?.data)
                    result = response?.data
                })
                .catch((error) => {
                    console.error(error)
                })
        }
        return result
    }, [i18n?.language])

    return (
        <>
            <SEO />
            <ActorPagewRapper data={actorData} />
        </>
    )
}
