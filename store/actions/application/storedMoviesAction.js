import applicationActionTypes from './applicationActionTypes'

export const setStoredMovie = (data) => {
    return {
        type: applicationActionTypes.SET_STORED_MOVIE,
        payload: data,
    }
}
