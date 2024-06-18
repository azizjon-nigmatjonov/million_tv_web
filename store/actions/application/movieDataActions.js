import applicationActionTypes from './applicationActionTypes'

export const setMovieData = (data) => {
    return {
        type: applicationActionTypes.SET_MOVIE_DATA,
        payload: data,
    }
}
