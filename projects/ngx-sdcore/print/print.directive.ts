import { Directive, HostListener, Input } from '@angular/core';
import { PrintService } from './print.service';

@Directive({
  selector: '[print]'
})
export class PrintDirective {

  @Input() print: any[] = [];

  constructor(private prints: PrintService) { }

  /**
   * Print
   * @param event
   */
  @HostListener('click', ['$event']) onClick(event: any) {
    if (this.print && this.print.length === 1) {
      this.prints.print(this.print[0]);
    }
    if (this.print && this.print.length === 2) {
      this.prints.print(this.print[0], this.print[1]);
    }
  }

}
