import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { Store } from "@ngrx/store";
import * as postsListActons from "../+store/posts-lists-actions";
import * as fromApp from "src/app/+store/app.reducer";
import { State } from "../+store/posts-list.reducer";
import { State as AuthState } from "src/app/auth/+store/auth.reducer";
@Component({
  selector: "app-post-list",
  templateUrl: "post-list.component.html",
  styleUrls: ["post-list.component.scss"],
})
export class PostListComponent implements OnInit {
  postsListState$: Observable<State>;
  authState$: Observable<AuthState>;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25];
  isLoading = false;
  userId: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.authState$ = this.store.select("auth");
    this.store.dispatch(
      new postsListActons.FetchPostsInit({
        pageSize: this.postsPerPage,
        currentPage: this.currentPage,
      })
    );

    this.postsListState$ = this.store.select("postsList");
  }
  onPageChange = (event: PageEvent) => {
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.store.dispatch(
      new postsListActons.FetchPostsInit({
        pageSize: this.postsPerPage,
        currentPage: this.currentPage,
      })
    );
  };

  onDeletePost = (id: string) =>
    this.store.dispatch(new postsListActons.DeletePostInit(id));
}
