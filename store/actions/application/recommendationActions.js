import applicationActionTypes from './applicationActionTypes'

export const setRecommendationValue = (data) => {
    return {
        type: applicationActionTypes.SET_RECOMMENDATION_VALUE,
        payload: data,
    }
}

export const setRecommendationActivator = (data) => {
    return {
        type: applicationActionTypes.SET_RECOMMENDATION_ACTIVE,
        payload: data,
    }
}
