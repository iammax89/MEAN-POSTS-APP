import { Action } from "@ngrx/store";
import { IPost } from "src/models/post.interface";

export const POSTS_FETCH_POSTS_INIT = "[Posts] Fetch Posts Init";
export const POSTS_FETCH_POSTS_SUCCEED = "[Posts] Fetch Posts Succeed";

export const POSTS_FETCH_POST_INIT = "[Posts] Fetch Post Init";
export const POSTS_FETCH_POST_SUCCEED = "[Posts] Fetch Post Succeed";

export const POSTS_FETCH_FAIL = "[Posts] Fetch Posts Fail";

export const POSTS_CREATE_POST = "[Posts] Create Post";

export const POSTS_DELETE_POST_INIT = "[Posts] Delete Post Init";
export const POSTS_DELETE_POST_SUCCEED = "[Posts] Delete Post Succeed";

export const POSTS_UPDATE_POST = "[Posts] Update";

export class FetchPostsInit implements Action {
  readonly type = POSTS_FETCH_POSTS_INIT;
  constructor(public payload: { pageSize: number; currentPage: number }) {}
}
export class FetchPostsSucceed implements Action {
  readonly type = POSTS_FETCH_POSTS_SUCCEED;
  constructor(
    public payload: {
      posts: IPost[];
      postsTotal: number;
    }
  ) {}
}

export class FetchFail implements Action {
  readonly type = POSTS_FETCH_FAIL;
  constructor(public payload: string) {}
}

export class FetchPostInit implements Action {
  readonly type = POSTS_FETCH_POST_INIT;
  constructor(public payload: string) {}
}

export class FetchPostSucceed implements Action {
  readonly type = POSTS_FETCH_POST_SUCCEED;
  constructor(public payload: IPost) {}
}

export class CreatePost implements Action {
  readonly type = POSTS_CREATE_POST;
  constructor(public payload: { post: IPost; image: File }) {}
}

export class DeletePostInit implements Action {
  readonly type = POSTS_DELETE_POST_INIT;
  constructor(public payload: string) {}
}

export class DeletePostSucceed implements Action {
  readonly type = POSTS_DELETE_POST_SUCCEED;
  constructor(public payload: string) {}
}

export class UpdatePost implements Action {
  readonly type = POSTS_UPDATE_POST;
  constructor(
    public payload: {
      post: IPost;
      image?: File;
    }
  ) {}
}

export type PostsListActions =
  | FetchPostsInit
  | FetchPostsSucceed
  | FetchFail
  | FetchPostInit
  | FetchPostSucceed
  | CreatePost
  | DeletePostInit
  | DeletePostSucceed
  | UpdatePost;
