import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: Routes = [
    {
      path: 'users',
      component: UsersComponent
    },
    {
      path: 'accounts',
      component: AccountsComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
