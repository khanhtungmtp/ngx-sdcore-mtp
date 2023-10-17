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
@NgModule({
  declarations: [
    AppComponent,
    NgxTrimInputDirective
  ],
  imports: [
    BrowserModule,
    NgxFileUploadComponent,
    NgxMediaUploadComponent,
    NgxSpinnerModule,
    SnotifyModule,
    ModalModule.forRoot(),
    FormsModule, HttpClientModule,

  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
