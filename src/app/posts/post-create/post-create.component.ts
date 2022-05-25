import { Component, OnInit, OnDestroy, /*EventEmitter, Output */} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create'
  private postId: string;
  private authStatusSub: Subscription;


  //@Output()
  /*postCreated = new EventEmitter<Post>();/** Emitting events passes data from the child component to the parent
    comoponent. Output@ makes angular aware that this is an event to be listened from the outside (parent component).
    Notice that both EventEmitter and Output are libraries to be imported from angular core before they can be used */

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService){}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {validators: [Validators.required]
      }),

      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = "edit";
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData =>{
          this.isLoading = false;
          this.post = {
            id:postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });
        });
      }else {
        this.mode == "create";
        this.postId = null
      }
    });
  }

  onFileSelect(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();                //Image preview code start
    reader.onload = () => {                         //create imagePreview variable as string
      this.imagePreview = reader.result as string;  //create object of type FileReader
    };                                              // use object FileReader to read data URL and pass file
    reader.readAsDataURL(file);                     // Image preview code end
  }

  onSavePost(){
   //~Popup to alert user~ alert('Post Added Tony!');
  if (this.form.invalid){
    return;
  }
  this.isLoading = true;
  if (this.mode == "create"){
    this.postsService.addPost(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image);
    alert('Post Save Success!');
  }else{
    this.postsService.updatePost(
      this.postId,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image);
  }
  this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
