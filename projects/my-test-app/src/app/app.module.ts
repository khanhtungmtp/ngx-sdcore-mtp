import { NgModule } from '@angular/core';
import { NgxFileUploadComponent, NgxMediaUploadComponent } from 'ngx-sdcore/media'
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ngx-sdcore/snotify';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxFileUploadComponent,
    NgxMediaUploadComponent,
    NgxSpinnerModule,
    SnotifyModule,
    ModalModule.forRoot()
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
