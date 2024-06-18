import axios from 'utils/axios'

const searchService = {
    getSearchHistory: (params) => axios.get(`/search_history`, { params }),
    createSearchHistory: (params) =>
        axios.post(
            `/search_history?user_id=${params.user_id}&movie_slug=${params.movie_slug}`,
        ),
    deleteSearchHistory: (params) =>
        axios.delete(
            `/search_history?user_id=${params.user_id}&movie_id=${params.movie_slug}`,
        ),
}

export default searchService
