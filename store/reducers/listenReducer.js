import applicationActionTypes from 'store/actions/application/applicationActionTypes'

const initialState = false

const deleteSearchHistoryReducer = (state = initialState, { type }) => {
    switch (type) {
        case applicationActionTypes.DELETE_HISTORY:
            return !state
        default:
            return state
    }
}

export const deleteAction = () => {
    return {
        type: applicationActionTypes.DELETE_HISTORY,
    }
}

export default deleteSearchHistoryReducer
