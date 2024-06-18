import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    recommendation_value: null,
    recommendation_active: false,
}

const recommendationReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_RECOMMENDATION_VALUE:
            return {
                ...state,
                recommendation_value: payload,
            }
        case applicationActionTypes.SET_RECOMMENDATION_ACTIVE:
            return {
                ...state,
                recommendation_active: payload,
            }
        default:
            return state
    }
}

export default recommendationReducer
