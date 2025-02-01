import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import styles from "./styles.module.css";

import { useSearchCharacterQuery } from "../../store/apis/RickAndMortyAPI/endpoints/character/endpoints";
import useDebouncedValue from "/src/hooks/useDebouncedValue";

import Autocomplete from "/src/components/Autocomplete";

import { CharacterAutocompleteProps } from "./types";
import { CharacterInfo } from "/rick-and-morty/api/character/types";
import { SearchCharacterResponse } from "/rick-and-morty/api/character/types";
import type { TypedUseQueryStateResult } from "@reduxjs/toolkit/query/react";

const emptyArr: CharacterInfo[] = [];
const selectCharacters = createSelector(
  (result: TypedUseQueryStateResult<SearchCharacterResponse, any, any>) =>
    result.currentData,
  (data: SearchCharacterResponse | undefined): CharacterInfo[] => {
    return data && data.results.length > 0 ? data.results : emptyArr;
  }
);

const CharacterAutocomplete = (props: CharacterAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");

  useDebouncedValue(inputValue, 250, () => setQuery(inputValue));

  const { characters, isLoading, isUninitialized, isFetching, error, isError } =
    useSearchCharacterQuery(query, {
      skip: !query,
      selectFromResult: (result) => ({
        ...result,
        characters: selectCharacters(result),
      }),
    });

  return (
    <Autocomplete
      {...props}
      options={characters}
      inputValue={inputValue}
      isLoading={isFetching || isLoading}
      isEmpty={
        isError
          ? (error as FetchBaseQueryError).status === 404
          : isUninitialized
      }
      isUninitialized={isUninitialized}
      onInputValueChange={(value) => {
        setInputValue(value || "");
      }}
      getOptionLabel={(option) => option.name}
      onClose={() => {
        setQuery("");
      }}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      renderOption={(option, isSelected, props) => {
        const matches = match(option.name, query, {
          insideWords: false,
        });
        const parts = parse(option.name, matches);

        return (
          <li {...props}>
            <input
              readOnly
              type="checkbox"
              checked={isSelected}
              className={styles.characterAutocompleteListInput}
            />
            <div className={styles.characterAutocompleteListContent}>
              <img width="48px" height="48px" src={option.image} />
              <div className={styles.characterAutocompleteListContentText}>
                <span className={styles.characterAutocompleteListContentName}>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 500,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </span>
                <span
                  className={styles.characterAutocompleteListContentEpisode}
                >
                  {`${option.episode.length} Episodes`}
                </span>
              </div>
            </div>
          </li>
        );
      }}
    />
  );
};

export default CharacterAutocomplete;
