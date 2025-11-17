
import type { LoginSuccessPayload, User } from "../../../models/Auth";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const UPDATE_PROFILE = "UPDATE_PROFILE";

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: LoginSuccessPayload;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface UpdateProfileAction {
  type: typeof UPDATE_PROFILE;
  payload: Partial<User>;
}

export type AuthAction =
  | LoginSuccessAction
  | LogoutAction
  | UpdateProfileAction;

export const loginSuccess = (user: User, token: string): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: { user, token },
});

export const logout = (): LogoutAction => ({
  type: LOGOUT,
});

export const updateProfile = (
  payload: Partial<User>
): UpdateProfileAction => ({
  type: UPDATE_PROFILE,
  payload,
});
