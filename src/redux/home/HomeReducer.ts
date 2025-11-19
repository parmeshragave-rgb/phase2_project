import {
  FETCH_TOP_STORIES,
  FETCH_SECTION_STORIES,
  FETCH_POPULAR_STORIES,
} from "./HomeActions"

import type { HomeActions } from "./HomeActions"

export interface NewsState {
  topStories: any[];
  sectionStories: Record<string, any[]>;
  popularStories: any[];
}

const initialState: NewsState = {
  topStories: [],
  sectionStories: {},
  popularStories: [],
};

export const NewsReducer = (
  state = initialState,
  action: HomeActions
): NewsState => {
  switch (action.type) {
    case FETCH_TOP_STORIES:
      return { ...state, topStories: action.payload };

    case FETCH_SECTION_STORIES:
      return { ...state, sectionStories: action.payload };

    case FETCH_POPULAR_STORIES:
      return { ...state, popularStories: action.payload };

    case "SET_SINGLE_SECTION":
      return {
        ...state,
        sectionStories: {
          ...state.sectionStories,
          [action.payload.section]: action.payload.stories,
        },
      };


    default:
      return state;
  }
};
