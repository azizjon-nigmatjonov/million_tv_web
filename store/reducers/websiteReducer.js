import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    global_modal: { type: '' },
}

const globalModalReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.GLOBAL_MODAL:
            return {
                global_modal: payload,
            }
        default:
            return state
    }
}

export default globalModalReducer
