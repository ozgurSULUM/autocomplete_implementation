import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import allTags from "./endpoints/tags";


const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:5173/"}),
    endpoints: ()=>({}),
    tagTypes: allTags
})

export default baseApi;