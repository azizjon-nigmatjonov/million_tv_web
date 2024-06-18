import applicationActionTypes from './applicationActionTypes'

export const userBalanceAction = (data) => {
    return {
        type: applicationActionTypes.USER_BALANCE,
        payload: data,
    }
}
