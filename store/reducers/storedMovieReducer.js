import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    movie: null,
}

const storedMovieReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_STORED_MOVIE:
            return {
                ...state,
                movie: payload,
            }
        default:
            return state
    }
}

export default storedMovieReducer
