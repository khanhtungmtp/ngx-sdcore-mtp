import { Component } from '@angular/core';
import { PrintService } from 'ngx-sdcore/print';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent {

  constructor(public print: PrintService) { }

  public config = {
    printMode: 'template-popup', // template
    popupProperties: 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes',
    pageTitle: 'Hello World',
    templateString: '<header>I\'m part of the template header</header>{{printBody}}<footer>I\'m part of the template footer</footer>',
    stylesheets: [{ rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' }],
    styles: ['td { border: 1px solid black; color: green; }', 'table { border: 1px solid black; color: red }', 'header, table, footer { margin: auto; text-align: center; }']
  }

  onPrint3(id: string) {
    this.print.print(id, { ...this.config, printMode: 'template' }).subscribe(console.log)
  }

}
