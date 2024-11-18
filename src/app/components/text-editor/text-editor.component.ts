import { Component, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]
})
export class TextEditorComponent implements ControlValueAccessor {
  @ViewChild('editorContent') editorContent!: ElementRef;
  
  currentLanguage: string = 'en';
  isRTL: boolean = false;
  textDirection: 'ltr' | 'rtl' = 'ltr';
  
  // Keep track of the content
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  formatText(command: string) {
    document.execCommand(command, false);
    // Trigger onChange after formatting to update form value
    if (this.editorContent) {
      this.onChange(this.editorContent.nativeElement.innerHTML);
    }
  }

  onContentChange(event: Event) {
    const editor = event.target as HTMLElement;
    this.onChange(editor.innerHTML);
    this.onTouched();
  }

  onLanguageChange() {
    this.isRTL = this.currentLanguage === 'ar';
    this.textDirection = this.isRTL ? 'rtl' : 'ltr';
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    // When the form sets a value, update the editor content
    if (this.editorContent && this.editorContent.nativeElement) {
      this.editorContent.nativeElement.innerHTML = value || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.editorContent && this.editorContent.nativeElement) {
      this.editorContent.nativeElement.contentEditable = !isDisabled;
    }
  }
}