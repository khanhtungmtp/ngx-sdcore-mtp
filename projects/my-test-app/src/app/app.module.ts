import { NgModule } from '@angular/core';
import { NgxFileUploadComponent, NgxMediaUploadComponent } from 'ngx-sdcore/media'
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ngx-sdcore/snotify';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxTrimInputDirective } from 'ngx-sdcore/common';
import { PrintModule } from 'ngx-sdcore/print';
import { PrintComponent } from './print/print.component';
@NgModule({
  declarations: [	
    AppComponent,
    NgxTrimInputDirective,
      PrintComponent
   ],
  imports: [
    BrowserModule,
    NgxFileUploadComponent,
    NgxMediaUploadComponent,
    NgxSpinnerModule,
    SnotifyModule,
    ModalModule.forRoot(),
    FormsModule, HttpClientModule,
    PrintModule
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
