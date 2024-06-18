import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialCartState = {
    data: null,
}

const genresReducer = (state = initialCartState, action) => {
    const { payload } = action
    switch (action.type) {
        case applicationActionTypes.SET_GENRES:
            return {
                data: payload,
            }
        default:
            return state
    }
}

export default genresReducer
