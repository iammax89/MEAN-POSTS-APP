import { Component, OnInit } from "@angular/core";
import { IPost } from "src/models/post.interface";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "src/app/services/posts.service";
import { ActivatedRoute, Params } from "@angular/router";
import { map } from "rxjs/operators";
import { mimeType } from "src/validators/mime-type.validator";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-post-create",
  templateUrl: "../post-create/post-create.component.html",
  styleUrls: ["../post-create/post-create.component.scss"],
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  enteredTitle = "";
  enteredContent = "";
  postId: string;
  post: IPost;
  isLoading = false;
  imagePreview: string;
  imageDataUrl = environment.imageDataUrl;
  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.postsService.getError().subscribe((error) => {
      if (error) {
        this.isLoading = false;
      }
    });
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

    this.route.params.subscribe((params: Params) => {
      if (params["id"]) {
        this.postId = params["id"];
        this.postsService
          .getPost(this.postId)
          .pipe(
            map((data) => ({
              id: data["_id"],
              title: data["title"],
              content: data["content"],
              imageUrl: `${this.imageDataUrl}/${data["imageUrl"]}`,
              creator: data["creator"],
            }))
          )
          .subscribe((post: IPost) => {
            this.post = post;
            this.postForm.patchValue(this.post);
            this.postForm.controls["image"].patchValue(post.imageUrl);
            this.imagePreview = post.imageUrl;
          });
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
    this.isLoading = true;
    if (this.postId) {
      this.postsService.updatePost(
        { ...this.post, ...this.postForm.value },
        this.postForm.controls["image"].value
      );
    } else {
      const newPost = {
        ...this.postForm.value,
      };
      delete newPost.image;
      this.postsService.addPost(newPost, this.postForm.controls["image"].value);
    }
    this.postForm.reset();
    for (const key in this.postForm.controls) {
      this.postForm.controls[key].setErrors(null);
    }
  };
}
