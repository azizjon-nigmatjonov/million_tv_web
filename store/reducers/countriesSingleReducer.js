import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialCartState = {
    data: null,
}

const countriesSingleReducer = (state = initialCartState, action) => {
    const { payload } = action
    switch (action.type) {
        case applicationActionTypes.SET_SINGLE_COUNTRY:
            return {
                data: payload,
            }
        default:
            return state
    }
}

export default countriesSingleReducer
