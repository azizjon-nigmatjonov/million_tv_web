import { useQuery } from 'react-query'
import { request } from 'services/http-client'

const getMegogoFiltersFn = async (params) =>
    await request.get(`megogo/catalog/filters`, { params })

const getMegogoListFn = async () =>
    await request.get(`/megogo/catalog/objects`, { params })

export const useMegogo = ({ megogoFilterProps, megogoProps }) => {
    const filters = useQuery(
        [`GET_MEGOGO_FILTERS`, megogoFilterProps],
        () => getMegogoFiltersFn(megogoFilterProps),
        {
            enabled: !!megogoFilterProps,
        },
    )

    const megogoList = useQuery(
        ['GET_MEGOGO', megogoProps],
        () => getMegogoListFn(megogoProps),
        {
            enabled: !!megogoProps,
        },
    )

    return {
        megogoFilters: filters?.data ?? {},
        megogoList,
    }
}

const megogoService = {
    getList: (params) => request.get(`/megogo/catalog/objects`, { params }),
}

export default megogoService
