import * as actions from "./posts-lists-actions";
import { IPost } from "src/models/post.interface";

export interface State {
  posts: IPost[];
  postsTotal: number;
  isLoading: boolean;
  error: string;
  editedPost: IPost;
}

const initialState: State = {
  posts: [],
  postsTotal: null,
  isLoading: false,
  error: null,
  editedPost: null,
};

export const postsListReducer = (
  state: State = initialState,
  action: actions.PostsListActions
) => {
  switch (action.type) {
    case actions.POSTS_FETCH_POST_INIT:
    case actions.POSTS_FETCH_POSTS_INIT:
    case actions.POSTS_DELETE_POST_INIT:
    case actions.POSTS_CREATE_POST:
    case actions.POSTS_UPDATE_POST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.POSTS_FETCH_POSTS_SUCCEED:
      return {
        ...state,
        isLoading: false,
        posts: action.payload.posts,
        postsTotal: action.payload.postsTotal,
      };
    case actions.POSTS_FETCH_POST_SUCCEED:
      return {
        ...state,
        isLoading: false,
        editedPost: action.payload,
      };
    case actions.POSTS_FETCH_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case actions.POSTS_DELETE_POST_SUCCEED:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
        isLoading: false,
      };
    default:
      return state;
  }
};
