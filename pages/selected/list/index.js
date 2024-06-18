import SelectedItems from 'components/pages/selected/SelectedItems'
import SEO from 'components/SEO'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import Skeleton from '@mui/material/Skeleton'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'i18n'
import axios from '../../../utils/axios'
import { useSelector } from 'react-redux'
export default function Movies() {
    const router = useRouter()
    const { i18n } = useTranslation()
    const [isShimmerActive, setShimmerActive] = useState(false)
    const [selection, setSelections] = useState()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    useEffect(() => {
        if (i18n?.language) {
            if (router?.query?.key) {
                if (
                    CurrentUserData &&
                    CurrentUserData?.profile_type === 'children'
                ) {
                    axios
                        .get(
                            `/selection/${router.query.key}?lang=${
                                i18n.language
                            }&age_restriction=${parseInt(
                                CurrentUserData?.profile_age,
                            )}`,
                        )
                        .then((response) => {
                            if (response) {
                                setSelections(response.data)
                            }
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                } else {
                    axios
                        .get(
                            `/selection/${router.query.key}?lang=${i18n.language}`,
                        )
                        .then((response) => {
                            if (response) {
                                setSelections(response.data)
                            }
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }
            }
        }
    }, [])
    useEffect(() => {
        setTimeout(() => {
            setShimmerActive(true)
        }, 1200)
    }, [])
    const ScalettonNumber = [1, 2, 3, 4, 5]
    return (
        <>
            <SEO />
            {isShimmerActive ? (
                <SelectedItems selection={selection?.featured_list || []} />
            ) : (
                <div className="h-[100vh]">
                    <div className="wrapper mt-4">
                        <Skeleton
                            sx={{
                                bgcolor: '#111B33',
                                mt: '22px',
                                width: '280px',
                                height: '40px',
                                borderRadius: '12px',
                            }}
                            variant="wave"
                        />
                        <div className="grid grid-flow-row-dense grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 extraLarge:grid-cols-10 grid-rows-3 gap-x-2 sm:gap-x-5 gap-y-5 sm:gap-y-10 my-[36px]">
                            {ScalettonNumber.map((item) => (
                                <div key={item} className="h-[220px]">
                                    <Skeleton
                                        sx={{
                                            bgcolor: '#111B33',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '8px',
                                        }}
                                        variant="wave"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
