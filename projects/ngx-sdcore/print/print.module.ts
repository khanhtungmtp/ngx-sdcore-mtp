import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintComponent } from './print.component';
import { PrintDirective } from './print.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PrintComponent,
    PrintDirective
  ],
  exports: [
    PrintComponent,
    PrintDirective
  ]
})
export class PrintModule { }
