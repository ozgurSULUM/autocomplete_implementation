interface Pagination {
    page: number;
    size: number;
    sort: string;
}

interface ResultInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

interface CharacterLocation {
    name: string,
    url: string
  }