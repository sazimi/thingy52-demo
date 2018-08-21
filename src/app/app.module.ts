import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InfoCardComponent } from './info-card/info-card.component';
import { WebBluetoothModule, BrowserWebBluetooth } from './ble/public_api';

@NgModule({
  declarations: [
    AppComponent,
    InfoCardComponent
  ],
  imports: [
    BrowserModule,
    WebBluetoothModule.forRoot({
      enableTracing: true
    })
  ],
  providers: [
    BrowserWebBluetooth
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
