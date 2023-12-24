import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Ng Select
import { NgSelectModule } from '@ng-select/ng-select';

// Load Icons
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Component pages
import { CRMRoutingModule } from './crm-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ContactsComponent } from './contacts/contacts.component';
import { CompaniesComponent } from './companies/companies.component';

import { SortByCrmPipe } from "../crm/sort-by.pipe";
// sortable
import { NgbdCompaniesSortableHeader } from './companies/companies-sortable.directive';
import { NgbdContactsSortableHeader } from './contacts/contacts-sortable.directive';
import { NgbdDepositsSortableHeader } from './deposits/deposits-sortable.directive';
import { NgbdUsersSortableHeader } from './users2/users2-sortable.directive';

import { DatePipe } from '@angular/common';

import { DepositsComponent } from './deposits/deposits.component';
import { UsersComponent } from './users/users.component';
import { Users2Component } from './users2/users2.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    ContactsComponent,
    CompaniesComponent,
    DepositsComponent,
    UsersComponent,
    Users2Component,
    SortByCrmPipe,
    NgbdCompaniesSortableHeader,
    NgbdContactsSortableHeader,
    NgbdDepositsSortableHeader,
    NgbdUsersSortableHeader
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FlatpickrModule,
    NgSelectModule,
    CRMRoutingModule,
    SharedModule,
    PaginationModule.forRoot()
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
