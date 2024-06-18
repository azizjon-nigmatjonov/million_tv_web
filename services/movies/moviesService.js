import axios from 'utils/axios'

export const usePremier = ({}) => {}

const moviesService = {
    getList: (params) => axios.get(`movies`, { params }),
    getCollectionList: (params) =>
        axios.get('/integration-collection', { params }),
    getFeaturedList: (params, slug) =>
        axios.get(`/featured-list/${slug}`, { params }),
}

export default moviesService
