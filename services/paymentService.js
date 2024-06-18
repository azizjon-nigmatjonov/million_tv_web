import axios from 'axios'
import { GET_GLOBAL_CARDS_LIST } from 'store/reducers/myCardsReducer'
import axiosReq from 'utils/axios'

// const PAYME_LINK = 'https://checkout.paycom.uz/api'
const PAYME_LINK = 'https://checkout.test.paycom.uz/api'
const xAuth = '635bf651f72e1b58066a820f'

export const sendCardData = async (id, cardNumber, cardExpire, save = true) => {
    return await axios.post(
        PAYME_LINK,
        {
            method: 'cards.create',
            params: {
                card: {
                    number: cardNumber,
                    expire: cardExpire,
                },
                save: save,
            },
        },
        {
            headers: {
                'X-Auth': xAuth,
            },
        },
    )
    // .then((res) => {
    //     return res?.data?.result
    // })
    // .catch((err) => console.log('sendCardData', err))
}
export async function getverifyCodePayme(id, token) {
    return await axios.post(
        PAYME_LINK,
        {
            id: id,
            method: 'cards.get_verify_code',
            params: {
                token: token,
            },
        },
        {
            headers: {
                'X-Auth': xAuth,
            },
        },
    )
}

export async function verifyCodePayme(id, token, code) {
    return await axios
        .post(
            PAYME_LINK,
            {
                id: id,
                method: 'cards.verify',
                params: {
                    token: token,
                    code: code,
                },
            },
            {
                headers: {
                    'X-Auth': xAuth,
                },
            },
        )
        .then((res) => {
            return res?.data
        })
        .catch((err) => console.log('verifyCodePayme:', err))
}

export const getAllPaymentCards = () => {
    return function (dispatch) {
        axiosReq
            .get('/payment/cards/list')
            .then((res) => {
                dispatch({
                    type: GET_GLOBAL_CARDS_LIST,
                    payload: res?.data?.cards,
                })
            })
            .catch((err) => console.log('getGlobalMyCards', err))
    }
}

export function saveCard(token) {
    // if (token == undefined) return
    return (dispatch) => {
        axiosReq
            .post('/payment/add-card', {
                token,
            })
            .then((res) => {
                console.log('saveCard', res?.data)
                dispatch(getAllPaymentCards())
            })
            .catch((err) => console.log('saveCard: ', err.data))
    }
}

export const deletePaymentCard = (token, SessionId, Authorization) => {
    return function (dispatch) {
        // axiosReq
        //     .delete('payment/remove-card', {
        //         token: token,
        //     })
        axios
            .delete(
                'https://test.api.spec.uzdigital.tv/v1/payment/remove-card',
                { token: token },
                {
                    headers: {
                        SessionId: SessionId,
                        Authorization: Authorization,
                    },
                },
            )
            .then((res) => {
                console.log('deletePaymentCard', res?.data)
                dispatch(getAllPaymentCards())
                return res?.data
            })
            .catch((err) => console.log('deletePaymentCard', err?.data?.Error))
    }
}

// function for render cards
export const addCard = async (
    cardInfo,
    setToken,
    setWait,
    setAddCardModal,
    setShowSms,
) => {
    if (cardInfo.card_number.includes('_') || cardInfo.card_exp.includes('_')) {
        return true
    } else {
        try {
            await sendCardData(
                'a61a8dad-30a6-41d9-98c2-e3bfdef784a1',
                cardInfo?.card_number,
                cardInfo?.card_exp,
                true,
            )
                .then((res) => {
                    setToken(res?.data?.result?.card?.token)
                    // close card number modal
                    try {
                        getverifyCodePayme(
                            'a61a8dad-30a6-41d9-98c2-e3bfdef784a1',
                            res?.data?.result?.card?.token,
                        )
                            .then((res) => {
                                setWait(res?.data?.result)
                            })
                            .catch((err) => {
                                'getverifyCodePayme', err
                            })
                    } catch {
                        console.log('getVerifyCode error')
                        // show error modal
                    }
                })
                .catch((err) => console.log('sendCardData', err))
            setAddCardModal(false)
            setShowSms(true)
        } catch {
            console.log('sendCardData error')
        }
    }
}
