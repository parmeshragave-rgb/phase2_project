
import type {AuthAction} from "./authActions";

import  {
  LOGIN_SUCCESS,
  LOGOUT,
} from "./authActions";
import type { AuthState } from "../../models/Auth";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export default function authReducer(state: AuthState = initialState,action: AuthAction
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


    default:
      return state;
  }
}
