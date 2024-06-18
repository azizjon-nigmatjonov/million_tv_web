import applicationActionTypes from './applicationActionTypes'

export const setBannerTexts = (data) => {
    return {
        type: applicationActionTypes.SET_BANNER_TEXTS,
        payload: data,
    }
}
