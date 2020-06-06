import { Component, OnInit } from "@angular/core";
import { IPost } from "src/models/post.interface";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ActivatedRoute, Params } from "@angular/router";
import { map, switchMap, takeWhile } from "rxjs/operators";
import { mimeType } from "src/validators/mime-type.validator";
import { Store } from "@ngrx/store";
import * as postsListActions from "src/app/components/posts/+store/posts-lists-actions";
import * as fromApp from "src/app/+store/app.reducer";
import { Observable } from "rxjs";
import { State } from "../+store/posts-list.reducer";
@Component({
  selector: "app-post-create",
  templateUrl: "../post-create/post-create.component.html",
  styleUrls: ["../post-create/post-create.component.scss"],
})
export class PostCreateComponent implements OnInit {
  postsListState$: Observable<State>;
  postForm: FormGroup;
  enteredTitle = "";
  enteredContent = "";
  postId: string;
  post: IPost;
  imagePreview: string;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.postsListState$ = this.store.select("postsList");

    this.postForm = new FormGroup({
      title: new FormControl("", { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      content: new FormControl("", {
        validators: [Validators.required, Validators.minLength(5)],
      }),
    });

    this.route.params
      .pipe(
        takeWhile((params: Params) => params["id"]),
        map((params: Params) => params["id"]),
        switchMap((id: string) => {
          this.store.dispatch(new postsListActions.FetchPostInit(id));
          return this.store.select("postsList");
        }),
        map((postsListState) => postsListState.editedPost)
      )
      .subscribe((post) => {
        if (post) {
          this.post = post;
          this.postForm.patchValue(post);
          this.postForm.controls["image"].patchValue(post.imageUrl);
          this.imagePreview = post.imageUrl;
        }
      });
  }

  onImagePicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.controls["image"].patchValue(file);
    this.postForm.controls["image"].updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  };
  onAddPost = () => {
    if (!this.postForm.valid) {
      return;
    }
    if (this.post) {
      this.store.dispatch(
        new postsListActions.UpdatePost({
          post: { ...this.post, ...this.postForm.value },
          image: this.postForm.controls["image"].value,
        })
      );
    } else {
      this.store.dispatch(
        new postsListActions.CreatePost({
          post: { ...this.postForm.value },
          image: this.postForm.controls["image"].value,
        })
      );
    }
    this.postForm.reset();
    for (const key in this.postForm.controls) {
      this.postForm.controls[key].setErrors(null);
    }
  };
}
