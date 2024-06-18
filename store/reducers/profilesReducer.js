import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    profiles_list: null,
}

const profilesReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_PROFILES_LIST:
            return {
                ...state,
                profiles_list: payload,
            }
        default:
            return state
    }
}

export default profilesReducer
