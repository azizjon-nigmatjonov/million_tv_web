import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    banner_text: '',
}

const categoriesReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_BANNER_TEXTS:
            return {
                ...state,
                banner_text: payload,
            }
        default:
            return state
    }
}

export default categoriesReducer
