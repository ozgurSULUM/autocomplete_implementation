import rickAndMortyApi from "./RickAndMortyAPI";
import baseApi from './baseAPI';

const middleware = [
    rickAndMortyApi.middleware,
    baseApi.middleware
];

export default middleware;