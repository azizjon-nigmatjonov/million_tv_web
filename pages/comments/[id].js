import SEO from 'components/SEO'
import CommentsPageWrapper from 'components/pages/Comments'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function CommentPage() {
    const router = useRouter()
    return (
        <>
            <SEO />
            <CommentsPageWrapper
                movie_key={router?.query?.id}
                classess="my-5"
            />
        </>
    )
}
