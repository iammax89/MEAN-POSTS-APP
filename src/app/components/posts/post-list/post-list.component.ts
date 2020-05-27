import { Component, OnInit, OnDestroy } from "@angular/core";
import { IPost } from "src/models/post.interface";
import { PostsService } from "src/app/services/posts.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-post-list",
  templateUrl: "../post-list/post-list.component.html",
  styleUrls: ["../post-list/post-list.component.scss"],
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: IPost[] = [];
  private postsSub: Subscription;
  constructor(private postsService: PostsService) {}
  ngOnInit(): void {
    this.postsSub = this.postsService.getPostsUpdated().subscribe(
      (res: IPost[]) => (this.posts = res),
      (err) => console.log(err)
    );
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
