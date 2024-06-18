import applicationActionTypes from './applicationActionTypes'

export const setCategorisValue = (data) => {
    return {
        type: applicationActionTypes.SET_CATEGORIES_VALUE,
        payload: data,
    }
}

export const setCategoriesMegogo = (data) => {
    return {
        type: applicationActionTypes.SET_CATEGORIES_MEGOGO,
        payload: data,
    }
}

export const setCategoriesPremier = (data) => {
    return {
        type: applicationActionTypes.SET_CATEGORIES_PREMIER,
        payload: data,
    }
}
