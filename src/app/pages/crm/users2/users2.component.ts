import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

// Rest Api Service
import { restApiService } from "../../../core/services/rest-api.service";

// Csv File Export
import { ngxCsv } from 'ngx-csv/ngx-csv';

// Sweet Alert
import Swal from 'sweetalert2';

import { User } from 'src/app/models/User';
import { UsersService } from './users2.service';
import { NgbdUsersSortableHeader, userSortEvent } from './users2-sortable.directive';

@Component({
  selector: 'app-users2',
  templateUrl: './users2.component.html',
  styleUrls: ['./users2.component.scss'],
  providers: [UsersService, DecimalPipe]
})

/**
 * Users Component
 */
export class Users2Component {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  usersForm!: UntypedFormGroup;
  //CustomersData!: User[];
  masterSelected!: boolean;
  checkedList: any;

  // Api Data
  content?: any;
  user?: any;
  econtent?: any;

  // Table data
  UsersList!: Observable<User[]>;
  total: Observable<number>;
  @ViewChildren(NgbdUsersSortableHeader) headers!: QueryList<NgbdUsersSortableHeader>;

  constructor(private modalService: NgbModal, 
              public service: UsersService, 
              private formBuilder: UntypedFormBuilder, 
              private restApiService: restApiService) {
    this.UsersList = service.user$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Users', active: true }
    ];

    /**
     * Form Validation
     */
    this.usersForm = this.formBuilder.group({
      id:         [''],
      firstName:  ['', [Validators.required]],
      lastName:   ['', [Validators.required]],
      email:      ['', [Validators.required]],
      company:    ['', [Validators.required]]
    });

    /**
     * fetches data
     */
    setTimeout(() => {
      this.UsersList.subscribe(x => {
        this.content = this.user;
        this.user = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200);

    
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    this.usersForm.controls['id'].setValue(0);
  }

  /**
   * Form data get
   */
  get form() {
    return this.usersForm.controls;
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    document.getElementById('')
    this.usersForm.patchValue({
      // image_src: file.name
      image_src: 'brands/dribbble.png'
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById('userlogo-img') as HTMLImageElement).src = this.imageURL;
    }
    reader.readAsDataURL(file)
  }

  /**
  * Save user
  */
  saveUser() {
    if (this.usersForm.valid) {
      if (this.usersForm.get('id')?.value) {
        this.restApiService.putUser(this.usersForm.value).subscribe(
          (data: any) => {
            //this.service.user = this.content.map((order: { id: any; }) => order.id === data.data.ids ? { ...order, ...data.data } : order);
            this.modalService.dismissAll();
          }
        )
      }
      else {
        this.restApiService.postUser(this.usersForm.value).subscribe(
          (data: any) => {
            //this.service.user.push(data.data);
            this.modalService.dismissAll();
            let timerInterval: any;
            Swal.fire({
              title: 'User inserted successfully!',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
              }
            });
          },)
      }
    }
    setTimeout(() => {
      this.usersForm.reset();
    }, 2000);
    this.submitted = true
  }

  /**
   * View Data Get
   * @param content modal content
   */
  viewDataGet(id: any) {
    this.restApiService.getUserById(id).subscribe({
      next: (data: User) => {
        this.econtent = data;
        (document.querySelector('.user-details h5') as HTMLImageElement).innerHTML = this.econtent.firstName + ' ' + this.econtent.lastName;
        (document.querySelector('.user-details p') as HTMLImageElement).innerHTML = this.econtent.company;
        (document.querySelector('.firstName') as HTMLImageElement).innerHTML = this.econtent.firstName;
        (document.querySelector('.lastName') as HTMLImageElement).innerHTML = this.econtent.lastName;
        (document.querySelector('.email') as HTMLImageElement).innerHTML = this.econtent.email;
        (document.querySelector('.company') as HTMLImageElement).innerHTML = this.econtent.company;
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var title = document.getElementById('exampleModalLabel') as HTMLAreaElement;
    title.innerHTML = "Edit User";
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.restApiService.getUserById(id).subscribe({
      next: (data: User) => {
        this.econtent = data;
        this.usersForm.controls['firstName'].setValue(this.econtent.firstName);
        this.usersForm.controls['lastName'].setValue(this.econtent.lastName);
        this.usersForm.controls['email'].setValue(this.econtent.email);
        this.usersForm.controls['company'].setValue(this.econtent.company);
        this.usersForm.controls['id'].setValue(this.econtent.id);
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });

  }


  /**
  * Delete model
  */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.restApiService.deleteUser(id).subscribe({
        next: data => { },
        error: err => {
          this.content = JSON.parse(err.error).message;
        }
      });
      document.getElementById('c_' + id)?.remove();
    }
    else {
      this.checkedValGet.forEach((item: any) => {
        this.restApiService.deleteUser(item).subscribe({
          next: data => { },
          error: err => {
            this.content = JSON.parse(err.error).message;
          }
        });
        document.getElementById('c_' + item)?.remove();
      });
    }
  }

  /**
   * Multiple Delete
   */
  checkedValGet: any[] = [];

  deleteMultiple(content: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var result
    var checkedVal: any[] = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {

        console.log(checkboxes[i].value);

        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    if (checkedVal.length > 0) {
      this.modalService.open(content, { centered: true });
    }
    else {
      Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#299cdb', });
    }
    this.checkedValGet = checkedVal;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.user.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.user.length; i++) {
      if (this.user[i].state == true) {
        result = this.user[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";

  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.user.length; i++) {
      if (this.user[i].state == true) {
        result = this.user[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }

  // Csv File Export
  csvFileExport() {
    var orders = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Company Data',
      useBom: true,
      noDownload: false,
      headers: ["id", "fisrtName", "lastName", "email", "company"]
    };
    new ngxCsv(this.content, "Users", orders);
  }

  // Sort filter
  sortField: any;
  sortBy: any
  SortFilter() {
    this.sortField = (document.getElementById("choices-single-default") as HTMLInputElement).value;
    if (this.sortField[0] == 'D') {
      this.sortBy = 'asc';
      this.sortField = this.sortField.replace(/D/g, '')
    }
  }

  /**
* Sort table data
* @param param0 sort the column
*
*/
  onSort({ column, direction }: userSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.usersortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
