import * as actions from "./auth-actions";

export interface State {
  token: string;
  userId: string;
  authStatus: boolean;
  isLoading: boolean;
  error: string;
}

const initialState: State = {
  token: null,
  userId: null,
  authStatus: false,
  isLoading: false,
  error: null,
};

export const authReducer = (
  state = initialState,
  action: actions.AuthActions
) => {
  switch (action.type) {
    case actions.AUTH_SIGNUP_INIT:
    case actions.AUTH_LOGIN_INIT:
      return {
        ...state,
        isLoading: true,
      };
    case actions.AUTH_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        authStatus: true,
        isLoading: false,
        error: null,
      };
    case actions.AUTH_FAIL:
      return {
        ...state,
        authStatus: false,
        isLoading: false,
        error: action.payload,
      };
    case actions.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: null,
        authStatus: false,
      };
    default:
      return state;
  }
};
