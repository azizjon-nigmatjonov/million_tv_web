import applicationActionTypes from './applicationActionTypes'

export const setRegistrationData = (data) => {
    return {
        type: applicationActionTypes.SET_REGISTRATION_DATA,
        payload: data,
    }
}
