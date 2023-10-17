import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Renderer2,
} from '@angular/core';
import { Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const TRIM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxTrimInputDirective),
  multi: true,
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'NgxTrimInput',
  providers: [TRIM_VALUE_ACCESSOR],
})
export class NgxTrimInputDirective implements ControlValueAccessor {
  @Input('NgxTrimInput') trimOn = 'focusout';
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  _onChange(_: any) { }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched() { }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: () => any): void {
    this._onTouched = fn;
  }
  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      const trimmedValue = value.replace(/\s+/g, ' ').trim();
      this._renderer.setProperty(
        this._elementRef.nativeElement,
        'value',
        trimmedValue
      );
    }
  }

  @HostListener('keyup', ['$event'])
  @HostListener('focusout', ['$event'])
  _onKeyUp(event: Event) {
    if (this.trimOn.includes(event.type)) {
      const element = <HTMLInputElement>event.target;
      const val = element.value.replace(/\s+/g, ' ').trim();
      this.writeValue(val);
      this._onChange(val);
    }
  }
}
