import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

import { Account } from 'src/app/models/Account';
import { AccountService } from 'src/app/services/account.service';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';

import { Subject, debounceTime } from 'rxjs';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  providers: [AccountService]
})
export class AccountsComponent {

  // FORM MAIN ************************************************************************************

  public breadCrumbItems!: Array<{}>;
  public accounts: Account[] = [];
  public term = '';
  public termoBuscaChanged: Subject<string> = new Subject<string>();
  public pagination = {} as Pagination;
  public sortField = 'id';
  public sortReverse = false;
  public masterSelected!: boolean; 
  public checkedValGet: number[] = [];
  
  public account = {} as Account;
  public accountForm!: FormGroup;
  public modeForm: string = '';
  public  submitted = false;
  get f(): any {
    return this.accountForm.controls;
  }

  constructor(
    private accountService : AccountService,
    private modalService: NgbModal,
    public fb: FormBuilder
    ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Accounts', active: true }
    ];
    this.pagination = {currentPage: 1, pageSize: 8, totalCount: 1, totalPages:1} as Pagination;
    this.getAccounts();
  }

  // GET and VIEW *********************************************************************************

  public getAccounts(): void {
    this.accountService.get(this.pagination.currentPage, 
                            this.pagination.pageSize,
                            this.term,
                            this.sortField,
                            this.sortReverse).subscribe({
      next: (paginatedResult: PaginatedResult<Account[]>) => {
        this.accounts = paginatedResult.result!;
        this.pagination = paginatedResult.pagination!;
        this.viewAccount(this.accounts[0].id!);
      },
      error: (error: any) => {
        console.error(error);
        this.msg('error');
      }
    })
  }

  public viewAccount(id: any) {
    if (id > 0) {
      this.accountService.getById(id).subscribe({
        next: (res: Account) => {
          (document.getElementById('__name') as HTMLImageElement).innerHTML                = res.name!;
          (document.getElementById('__company') as HTMLImageElement).innerHTML             = res.company!;
          (document.getElementById('_name') as HTMLImageElement).innerHTML                 = res.name! + ' - ' + res.id!;
          (document.getElementById('_company') as HTMLImageElement).innerHTML              = res.company!;
          (document.getElementById('_acessMaxAttempts') as HTMLImageElement).innerHTML     = String(res.acessMaxAttempts!);
          (document.getElementById('_validityUserPassword') as HTMLImageElement).innerHTML = String(res.validityUserPassword!);
          (document.getElementById('_validInviteUser') as HTMLImageElement).innerHTML      = String(res.validInviteUser!);
          (document.getElementById('_validInviteProject') as HTMLImageElement).innerHTML   = String(res.validInviteProject!);
        },
        error: (error: any) => {
          console.error(error);
          this.msg('error');
        }
      })
    }
  }

  // FILTER, ORDER, PAGINATED and EXPORT *********************************************************

  public filterAccounts(evt: any) : void {
    if (this.termoBuscaChanged.observers.length == 0){
      this.termoBuscaChanged.pipe(debounceTime(400)).subscribe({
        next: (term) => {
          this.pagination.currentPage = 1;
          this.term = term;
          this.getAccounts();
        }
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public OrderByChange() {
    this.sortReverse = false;
    this.getAccounts(); 
  }

  public OrderByColumn(sortField: string) {
    if(sortField == this.sortField) 
      { this.sortReverse = !this.sortReverse; }
    else 
      { this.sortReverse = false; }
    this.sortField = sortField;
    this.getAccounts(); 
  }

  public pageChanged(event: any): void {
    if (this.pagination.currentPage != event.page) {
      this.pagination.currentPage = event.page;
      this.getAccounts();
    }
  }

  public showingEntries(): string{
    var x: number = 1 + (this.pagination.currentPage! -1 ) * (this.pagination.pageSize!);
    var y: number = x + (this.pagination.pageSize!) - 1;
    var z: number = this.pagination.totalCount!;
    if (x > z) { x = z};
    if (y > z) { y = z};
    return "Showing entries " + x +  " to " + y + " of " + z;
  }

  public csvFileExport() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Account Data',
      useBom: true,
      noDownload: false,
      headers:["id", "name", "company", "acessMaxAttempts", "validityUserPassword", "validInviteUser", "validInviteProject"]  
    };
    new ngxCsv(this.accounts, "Accounts", options);
  }
  
  // CHECK BOX ************************************************************************************

  public checkUncheckAll(ev: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = this.masterSelected;
    }
    this.masterSelected ? 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "none"; 
  }

  public onCheckboxChange(e: any) {
    var someCheck: boolean = false;
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked == true) {
        someCheck = true;
        break;
      }
    }
    someCheck ? 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }  

  // DELETE ***************************************************************************************

  public confirm(content: any, id: any) {
    this.checkedValGet = [];
    this.checkedValGet.push(id);
    this.modalService.open(content, { centered: true });
  }

  public deleteMultiple(content: any) {
    this.checkedValGet = [];
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        this.checkedValGet.push(checkboxes[i].value);
      }
    }
    if (this.checkedValGet.length > 0) {
      this.modalService.open(content, { centered: true });
    }
  }

  public delete() {
    this.checkedValGet.forEach((i: any) => {
    console.log(i);
      this.accountService.delete(i).subscribe({
        next: (res: any) => {  
          this.getAccounts();          
        },
        error: (error: any) => {
          console.error(error);
        }
      })
    });
    (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }
        
  // FORM MODAL - ADD / EDIT **********************************************************************

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid' : campoForm.errors && campoForm.touched};
  }

  private validation(): void {
    this.accountForm = this.fb.group({
      id                  : [''],
      name                : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      company             : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      acessMaxAttempts    : ['', [Validators.required, Validators.min(2),  Validators.max(10)]],
      validityUserPassword: ['', [Validators.required, Validators.min(10), Validators.max(90)]],  
      validInviteUser     : ['', [Validators.required, Validators.min(2),  Validators.max(30)]],     
      validInviteProject  : ['', [Validators.required, Validators.min(2),  Validators.max(30)]], 
    });
  }

  public modalPost(content: any): void {
    this.modeForm = 'post'; 
    this.modalService.open(content, { size: 'md', centered: true });
    this.validation();
   }

  public modalPut(id: any, content: any): void {
    this.modeForm = 'put';
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    //Change Title and Button
    var modelTitle = document.getElementById('modalTitle') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Account';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = 'Update';
    if (id > 0) {
      this.accountService.getById(id).subscribe({
        next: (account: Account) => {
          this.accountForm.controls['id'].setValue(account.id);
          this.accountForm.controls['name'].setValue(account.name);
          this.accountForm.controls['company'].setValue(account.company);
          this.accountForm.controls['acessMaxAttempts'].setValue(account.acessMaxAttempts);
          this.accountForm.controls['validityUserPassword'].setValue(account.validityUserPassword);
          this.accountForm.controls['validInviteUser'].setValue(account.validInviteUser);
          this.accountForm.controls['validInviteProject'].setValue(account.validInviteProject);
        },
        error: (error: any) => {
          console.error(error);
        }
      });
      this.validation();
    }
  }

  public save(): void {
    if (this.accountForm.valid){
      this.account = {...this.accountForm.value};
      if (this.modeForm == 'post') {
        this.account.id = 0;
        this.accountService.post(this.account).subscribe({
          next: (res: any) => {
            this.modalService.dismissAll();
            this.getAccounts();
            this.msg('Account inserted successfully!');
          },
          error: (error: any) => {
            console.error(error);
            this.msg('error');
          }
        })
      }
      else {
        if (this.modeForm == 'put') {
          this.accountService.put(this.account).subscribe({
            next: (res: any) => {
              this.modalService.dismissAll();
              this.getAccounts();
              this.msg('Account edited successfully!');
            },
            error: (res: any) => {
              console.error(res);
              this.msg('error y');
            }
          })
        }
      }
    }
  }

  public fileChange(event: any){

  }

  // MSG ******************************************************************************************
  
  public msg(msg: string){
    let timerInterval: any;
    Swal.fire({
      title: msg,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      willClose: () => {
        clearInterval(timerInterval);
      },
    })
  }

}


