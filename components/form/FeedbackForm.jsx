import MainButton from 'components/button/MainButton'
import { useFormik } from 'formik'
import { Router } from 'i18n'
import Rating from '@mui/material/Rating'
import GradeRoundedIcon from '@mui/icons-material/GradeRounded'
import StarPurple500RoundedIcon from '@mui/icons-material/StarPurple500Rounded'
import axios from '../../utils/axios'
import { parseCookies } from 'nookies'
import TextArea from './input/TextArea'
import { useState } from 'react'
import { useTranslation } from 'i18n'

const FeedbackForm = ({
    el,
    profile,
    setShowFeedbackForm,
    setFeedbacksData,
}) => {
    const { user_id } = parseCookies()
    const { access_token } = parseCookies()
    const [rating, setRating] = useState(5)
    const imageId = profile?.avatar?.split('/')[5]
    const { t } = useTranslation()

    const formik = useFormik({
        initialValues: { comment: '' },
        onSubmit: (values) => {
            if (access_token) {
                axios
                    .post(`/feedback`, {
                        avatar: imageId,
                        comment: values.comment,
                        customer_id: user_id,
                        customer_name: profile.name,
                        //  + profile.last_name
                        episode_key: 0,
                        movie_key: el?.slug,
                        rate: rating,
                        season_key: 0,
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            setShowFeedbackForm(false)
                            axios
                                .get(
                                    `/feedback?movie_key=${Router.query.movie}`,
                                )
                                .then((res) => {
                                    setFeedbacksData(res.data.feedbacks)
                                })
                        }
                    })
            } else {
                Router.push(`/registration`)
            }
        },
    })

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="min-w-full sm:min-w-[395px] p-0 flex flex-col items-start justify-between text-white"
        >
            <div className="w-full bg-mainColor px-[26px] py-[20px] rounded-[8px]">
                <h2 className="text-[17px] leading-[20px] mb-[15px]">
                    {t('leave_feedback')}
                </h2>
                <div className="mb-4">
                    <Rating
                        icon={
                            <GradeRoundedIcon
                                sx={{ color: '#03A9F4' }}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                }}
                            />
                        }
                        emptyIcon={
                            <StarPurple500RoundedIcon
                                sx={{ color: '#9D9D9D' }}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                }}
                            />
                        }
                        defaultValue={5}
                        name="simple-controlled"
                        onChange={(avent, newValue) => {
                            setRating(newValue)
                        }}
                    />
                </div>
                <TextArea
                    additionalClasses="outline_text_area"
                    name="comment"
                    handleChange={formik.handleChange}
                />
            </div>
            <div className="w-full flex justify-between items-center mt-4 space-x-[15px] ml-0">
                <MainButton
                    additionalClasses="text-[#fff] bg-mainColor font-normal h-[52px] text-[20px] hover:bg-[#231F36]"
                    type="reset"
                    onClick={() => {
                        setShowFeedbackForm(false)
                        formik.handleReset
                    }}
                    text={t('cancel')}
                />
                <MainButton
                    additionalClasses="bg-mainColor font-normal h-[52px] bgHoverBlue text-[20px]"
                    text={t('send')}
                    type="submit"
                />
            </div>
        </form>
    )
}

export default FeedbackForm
