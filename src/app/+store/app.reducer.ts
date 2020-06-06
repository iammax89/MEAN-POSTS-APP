import * as fromPostsList from "../components/posts/+store/posts-list.reducer";
import * as fromAuth from "../auth/+store/auth.reducer";
import { ActionReducerMap } from "@ngrx/store";

export interface AppState {
  postsList: fromPostsList.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  postsList: fromPostsList.postsListReducer,
  auth: fromAuth.authReducer,
};
