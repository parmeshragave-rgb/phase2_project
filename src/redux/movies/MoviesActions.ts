import axios from "axios";

const API_KEY = import.meta.env.VITE_NYT_API_KEY;

export const FETCH_MOVIES_START = "MOVIES/FETCH_START";
export const FETCH_MOVIES_SUCCESS = "MOVIES/FETCH_SUCCESS";
export const FETCH_MOVIES_ERROR = "MOVIES/FETCH_ERROR";

export const fetchAllMovies = () => async (dispatch: any) => {
  dispatch({ type: FETCH_MOVIES_START });

  try {
    const url = `https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=${API_KEY}`;

    const res = await axios.get(url);

    dispatch({
      type: FETCH_MOVIES_SUCCESS,
      payload: res.data?.results || [],
    });
  } catch (err) {
    dispatch({ type: FETCH_MOVIES_ERROR, payload: err });
  }
};
