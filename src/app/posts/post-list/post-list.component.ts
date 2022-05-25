import {Component, /*Input,*/ OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
 // posts = [
   // {title: 'First Post', content: 'This is the first post content'},
   // {title: 'Second Post', content: 'This is the second post content'},
   //  {title: 'Third Post', content: 'This is the third post content'}
  //];
 //@Input()
 posts: Post[] = []; /**The Input@ make this post array bindable from the parent component via property binding.
 This is how we pass data from parent component to child component. Notice we import input from angular core. */
 isLoading = false;
 totalPosts = 0;
 postsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 5, 10];
 userAuthenticated = false
 userId: string;
 private postsSub: Subscription;
 private authStatusSub: Subscription;

 constructor(public postsService: PostsService,
    private authService: AuthService) {}
 ngOnInit(){
  this.isLoading = true;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
  this.userId = this.authService.getUserId();
   this.postsSub= this.postsService
    .getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number})=>{
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  this.userAuthenticated = this.authService.getUserAuth();
  this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(goodAuth => {
      this.userAuthenticated = goodAuth;
      this.userId = this.authService.getUserId();
    });
 }
 onChangedPage(pageData: PageEvent){
   //console.log(pageData);
   this.isLoading = true;
   this.currentPage = pageData.pageIndex + 1;
   this.postsPerPage = pageData.pageSize;
   this.postsService.getPosts(this.postsPerPage, this.currentPage);
 }

 onDelete(postId: string) {
   this.isLoading = true;
   this.postsService.deletePost(postId).subscribe(() => {
     this.postsService.getPosts(this.postsPerPage, this.currentPage);
   }, () => {
     this.isLoading = false;
   });
 }

 ngOnDestroy(){
   this.postsSub.unsubscribe();
   this.authStatusSub.unsubscribe()
 }

}
