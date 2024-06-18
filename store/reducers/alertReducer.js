const ADD_NEW_ALERT = 'ADD_NEW_ALERT'
const DELETE_ALERT = 'DELETE_ALERT'

let id = 1

const INITIAL_STATE = {
    alerts: [],
}

export default function alertReducer(state = INITIAL_STATE, { type, payload }) {
    switch (type) {
        case ADD_NEW_ALERT:
            return {
                ...state,
                alerts: [...state.alerts, { ...payload }],
            }

        case DELETE_ALERT:
            return {
                ...state,
                alerts: state.alerts.filter((alert) => alert.id !== payload),
            }

        default:
            return state
    }
}

export const addAlert = (title, type, id) => ({
    type: ADD_NEW_ALERT,
    payload: { title, type, id },
})
export const deleteAlert = (id) => ({ type: DELETE_ALERT, payload: id })

export const showAlert = (title, type = 'error') => {
    return (dispatch) => {
        const _id = id
        dispatch(addAlert(title, type, _id))
        setTimeout(() => {
            dispatch(deleteAlert(_id))
        }, 4000)
        id++
    }
}
