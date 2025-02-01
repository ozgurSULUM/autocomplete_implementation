export interface CharacterInfo {
    id: number;
      name: string;
      status: string;
      species: string;
      type: string;
      gender: string;
      origin: CharacterLocation;
      location: CharacterLocation;
      image: string;
      episode: string[];
      url: string;
      created: string
}

export interface SearchCharacterResponse {
    info: ResultInfo;
    results: CharacterInfo[]
}