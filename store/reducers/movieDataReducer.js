import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    movie_data: null,
}

const movieDataReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_MOVIE_DATA:
            return {
                ...state,
                movie_data: payload,
            }
        default:
            return state
    }
}

export default movieDataReducer
