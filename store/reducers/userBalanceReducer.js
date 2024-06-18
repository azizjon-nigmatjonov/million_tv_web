import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    userBalance: 0,
}

const userBalanceReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.USER_BALANCE:
            return {
                userBalance: payload,
            }
        default:
            return state
    }
}

export default userBalanceReducer
