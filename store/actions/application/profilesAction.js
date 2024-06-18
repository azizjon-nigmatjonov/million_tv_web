import applicationActionTypes from './applicationActionTypes'

export const setProfilesList = (data) => {
    return {
        type: applicationActionTypes.SET_PROFILES_LIST,
        payload: data,
    }
}
