import rickAndMortyApi from "./RickAndMortyAPI"
import baseApi from './baseAPI';

const reducers = {
    [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer
}

export default reducers;