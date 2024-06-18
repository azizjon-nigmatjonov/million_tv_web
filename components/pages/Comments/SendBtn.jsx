import { CommentSendIcon } from 'components/svg'
import { parseCookies } from 'nookies'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import commentService from 'services/commentService'
import { showAlert } from 'store/reducers/alertReducer'
import { useTranslation } from 'i18n'

export default function CommentSendButton({ movie_key, refetch = () => {} }) {
    const { t } = useTranslation()
    const { user_id } = parseCookies()
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const inputRef = useRef()
    const [loading, setLoading] = useState(false)

    const CurrentUser = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const user = useMemo(() => {
        let obj = {}

        if (profile || CurrentUser) {
            if (CurrentUser?.profile_image)
                obj.image = CurrentUser.profile_image
            else obj.image = profile?.avatar ?? ''
            obj.name = CurrentUser?.name ? CurrentUser.name : profile.name
            obj.id = CurrentUser?.id ? CurrentUser.id : profile.id
        }
        return obj
    }, [profile, CurrentUser])
    const mutation = useMutation({
        mutationFn: (data) => {
            return commentService.createElement(data)
        },
        onSuccess: (val) => {
            if (!val?.id) return
            handleReset()
        },
    })

    function handleReset() {
        refetch()
        setSearch('')
    }

    function handleCommentPost() {
        if (!search?.replace(/\s+/g, '')) return
        if (!user_id) {
            dispatch(
                showAlert(
                    'Чтобы отправить комментарий, вы должны быть зарегистрированы',
                    'error',
                ),
            )
            return
        }

        const data = {
            comment: search,
            movie_key,
            profile_id: user?.id,
            profile_name: user?.name,
            user_id: user_id,
            user_name: user?.name,
            profile_image: user?.image,
        }

        mutation.mutate(data)
    }

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress)
        return () => {
            window.removeEventListener('keypress', handleKeyPress)
        }
    }, [search])

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && search && inputRef.current.value) {
            handleCommentPost()
        }
    }

    useEffect(() => {
        if (search) setLoading(true)
        else setLoading(false)
    }, [search])

    return (
        <>
            <p className="mb-[6px]">{t('leave_comment')}</p>
            <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px]">
                    <div className="w-[40px] h-[40px] overflow-hidden rounded-full border border-mainTextColor">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt="img"
                                className="w-full h-full"
                            />
                        ) : (
                            <span className="flex items-center justify-center h-full uppercase">
                                {user?.name?.trim().substring(0, 1)}
                            </span>
                        )}
                    </div>
                </div>
                <div className="w-full rounded-[8px] bg-secondryBackground flex items-center justify-between px-3">
                    <input
                        ref={inputRef}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-sm bg-transparent outline-none h-[40px]"
                        type="text"
                        placeholder={t('write_comment')}
                        value={search}
                        maxLength="300"
                    />
                    {mutation.isLoading ? (
                        ''
                    ) : (
                        <button
                            className="ml-2 h-full"
                            onClick={(e) => {
                                e.preventDefault()
                                handleCommentPost()
                            }}
                        >
                            <CommentSendIcon loading={loading} />
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}
