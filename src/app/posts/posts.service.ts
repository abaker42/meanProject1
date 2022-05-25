import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + '/posts/';


@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();


constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    this.http
    .get<{message: string, posts: any, maxPosts: number }>( //On the frontend our post.model expects an id w/o an '_', but getting
      BACKEND_URL   //actual objects from the DB the id = _id. How do we fix this? By
      + queryParams                       //converting the data we get back from the server before we subscribe.
    ).pipe(map((postData) => {             //We convert this data using the .pipe() method, a built in observable method
      return { posts: postData.posts.map(post => { //Inside the pipe() we must import and pass the map operator form 'rxjs.operator'
        return {                          //Inside map() pass your res Data and execute a callback funtion that returns
          title: post.title,              //your array of posts. The use map operator pass a single object post and on the
          content: post.content,          //callback function define its fields that will be sent to client
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }),
      maxPosts: postData.maxPosts
    };
    }))
    .subscribe((mutatedPostData) => {
      //console.log(mutatedPostData);//test to see what data we're getting
      this.posts = mutatedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: mutatedPostData.maxPosts});
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }
  /**Observables allow us to emit data and listening to that data in different places of an application.
   * With this we can subscribe to certain updates or changes and push these changes from a totally differnt
   * place. The observer subscribes to the ovservable and there are three methods that they can call:
   * next() error() complete(). These can be very useful when wrapping http requests.
   *
   * A subject is a special kind of observable; it's more active and allows us to manually call next().
   */
  getPost(id: string){
    return this.http.get<{
      _id: string;
      title: string;
      content:string,
      imagePath: string,
      creator: string
    }>(
      BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File){
    //const post: Post={id: null, title: title, content: content}; ~no longer sending json data
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
    .post<{ message: string, post: Post }>(
      BACKEND_URL,
      postData)
    .subscribe(responseData => {
      this.router.navigate(['/']);
    });

  }
                          //or post: Post
  updatePost(id: string, title: string, content: string, image: File | string){
   // const post: Post = {id: id, title:title, content:content, imagePath:null}
   let postData: Post | FormData;
   if (typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
   this.http.put(BACKEND_URL+ id, postData)
    .subscribe(response => {
      console.log(response);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string){
    return this.http
      .delete(BACKEND_URL + postId);
  }
}
