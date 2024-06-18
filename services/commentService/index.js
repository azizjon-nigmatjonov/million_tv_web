import { useQuery } from 'react-query'
import { request } from 'services/http-client'

const commentService = {
    getList: (params) => request.get(`/movie-comment`, { params }),
    createElement: (data) => request.post('movie-comment', data),
}

export default commentService

// export const useComment = ({ listPops }) => {
// const commentsList = useQuery(
//     [`GET_COMMENTS_LIST`, listPops],
//     () => getList(listPops),
//     {
//         enabled: !!listPops?.movie_key,
//     },
// )

//     return {
//         commentsList
//     }
// }
