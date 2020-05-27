import { Component, OnInit } from "@angular/core";
import { IPost } from "src/models/post.interface";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "src/app/services/posts.service";

@Component({
  selector: "app-post-create",
  templateUrl: "../post-create/post-create.component.html",
  styleUrls: ["../post-create/post-create.component.scss"],
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  enteredTitle = "";
  enteredContent = "";

  constructor(private postsService: PostsService) {}
  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      content: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }
  onAddPost = () => {
    if (!this.postForm.valid) {
      return;
    }
    this.postsService.addPost({ ...this.postForm.value });
    this.postForm.reset();
    for (const key in this.postForm.controls) {
      this.postForm.controls[key].setErrors(null);
    }
  };
}
