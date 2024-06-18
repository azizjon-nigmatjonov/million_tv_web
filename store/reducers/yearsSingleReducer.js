import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialCartState = {
    data: null,
}

const yearsSingleReducer = (state = initialCartState, action) => {
    const { payload } = action
    switch (action.type) {
        case applicationActionTypes.SET_SINGLE_YEAR:
            return {
                data: payload,
            }
        default:
            return state
    }
}

export default yearsSingleReducer
