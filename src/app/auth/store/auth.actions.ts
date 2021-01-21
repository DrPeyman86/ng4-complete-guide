import { Action } from "@ngrx/store";

//identifiers
//after adding auth.effects and handling async code for HTTP calls, you need more identifies to handle
//specific actions handled by your effects class
export const LOGIN_START = '[Auth] Login Start';
export const LOGIN = '[Auth] Login';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const LOGOUT = '[Auth] Logout';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(
    public payload: {
      email: string,
      userId: string,
      token: string,
      expirationDate: Date
    }){};
}

export class Logout implements Action {
  readonly type = LOGOUT;
  //we don't need a payload for this action because we would just set the userId to null.
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(
    public payload: {
      email: string,
      password: string
    }
  ) {}
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: string) {}
}

export type AuthActions = Login | Logout | LoginStart | LoginFail;//union type export your actions.
