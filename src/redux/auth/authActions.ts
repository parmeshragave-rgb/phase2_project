
import type { LoginSuccessPayload, User } from "../../models/Auth";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";


export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: LoginSuccessPayload;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}


export type AuthAction =
  | LoginSuccessAction
  | LogoutAction
 

export const loginSuccess = (user: User, token: string): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: { user, token },
});

export const logout = (): LogoutAction => ({
  type: LOGOUT,
});


