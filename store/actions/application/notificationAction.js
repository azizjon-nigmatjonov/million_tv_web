import applicationActionTypes from './applicationActionTypes'

export const setNotification = (data) => {
    return {
        type: applicationActionTypes.SET_NOTIFICATION,
        payload: data,
    }
}

export const setNotificationUnread = (data) => {
    return {
        type: applicationActionTypes.SET_NOTIFICATION_UNREAD,
        payload: data,
    }
}
