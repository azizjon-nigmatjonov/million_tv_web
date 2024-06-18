import { useMemo, useState } from 'react'
import { ArrowRight } from 'components/svg'
import CommentSendButton from './SendBtn'
import CommentsMessage from './Messages'
import commentService from 'services/commentService'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useTranslation } from 'i18n'

export default function CommentsPageWrapper({
    movie_key,
    link,
    classess,
    commentsRef,
}) {
    const router = useRouter()
    const { t } = useTranslation()

    const params = useMemo(() => {
        if (!movie_key) return
        return {
            movie_key,
            limit: 500,
            page: 1,
        }
    }, [movie_key])

    const { data: comments, refetch } = useQuery(
        ['GET_COMMENT_LIST', params],
        () => {
            return commentService.getList(params)
        },
        {
            enabled: !!params?.movie_key,
        },
    )

    const List = useMemo(() => {
        let result = []
        if (link) {
            result = comments?.movie_comments?.slice(0, 3) ?? []
        } else result = comments?.movie_comments?.reverse() ?? []
        return result
    }, [comments])

    return (
        <div
            ref={commentsRef}
            className={`wrapper text-white mt-14 mb-6 ${classess}`}
            style={{ margin: '60px 0 20px 0' }}
        >
            <h3
                onClick={() => {
                    if (link) router.push(`${link}/${movie_key}`)
                }}
                className={`font-bold flex items-center justify-between pb-2 cursor-pointer oswald-family ${
                    link ? '' : 'text-2xl pb-5'
                }`}
            >
                {t('comments')} {link && <ArrowRight width="20" />}
            </h3>
            <div className="mb-4">
                <CommentsMessage list={List} />
            </div>
            <CommentSendButton movie_key={movie_key} refetch={refetch} />
        </div>
    )
}
