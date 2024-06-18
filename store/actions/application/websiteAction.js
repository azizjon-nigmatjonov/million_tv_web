import applicationActionTypes from './applicationActionTypes'

export const setGlobalModalData = (data) => {
    return {
        type: applicationActionTypes.GLOBAL_MODAL,
        payload: data,
    }
}
