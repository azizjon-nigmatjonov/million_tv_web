import applicationActionTypes from './applicationActionTypes'

export const setMoviesTabCurrent = (data) => {
    return {
        type: applicationActionTypes.SET_MOVIES_TAB_CURRENT,
        payload: data,
    }
}
