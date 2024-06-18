import { getAllPaymentCards } from 'services/paymentService'

export const SHOW_GLOBAL_MODAL_CARD = 'SHOW_GLOBAL_MODAL_CARD'
export const HIDE_GLOBAL_MODAL_CARD = 'HIDE_GLOBAL_MODAL_CARD'
export const GET_GLOBAL_CARDS_LIST = 'GET_GLOBAL_CARDS_LIST'

const INITIAL_STATE = {
    globalCardModal: false,
    cards: [],
}

export default function myCardsReducer(
    state = INITIAL_STATE,
    { type, payload },
) {
    switch (type) {
        case SHOW_GLOBAL_MODAL_CARD:
            return {
                ...state,
                globalCardModal: true,
            }
        case HIDE_GLOBAL_MODAL_CARD:
            return {
                ...state,
                globalCardModal: false,
            }
        case GET_GLOBAL_CARDS_LIST:
            return {
                ...state,
                cards: payload,
            }
        default:
            return state
    }
}

export const showCardModal = (open) => {
    if (open == SHOW_GLOBAL_MODAL_CARD) {
        return {
            type: SHOW_GLOBAL_MODAL_CARD,
            payload: {},
        }
    } else if (open == HIDE_GLOBAL_MODAL_CARD) {
        return {
            type: HIDE_GLOBAL_MODAL_CARD,
            payload: {},
        }
    } else {
        return
    }
}
