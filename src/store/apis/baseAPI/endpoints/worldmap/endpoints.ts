import Api from "../..";

const worldMapService = Api.injectEndpoints({
    endpoints: (builder) => ({
        getWorldMapJsonData: builder.query<any, void>({
            query: ()=>({
                url: "custom.geo.json"
            })
        })
    })
})

export const { useGetWorldMapJsonDataQuery } = worldMapService;