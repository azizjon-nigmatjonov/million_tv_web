import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    notification_value: null,
    notification_unread_value: null,
}

const notificationReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_NOTIFICATION:
            return {
                ...state,
                notification_value: payload,
            }
        case applicationActionTypes.SET_NOTIFICATION_UNREAD:
            return {
                ...state,
                notification_unread_value: payload,
            }
        default:
            return state
    }
}

export default notificationReducer
