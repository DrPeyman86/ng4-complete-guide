import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

//have an interface that defines the user object
export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

//a reducer always has an initial state.
const initialState = {
  user: null,
  authError: null,
  loading: false
};

//a reducer is just a function that gets an state and action and returns a state.
//in case the state is not provided, which would be initially, use the initialState
export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  //return state;
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,//always return the current state.
        authError: null,
        user: user,//then return the new state
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null//just want to clear the user.
      };
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      }
    default:
      return state;
  }

}
