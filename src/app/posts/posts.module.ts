import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; //So we can use ngModel
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // so angular recognizes import
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule {}
