import Api from "../../index";
import paths from "/src/constants/paths";
import { EPISODE } from "./tags";

const episodeEndpoint = Api.injectEndpoints({
    endpoints: (builder) => ({
        getAllEpisodes: builder.query<any, void>({
            query: ()=>({
                url: paths.EPISODE,
                method: "get"
            }),
            keepUnusedDataFor: 0,
            providesTags: [{type: EPISODE, id: "list"}]
        })
    })
})

export const { useGetAllEpisodesQuery } = episodeEndpoint;