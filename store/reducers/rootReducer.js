import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import alertReducer from './alertReducer'
import applicationReducers from './applicationReducers'
import searchReducer from './searchReducer'
import recommendationReducer from './recommendationReducer'
import profilesReducer from './profilesReducer'
import categoriesReducer from './categoriesReducer'
import profileReducer from './profileReducer'
import notificationReducer from './notificationReducer'
import movieDataReducer from './movieDataReducer'
import moviesTabReducer from './moviesTabReducer'
import bannerReducer from './bannerReducer'
import genresReducer from './genresReducer'
import deleteSearchHistoryReducer from './listenReducer'

import yearsSingleReducer from './yearsSingleReducer'
import countriesSingleReducer from './countriesSingleReducer'
import yearsReducer from './yearsReducer'
import userBalanceReducer from './userBalanceReducer'
import myCardsReducer from './myCardsReducer'
import storedMovieReducer from './storedMovieReducer'
import registrationReducer from './registrationReducers'
import globalModalReducer from './websiteReducer'

const profilePersistConfig = {
    key: 'profile',
    storage,
}

const recommendPersistConfig = {
    key: 'recommend',
    storage,
}

const categoriesPersistConfig = {
    key: 'categories',
    storage,
}

const mainProfilePersistConfig = {
    key: 'mainProfile',
    storage,
}

const notificationPersistConfig = {
    key: 'notification',
    storage,
}

const bannerPersistConfig = {
    key: 'banner',
    storage,
}
const genresPersistConfig = {
    key: 'genres',
    storage,
}

const yearSinglePersistConfig = {
    key: 'single-year',
    storage,
}
const countrySinglePersistConfig = {
    key: 'single-country',
    storage,
}
const countriestPersistConfig = {
    key: 'single-country',
    storage,
}
const yearsPersistConfig = {
    key: 'years',
    storage,
}
const searchPersistConfig = {
    key: 'search',
    storage,
}
const userBalancePersistConfig = {
    key: 'user-balance',
    storage,
}

const rootReducer = combineReducers({
    application: applicationReducers,
    alert: alertReducer,
    myCardsReducer: myCardsReducer,
    searchReducer: searchReducer,
    recommend: persistReducer(recommendPersistConfig, recommendationReducer),
    profile: persistReducer(profilePersistConfig, profilesReducer),
    categories: persistReducer(categoriesPersistConfig, categoriesReducer),
    yearsSingleReducer: persistReducer(
        yearSinglePersistConfig,
        yearsSingleReducer,
    ),
    countriesSingleReducer: persistReducer(
        countrySinglePersistConfig,
        countriesSingleReducer,
    ),
    userBalanceReducer: persistReducer(
        userBalancePersistConfig,
        userBalanceReducer,
    ),
    mainProfile: persistReducer(mainProfilePersistConfig, profileReducer),
    yearsReducer: persistReducer(yearsPersistConfig, yearsReducer),
    notification: persistReducer(
        notificationPersistConfig,
        notificationReducer,
    ),
    genresReducer: persistReducer(genresPersistConfig, genresReducer),
    movieData: movieDataReducer,
    moviesTabCurrent: moviesTabReducer,
    bannerData: persistReducer(bannerPersistConfig, bannerReducer),
    storedMovie: storedMovieReducer,
    registrationData: registrationReducer,
    globalModal: globalModalReducer,
    deleteSearchHistory: deleteSearchHistoryReducer,
})

export default rootReducer
