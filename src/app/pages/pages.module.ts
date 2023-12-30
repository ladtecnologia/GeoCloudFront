import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule, NgbProgressbarModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CountToModule } from 'angular-count-to';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SimplebarAngularModule } from 'simplebar-angular';

// Swiper Slider
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

import { LightboxModule } from 'ngx-lightbox';

// Load Icons
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { WidgetModule } from '../shared/widget/widget.module';


import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UsersComponent } from './users/users.component';
import { AccountsComponent } from './accounts/accounts.component';

@NgModule({
  declarations: [
    UsersComponent,
    AccountsComponent,
 ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    NgbProgressbarModule,
    FlatpickrModule.forRoot(),
    CountToModule,
    NgbTooltipModule,
    NgApexchartsModule,
    NgbTypeaheadModule,
    LeafletModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    SharedModule,
    WidgetModule,
    NgxUsefulSwiperModule,
    LightboxModule,
    PaginationModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
