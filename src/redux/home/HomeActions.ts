import axios from "axios";
import type { Dispatch } from "redux";

export const FETCH_TOP_STORIES = "FETCH_TOP_STORIES" as const;
export const FETCH_SECTION_STORIES = "FETCH_SECTION_STORIES" as const;
export const FETCH_POPULAR_STORIES = "FETCH_POPULAR_STORIES" as const;
export const SET_SINGLE_SECTION = "SET_SINGLE_SECTION" as const;


export interface FetchTopStoriesAction {
  type: typeof FETCH_TOP_STORIES;
  payload: any[];
}

export interface FetchSectionStoriesAction {
  type: typeof FETCH_SECTION_STORIES;
  payload: Record<string, any[]>;
}

export interface FetchPopularStoriesAction {
  type: typeof FETCH_POPULAR_STORIES;
  payload: any[];
}

export type HomeActions =
  | FetchTopStoriesAction
  | FetchSectionStoriesAction
  | FetchPopularStoriesAction;

const API_KEY = import.meta.env.VITE_NYT_API_KEY;

export const fetchTopStories = () => {
  return async (dispatch: Dispatch<HomeActions>) => {
    const res = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/home.json`,
      { params: { "api-key": API_KEY } }
    );

    dispatch({
      type: FETCH_TOP_STORIES,
      payload: res.data.results.slice(0, 6),
    });
  };
};

export const fetchSectionStories = (sections: string[]) => {
  return async (dispatch: Dispatch<HomeActions>) => {
    const data: Record<string, any[]> = {};

    await Promise.all(
      sections.map((section) =>
        axios
          .get(
            `https://api.nytimes.com/svc/topstories/v2/${section}.json`,
            { params: { "api-key": API_KEY } }
          )
          .then((res) => {
            data[section] = res.data.results.slice(0, 6);
          })
          .catch(() => {
            data[section] = [];
          })
      )
    );

    dispatch({
      type: FETCH_SECTION_STORIES,
      payload: data,
    });
  };
};

export const fetchPopularStories = () => {
  return async (dispatch: Dispatch<HomeActions>) => {
    const res = await axios.get(
      `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json`,
      { params: { "api-key": API_KEY } }
    );

    dispatch({
      type: FETCH_POPULAR_STORIES,
      payload: res.data.results.slice(0, 10),
    });
  };
};

export const fetchSingleSection = (section: string) => async (dispatch: any) => {
  try {
    const url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${API_KEY}`;
    const { data } = await axios.get(url);

    dispatch({
      type: SET_SINGLE_SECTION,
      payload: { section, stories: data.results },
    });
  } catch (e) {
    console.log("Error loading section:", e);
  }
};