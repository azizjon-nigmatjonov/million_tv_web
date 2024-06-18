import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    data: null,
}

const registrationReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_REGISTRATION_DATA:
            return {
                ...state,
                data: payload,
            }
        default:
            return state
    }
}

export default registrationReducer
