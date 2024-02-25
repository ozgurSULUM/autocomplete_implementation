import rickAndMortyApi from "./RickAndMortyAPI"

const reducers = {
    [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer
}

export default reducers;