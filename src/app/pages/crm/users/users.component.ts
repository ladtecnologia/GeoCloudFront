import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';

import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserService]
})
export class UsersComponent {

  // FORM MAIN ************************************************************************************

  breadCrumbItems!: Array<{}>;
  users: User[] = [];

  public term = '';
  public termoBuscaChanged: Subject<string> = new Subject<string>();
  public pagination = {} as Pagination;
  public sortField = 'id';
  public sortReverse = false;

  constructor(
    private userService : UserService,
    private modalService: NgbModal,
    public fb: FormBuilder
    ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Users', active: true }
    ];
    this.pagination = {currentPage: 1, pageSize: 8, totalCount: 1, totalPages:1} as Pagination;
    this.getUsers();
  }

  // GET , FILTER, ORDER and VIEW *****************************************************************

  public getUsers(): void {
    this.userService.get(this.pagination.currentPage, 
                         this.pagination.pageSize,
                         this.term,
                         this.sortField,
                         this.sortReverse).subscribe({
      next: (paginatedResult: PaginatedResult<User[]>) => {
        this.users = paginatedResult.result!;
        this.pagination = paginatedResult.pagination!;
        this.viewUser(this.users[0].id!);
      },
      error: (error: any) => {
        console.error(error);
        this.msg('error');
      }
    })
  }

  public filterUsers(evt: any) : void {
    if (this.termoBuscaChanged.observers.length == 0){
      this.termoBuscaChanged.pipe(debounceTime(400)).subscribe({
        next: (term) => {
          this.pagination.currentPage = 1;
          this.term = term;
          this.getUsers();
        }
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public pageChanged(event: any): void {
    if (this.pagination.currentPage != event.page) {
      this.pagination.currentPage = event.page;
      this.getUsers();
    }
  }

  public OrderByChange() {
    this.sortReverse = false;
    this.getUsers(); 
  }

  public OrderByColumn(sortField: string) {
    if(sortField == this.sortField) 
      { this.sortReverse = !this.sortReverse; }
    else 
      { this.sortReverse = false; }
    this.sortField = sortField;
    this.getUsers(); 
  }

  public viewUser(id: any) {
    if (id > 0) {
      this.userService.getById(id).subscribe({
        next: (res: User) => {
          (document.getElementById('__firstName') as HTMLImageElement).innerHTML = res.lastName! + ', ' + res.firstName!;
          (document.getElementById('__lastName') as HTMLImageElement).innerHTML  = res.company!;
          (document.getElementById('_firstName') as HTMLImageElement).innerHTML  = res.firstName!;
          (document.getElementById('_lastName') as HTMLImageElement).innerHTML   = res.lastName!;
          (document.getElementById('_email') as HTMLImageElement).innerHTML      = res.email!;
          (document.getElementById('_company') as HTMLImageElement).innerHTML    = res.company!;
        },
        error: (error: any) => {
          console.error(error);
          this.msg('error');
        }
      })
    }
  }
  
  // CHECK BOX ************************************************************************************

  masterSelected!: boolean; 

  checkUncheckAll(ev: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = this.masterSelected;
    }
    this.masterSelected ? 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "none"; 
  }

  onCheckboxChange(e: any) {
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

  checkedValGet: number[] = [];

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
      this.userService.delete(i).subscribe({
        next: (res: any) => {  
          this.getUsers();          
        },
        error: (error: any) => {
          console.error(error);
        }
      })
    });
    (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }
        
  // FORM MODAL - ADD / EDIT **********************************************************************

  user = {} as User;
  userForm!: FormGroup;
  modeForm: string = '';

  get f(): any {
    return this.userForm.controls;
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid' : campoForm.errors && campoForm.touched};
  }

  private validation(): void {
    this.userForm = this.fb.group({
      id:        [''],
      firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      lastName:  ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      email:     ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
      company:   ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
    });
  }

  public modalPost(content: any): void {
    this.modeForm = 'post'; 
    this.modalService.open(content, { size: 'md', centered: true });
    this.validation();
   }

  public modalPut(id: any, content: any): void {
    this.modeForm = 'put';
    if (id > 0) {
      this.userService.getById(id).subscribe({
        next: (user: User) => {
          this.user = {...user };
          this.userForm.patchValue(this.user);
          this.modalService.open(content, { size: 'md', centered: true });
          //Change Title and Button
          var modelTitle = document.getElementById('modalTitle') as HTMLAreaElement;
          modelTitle.innerHTML = 'Edit User';
          var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
          updateBtn.innerHTML = 'Update';
        },
        error: (error: any) => {
          console.error(error);
        }
      });
      this.validation();
    }
  }

  public save(): void {
    if (this.userForm.valid){
      this.user = {...this.userForm.value};
      if (this.modeForm == 'post') {
        this.user.id = 0;
        this.userService.post(this.user).subscribe({
          next: (res: any) => {
            this.modalService.dismissAll();
            this.getUsers();
            this.msg('User inserted successfully!');
          },
          error: (error: any) => {
            console.error(error);
            this.msg('error');
          }
        })
      }
      else {
        if (this.modeForm == 'put') {
          this.userService.put(this.user).subscribe({
            next: (res: any) => {
              this.modalService.dismissAll();
              this.getUsers();
              this.msg('User edited successfully!');
            },
            error: (res: any) => {
              console.error(res);
              this.msg('error');
            }
          })
        }
      }
    }
  }

  // MSG ******************************************************************************************
  
  public showingEntries(): string{
    var x: number = 1 + (this.pagination.currentPage! -1 ) * (this.pagination.pageSize!);
    var y: number = x + (this.pagination.pageSize!) - 1;
    var z: number = this.pagination.totalCount!;
    if (x > z) { x = z};
    if (y > z) { y = z};
    return "Showing entries " + x +  " to " + y + " of " + z;
  }

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

