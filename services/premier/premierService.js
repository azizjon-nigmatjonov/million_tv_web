import { useQuery } from 'react-query'
import { request } from 'services/http-client'
import axios from 'utils/axios'

export const usePremier = ({}) => {}

const premierService = {
    getList: (params) => axios.get(`premier/videos`, { params }),
}

export default premierService
