import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import * as actions from "./posts-lists-actions";
import { switchMap, map, catchError, tap } from "rxjs/operators";
import { IPost } from "src/models/post.interface";
import { of } from "rxjs";
@Injectable()
export class PostsListsEffects {
  private apiUrl = environment.apiUrl + "/posts";
  private imageDataUrl = environment.imageDataUrl;

  @Effect()
  getPosts$ = this.actions$.pipe(
    ofType(actions.POSTS_FETCH_POSTS_INIT),
    switchMap((query: actions.FetchPostsInit) => {
      const queryParams = `?pagesize=${query.payload.pageSize}&page=${query.payload.currentPage}`;
      return this.http.get(`${this.apiUrl}${queryParams}`).pipe(
        tap((data: any) => console.log(data.message)),
        map((data) => {
          const transformedPosts: IPost[] = data["posts"].map((post) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            imageUrl: `${this.imageDataUrl}/${post.imageUrl}`,
            creator: post.creator,
          }));
          data["posts"] = transformedPosts;
          return data;
        }),
        map(
          (data) =>
            new actions.FetchPostsSucceed({
              posts: data["posts"],
              postsTotal: data["total"],
            })
        ),
        catchError((err) => of(new actions.FetchFail(err.error.message)))
      );
    })
  );

  @Effect()
  getPost$ = this.actions$.pipe(
    ofType(actions.POSTS_FETCH_POST_INIT),
    switchMap((query: actions.FetchPostInit) => {
      return this.http.get(`${this.apiUrl}/${query.payload}`).pipe(
        tap((data: any) => console.log(data.message)),
        map((data) => ({
          id: data.post["_id"],
          title: data.post["title"],
          content: data.post["content"],
          imageUrl: `${this.imageDataUrl}/${data.post["imageUrl"]}`,
          creator: data.post["creator"],
        })),
        map((post: IPost) => new actions.FetchPostSucceed(post)),
        catchError((err) => of(new actions.FetchFail(err.error.message)))
      );
    })
  );

  @Effect()
  updatePost$ = this.actions$.pipe(
    ofType(actions.POSTS_UPDATE_POST),
    switchMap((action: actions.UpdatePost) => {
      let postData: IPost | FormData;
      if (action.payload.image) {
        postData = new FormData();
        postData.append("title", action.payload.post.title);
        postData.append("content", action.payload.post.content);
        postData.append("image", action.payload.image);
      } else {
        postData = action.payload.post;
      }
      return this.http.patch<any>(
        `${this.apiUrl}/${action.payload.post.id}`,
        postData
      );
    }),
    tap((res) => console.log(res.message)),
    tap(() => this.router.navigate(["/"])),
    map(() => ({ type: "DUMMY" })),
    catchError((err) => of(new actions.FetchFail(err.error.message)))
  );

  @Effect()
  createPost$ = this.actions$.pipe(
    ofType(actions.POSTS_CREATE_POST),
    switchMap((action: actions.CreatePost) => {
      const postData = new FormData();
      postData.append("title", action.payload.post.title);
      postData.append("content", action.payload.post.content);
      postData.append("image", action.payload.image);
      return this.http.post<{ message: string; post: any }>(
        this.apiUrl,
        postData
      );
    }),
    tap((res) => console.log(res.message)),
    tap(() => this.router.navigate(["/"])),
    map(() => ({ type: "DUMMY" })),
    catchError((err) => of(new actions.FetchFail(err.error.message)))
  );

  @Effect()
  deletePost$ = this.actions$.pipe(
    ofType(actions.POSTS_DELETE_POST_INIT),
    switchMap((action: actions.DeletePostInit) => {
      return this.http.delete<{ message: string; id: string }>(
        `${this.apiUrl}/${action.payload}`
      );
    }),
    map((res) => {
      console.log(res.message);
      return new actions.DeletePostSucceed(res.id);
    }),
    catchError((err) => of(new actions.FetchFail(err.error.message)))
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
