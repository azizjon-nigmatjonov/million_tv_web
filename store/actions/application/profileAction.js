import applicationActionTypes from './applicationActionTypes'

export const setProfile = (data) => {
    return {
        type: applicationActionTypes.SET_PROFILE,
        payload: data,
    }
}

export const setProfileType = (data) => {
    return {
        type: applicationActionTypes.SET_PROFILE_TYPE,
        payload: data,
    }
}

export const setUserExist = (data) => {
    return {
        type: applicationActionTypes.SET_USER_EXIST,
        payload: data,
    }
}

export const setPaymentOrderId = (data) => {
    return {
        type: applicationActionTypes.SET_PAYMENT_ORDER_ID,
        payload: data,
    }
}
