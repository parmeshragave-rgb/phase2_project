import {
  FETCH_MOVIES_START,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_ERROR,
} from "./MoviesActions";

const initialState = {
  movies: [],
  loading: false,
  error: null,
};

export default function moviesReducer(state = initialState, action: any) {
  switch (action.type) {
    case FETCH_MOVIES_START:
      return { ...state, loading: true };
    case FETCH_MOVIES_SUCCESS:
      return { ...state, loading: false, movies: action.payload };
    case FETCH_MOVIES_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
