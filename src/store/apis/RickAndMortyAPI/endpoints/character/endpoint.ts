import Api from "../../index";
import paths from "/src/constants/paths";

import { CHARACTER } from "./tags";

const characterEndpoint = Api.injectEndpoints({
    endpoints: (builder) => ({
        searchCharacter: builder.query<SearchCharacterResponse, string>({
            query: (queryStr)=>({
                url: paths.CHARACTER,
                params: {name: queryStr}
            }),
            keepUnusedDataFor: 0,
            providesTags: (result) =>
            result && result.results
              ? [
                  ...result.results.map(({ id }: {id: number}) => ({ type: CHARACTER, id })),
                  { type: CHARACTER, id: 'LIST' },
                ]
              : [{ type: CHARACTER, id: 'LIST' }],
        })
    })
})

export const { useSearchCharacterQuery } = characterEndpoint;