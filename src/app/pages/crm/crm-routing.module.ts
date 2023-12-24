import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { ContactsComponent } from "./contacts/contacts.component";
import { DepositsComponent } from "./deposits/deposits.component";
import { CompaniesComponent } from "./companies/companies.component";
import { UsersComponent } from './users/users.component';
import { Users2Component } from './users2/users2.component';

const routes: Routes = [
  {
    path: "contacts",
    component: ContactsComponent
  },
  {
    path: "companies",
    component: CompaniesComponent
  },
  {
    path: 'deposits',
    component: DepositsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users2',
    component: Users2Component
  } 

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CRMRoutingModule {}
