// src/redux/search/SearchReducer.ts
import {
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
} from "./SearchActions";

import type{SearchActions} from "./SearchActions";

export interface SearchState {
  articles: any[];
  loading: boolean;
  noResult: boolean;
  page: number;
  totalPages: number;
  error: string | null;
}

const initialState: SearchState = {
  articles: [],
  loading: false,
  noResult: false,
  page: 1,
  totalPages: 1,
  error: null,
};

const SearchReducer = (
  state: SearchState = initialState,
  action: SearchActions
): SearchState => {
  switch (action.type) {
    case SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        noResult: false,
      };

    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        articles: action.payload.docs,
        noResult: action.payload.docs.length === 0,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        articles: [],
        noResult: true,
      };

    default:
      return state;
  }
};

export default SearchReducer;
