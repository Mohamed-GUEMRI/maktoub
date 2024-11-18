import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent {
  createArticleForm: FormGroup;
  categories = [
    { name: 'Technology', id: 1 },
    { name: 'Business & Finance', id: 4 },
    { name: 'Politics & Society', id: 5 },
    { name: 'Culture & Arts', id: 6 },
    { name: 'Science & Innovation', id: 7 },
    { name: 'Health & Wellness', id: 8 },
    { name: 'Travel & Adventure', id: 11 },
    { name: 'Personal Development', id: 12 }
  ];
  
  tags: string[] = [];
  Published: boolean = false;
  step: number = 1;
  content: string = '';
  authorId:any =0;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router
  ) {
    this.createArticleForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      content: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authorId = localStorage.getItem("userid");
  }

  nextStep(): void {
    if (this.isStep1Valid()) {
      this.step = 2;
    } else {
      this.createArticleForm.markAllAsTouched();
    }
  }

  isStep1Valid() {
    return this.createArticleForm.get('title')?.valid && 
           this.createArticleForm.get('content')?.valid;
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  addTag(tagInput: HTMLInputElement): void {
    const tag = tagInput.value.trim().toLowerCase(); // Normalize tags to lowercase
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
    tagInput.value = '';
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit(isPublished: boolean): void {
    if (this.createArticleForm.valid) {
      const articleRequest = {
        authorId: this.authorId, 
        title: this.createArticleForm.get('title')?.value,
        subtitle: this.createArticleForm.get('subtitle')?.value,
        content: this.createArticleForm.get('content')?.value,
        isPublished: isPublished,
        categoryId: this.createArticleForm.get('category')?.value,
        tags: this.tags // Add tags to the request
      };

      this.articleService.addArticle(articleRequest).subscribe({
        next: (response: any) => {
          if (isPublished) {
            this.router.navigate(['/articles', response.id]);
          } else {
            alert('Draft saved successfully!');
            this.router.navigate(['/drafts']); // Optional: navigate to drafts page
          }
        },
        error: (error) => {
          console.error('Error creating article:', error);
          alert('Failed to create article. Please try again.');
        }
      });
    } else {
      this.createArticleForm.markAllAsTouched();
    }
  }
}