import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    categories_value: null,
    categories_value_megogo: null,
    categories_value_premier: null,
}

const categoriesReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_CATEGORIES_VALUE:
            return {
                ...state,
                categories_value: payload,
            }
        case applicationActionTypes.SET_CATEGORIES_MEGOGO:
            return {
                ...state,
                categories_value_megogo: payload,
            }
        case applicationActionTypes.SET_CATEGORIES_PREMIER:
            return {
                ...state,
                categories_value_premier: payload,
            }
        default:
            return state
    }
}

export default categoriesReducer
