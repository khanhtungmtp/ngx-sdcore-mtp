import { Component } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { PrintService, Config } from './print.service';

@Component({
  selector: 'sd-print',
  template: `<ng-content></ng-content>`,
  exportAs: 'element'
})
export class PrintComponent {

  constructor(private prints: PrintService) { }

  /**
   * print
   * @param id
   * @param config
   * @returns
   */
  public print(id: string, config?: Config): AsyncSubject<any> {
    return this.prints.print(id, config);
  }
}
