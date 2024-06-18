import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    set_search: false,
    search_value: '',
    tv_search_value: null,
    tv_search_value_typing: '',
}

const searchReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_SEARCH:
            return {
                ...state,
                set_search: payload,
            }
        case applicationActionTypes.SET_SEARCH_VALUE:
            return {
                ...state,
                search_value: payload,
            }
        case applicationActionTypes.SET_TV_SEARCH_VALUE:
            return {
                ...state,
                tv_search_value: payload,
            }
        case applicationActionTypes.SET_TV_SEARCH_TYPING_VALUE:
            return {
                ...state,
                tv_search_value_typing: payload,
            }
        default:
            return state
    }
}

export default searchReducer
