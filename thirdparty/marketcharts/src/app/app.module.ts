import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MarketChartModule } from "./marketchart";
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MarketChartModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
