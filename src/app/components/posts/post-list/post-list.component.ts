import { Component, OnInit, OnDestroy } from "@angular/core";
import { IPost } from "src/models/post.interface";
import { PostsService } from "src/app/services/posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-post-list",
  templateUrl: "../post-list/post-list.component.html",
  styleUrls: ["../post-list/post-list.component.scss"],
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: IPost[] = [];
  private postsSub: Subscription;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 5, 10, 25];
  isLoading = false;
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostsUpdated().subscribe(
      (response) => {
        this.posts = response.posts;
        this.totalPosts = response.totalPosts;
        this.isLoading = false;
      },
      (err) => console.log(err)
    );
  }
  onPageChange = (event: PageEvent) => {
    this.isLoading = true;
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  };
  onDeletePost = (id: string) => {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe((response: any) => {
      console.log(response.message);
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  };
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
