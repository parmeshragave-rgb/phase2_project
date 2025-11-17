
import type {
  AuthAction,
 
} from "../actions/actions/authActions";

import  {
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_PROFILE,
} from "../actions/actions/authActions";
import type { AuthState } from "../../models/Auth";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export default function authReducer(
  state: AuthState = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };

    case LOGOUT:
      return initialState;

    case UPDATE_PROFILE:
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
}
