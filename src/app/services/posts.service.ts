import { Injectable } from "@angular/core";
import { IPost } from "src/models/post.interface";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  private posts: IPost[] = [];
  private postSubject = new Subject<IPost[]>();

  getPosts = () => {
    return [...this.posts];
  };

  getPostsUpdated = () => this.postSubject.asObservable();
  addPost = (post: IPost) => {
    this.posts.push(post);
    this.postSubject.next(this.posts);
  };
}
