import { Injectable } from "@angular/core";
import { IPost } from "src/models/post.interface";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class PostsService {
  private posts: IPost[] = [];
  private postsCount: number;
  private postSubject = new Subject<{ posts: IPost[]; totalPosts: number }>();
  private apiUrl = environment.apiUrl + "/posts";
  private imageDataUrl = environment.imageDataUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getPosts = (pageSize: number, currentPage: number) => {
    const queryParams = `?pagesize=${pageSize}&page=${currentPage}`;
    this.http
      .get<any[]>(`${this.apiUrl}${queryParams}`)
      .pipe(
        map((data) => {
          const transformedPosts: IPost[] = data["posts"].map((post) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            imageUrl: `${this.imageDataUrl}/${post.imageUrl}`,
          }));
          data["posts"] = transformedPosts;
          return data;
        })
      )
      .subscribe((data) => {
        console.log(data["message"]);
        this.posts = data["posts"];
        this.postsCount = data["total"];
        this.postSubject.next({
          posts: [...this.posts],
          totalPosts: this.postsCount,
        });
      });
  };

  getPostsUpdated = () => this.postSubject.asObservable();

  addPost = (post: IPost, image: File) => {
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    postData.append("image", image);
    return this.http
      .post<{ message: string; post: any }>(this.apiUrl, postData)
      .subscribe((data) => {
        console.log(data.message);
        this.router.navigate(["/"]);
      });
  };
  deletePost = (id: string) => {
    return this.http.delete(`${this.apiUrl}/${id}`);
  };
  getPost = (id: string) => {
    return this.http.get(`${this.apiUrl}/${id}`);
  };

  updatePost = (post: IPost, image?: File) => {
    let postData: IPost | FormData;
    if (image) {
      postData = new FormData();
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("image", image);
    } else {
      postData = post;
    }
    return this.http
      .patch<any>(`${this.apiUrl}/${post.id}`, postData)
      .subscribe((res) => {
        console.log(res.message);
        this.router.navigate(["/"]);
      });
  };
}
