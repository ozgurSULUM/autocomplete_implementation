import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import styles from "./styles.module.css";

import Autocomplete from "/src/components/Autocomplete";
import { useSearchCharacterQuery } from "/src/store/apis/RickAndMortyAPI/endpoints/character/endpoint";
import useDebouncedValue from "/src/hooks/useDebouncedValue";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const emptyArr: CharacterInfo[] = [];
const selectCharacters = createSelector(
  (result: any) => result.currentData,
  (data: SearchCharacterResponse) => {
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

  console.log("error", error);

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
