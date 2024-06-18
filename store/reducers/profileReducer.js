import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    profile_value: null,
    profile_type: 'adult',
    user_exist: true,
    payment_order_id: '',
}

const profileReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_PROFILE:
            return {
                ...state,
                profile_value: payload,
            }
        case applicationActionTypes.SET_PROFILE_TYPE:
            return {
                ...state,
                profile_type: payload,
            }
        case applicationActionTypes.SET_USER_EXIST:
            return {
                ...state,
                user_exist: payload,
            }
        case applicationActionTypes.SET_PAYMENT_ORDER_ID:
            return {
                ...state,
                payment_order_id: payload,
            }
        default:
            return state
    }
}

export default profileReducer
