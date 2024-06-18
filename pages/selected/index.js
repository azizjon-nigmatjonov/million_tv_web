import SelectedList from 'components/pages/selected/SelectedList'
import SEO from 'components/SEO'
import axios from '../../utils/axios'
import { useTranslation } from 'i18n'
import { useState, useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { useSelector } from 'react-redux'
import NullData from 'components/errorPopup/NullData'
import { NullDataSearchIcon } from 'components/svg'

export default function Movies() {
    const { i18n, t } = useTranslation()
    const [selections, setSelections] = useState()
    const ScalettonNumber = [1, 2, 3]
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    useEffect(() => {
        if (i18n?.language) {
            if (
                CurrentUserData &&
                CurrentUserData?.profile_type === 'children'
            ) {
                axios
                    .get(
                        `/selections?lang=${
                            i18n.language
                        }&active=true&age_restriction=${parseInt(
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
                    .get(`/selections?lang=${i18n.language}&active=true`)
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
    }, [CurrentUserData])

    return (
        <>
            <SEO />
            {selections ? (
                selections?.featured_lists ? (
                    <SelectedList
                        selections={selections?.featured_lists || []}
                    />
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
                            <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-rows-3 gap-x-2 sm:gap-x-10 gap-y-5 sm:gap-y-10 mt-8">
                                {ScalettonNumber.map((item) => (
                                    <div
                                        key={item}
                                        className="h-[152px] sm:h-[180px]"
                                    >
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
                )
            ) : (
                <div className="my-5 flex justify-center md:my-20">
                    <NullData
                        icon={<NullDataSearchIcon />}
                        title={t('there_is_not_data')}
                        text={t('maybe_see_other_pages_where_data_exists')}
                        textButton={t('back')}
                        link={() => Router.push('/')}
                    />
                </div>
            )}
        </>
    )
}
