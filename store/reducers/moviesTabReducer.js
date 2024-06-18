import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    movies_tab_value: 0,
}

const moviesTabReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_MOVIES_TAB_CURRENT:
            return {
                ...state,
                movies_tab_value: payload,
            }
        default:
            return state
    }
}

export default moviesTabReducer
