export interface Pagination {
    page: number;
    size: number;
    sort: string;
}

export interface ResultInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface CharacterLocation {
    name: string,
    url: string
  }