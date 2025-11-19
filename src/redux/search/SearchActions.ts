
import axios from "axios";
import type { Dispatch } from "redux";

export const SEARCH_REQUEST = "SEARCH_REQUEST" as const;
export const SEARCH_SUCCESS = "SEARCH_SUCCESS" as const;
export const SEARCH_FAILURE = "SEARCH_FAILURE" as const;

export interface SearchRequestAction {
  type: typeof SEARCH_REQUEST;
}

export interface SearchSuccessAction {
  type: typeof SEARCH_SUCCESS;
  payload: {
    docs: any[];
    hits: number;
    totalPages: number;
    page: number;
  };
}

export interface SearchFailureAction {
  type: typeof SEARCH_FAILURE;
  payload: string;
}

export type SearchActions =
  | SearchRequestAction
  | SearchSuccessAction
  | SearchFailureAction;

const API_KEY = import.meta.env.VITE_NYT_API_KEY;


const buildFQ = (topic?: string, keywords?: string[]) => {
  const parts: string[] = [];

  if (topic) parts.push(`section.name:("${topic}")`);

  if (keywords && keywords.length > 0) {
    const kw = keywords.map((k) => `desk:("${k}")`).join(" OR ");
    parts.push(`(${kw})`);
  }

  return parts.join(" AND ") || undefined;
};

export const fetchSearchArticles = (opts: {
  query: string;
  page: number;
  topic: string;
  keywords: string[];
  startDate: string;
  endDate: string;
}) => {
  return async (dispatch: Dispatch<SearchActions>) => {
    dispatch({ type: SEARCH_REQUEST });

    try {
      const { query, page, topic, keywords, startDate, endDate } = opts;

      const params: Record<string, any> = {
        "api-key": API_KEY,
        q: query.trim() || " ",
        page: Math.max(0, page - 1),
      };

      const fq = buildFQ(topic, keywords);
      if (fq) params.fq = fq;

      if (startDate) params.begin_date = startDate.replace(/-/g, "");
      if (endDate) params.end_date = endDate.replace(/-/g, "");

      const res = await axios.get(
        "https://api.nytimes.com/svc/search/v2/articlesearch.json",
        { params }
      );

      const docs = res.data.response?.docs || [];
      const hits = res.data.response?.metadata?.hits || 0;

      const totalPages = Math.min(Math.ceil(hits / 10), 100);

      dispatch({
        type: SEARCH_SUCCESS,
        payload: {
          docs,
          hits,
          totalPages,
          page,
        },
      });
    } catch (error: any) {
      dispatch({
        type: SEARCH_FAILURE,
        payload: error.message || "Search failed",
      });
    }
  };
};
