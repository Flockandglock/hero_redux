import { configureStore } from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';


// Если в enhancer мы могли менять весь стор, то здесь только сам диспетч, и в 1 фун-ии мы из стора получаем {dispatch, getStore}
const stringMiddleware = (store) => (dispatch) => (action) => {
    if (typeof action === 'string') {
        return dispatch({
            type: action
        })
    }
    return dispatch(action)
} 

// Вызываем фун-ию внутри фун-ии. Создаем новый стор и меняем в нем работы диспетча, потом возрващаем наш стор. После передаем эту фун-ию в качестве аргумента в другой стор. Все это мы делали для того, чтобы в dispatch("string") передавать строку, а не объект.
const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);
    // Сохроняем оригинальный диспетч, который принимал в себя только объект
    const oldDispathc = store.dispatch;
    // Мы взяли ориг диспетч и перезаписали его. 
    store.dispatch = (action) => {
        if (typeof action === 'string') {
            return oldDispathc({
                type: action
            })
        }
        return oldDispathc(action)
    }
    return store;
}

// Ипортируем ReduxThunk и добавляем его в стор. Он нужен, чтобы в диспатч мы могли передавать асинхронные фун-ии. В actions мы переносим функционал, по запросу на сервер (promise). 
// const store = createStore(combineReducers({heroes, filters}), 
//                 compose(applyMiddleware(ReduxThunk, stringMiddleware),
//                         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())       
// );

const store = configureStore({
    reducer: {heroes, filters},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV != 'production',
})

export default store;

