import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import allTags from "./endpoints/tags";


const rickAndMortyApi = createApi({
    reducerPath: "rickAndMortApi",
    baseQuery: fetchBaseQuery({baseUrl: "https://rickandmortyapi.com/api/"}),
    endpoints: ()=>({}),
    tagTypes: allTags
})

export default rickAndMortyApi;