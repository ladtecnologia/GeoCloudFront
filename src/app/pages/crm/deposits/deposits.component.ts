import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';

// Date Format
import { DatePipe } from '@angular/common';
// Csv File Export
import { ngxCsv } from 'ngx-csv/ngx-csv';

// Rest Api Service
import { restApiService } from "../../../core/services/rest-api.service";
import { GlobalComponent } from '../../../global-component';

// Sweet Alert
import Swal from 'sweetalert2';

import { DepositsService } from './deposits.service';
import { NgbdDepositsSortableHeader, depositSortEvent } from './deposits-sortable.directive';
import { Deposit } from 'src/app/models/Deposit';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss'],
  providers: [DepositsService, DecimalPipe]
})

/**
 * Deposits Component
 */
export class DepositsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  depositsForm!: UntypedFormGroup;
  CustomersData!: any;
  masterSelected!: boolean;
  checkedList: any;

  // Api Data
  content?: any;
  deposits?: any;
  econtent?: any;
  //url = GlobalComponent.API_URL;

  // Table data
  depositsList!: Observable<Deposit[]>;
  total: Observable<number>;
  @ViewChildren(NgbdDepositsSortableHeader) headers!: QueryList<NgbdDepositsSortableHeader>;

  constructor(private modalService: NgbModal, 
              public service: DepositsService, 
              private formBuilder: UntypedFormBuilder, 
              private restApiService: restApiService, 
              private datePipe: DatePipe) {
    this.depositsList = service.deposits$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Deposits', active: true }
    ];

    /**
     * Form Validation
     */
    this.depositsForm = this.formBuilder.group({
      ids:   [''],
      name:  ['', [Validators.required]],
      state: ['', [Validators.required]],
      city:  ['', [Validators.required]]
    });

    /**
     * fetches data
     */
    setTimeout(() => {
      this.depositsList.subscribe(x => {
        this.content = this.deposits;
        this.deposits = Object.assign([], x);
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
  }

  /**
  * Form data get
  */
  get form() {
    return this.depositsForm.controls;
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    document.getElementById('')
    this.depositsForm.patchValue({
      // image_src: file.name
      image_src: 'avatar-8.jpg'
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById('customer-img') as HTMLImageElement).src = this.imageURL;
    }
    reader.readAsDataURL(file)
  }

  /**
  * Save user original
  */
 
  saveUser() {
    if (this.depositsForm.valid) {
      if (this.depositsForm.get('id')?.value) {
        this.restApiService.patchDepositData(this.depositsForm.value).subscribe(
          (data: any) => {
            this.service.deposits = this.content.map((order: { id: any; }) => order.id === data.data.ids ? { ...order, ...data.data } : order);
            this.modalService.dismissAll();
          }
        )
      }
      else {
        this.restApiService.postDepositData(this.depositsForm.value).subscribe(
          (data: any) => {
            this.service.deposits.push(data.data);
            this.modalService.dismissAll();
            let timerInterval: any;
            Swal.fire({
              title: 'Deposit inserted successfully!',
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
      this.depositsForm.reset();
    }, 2000);
    this.submitted = true
  }


  //chat gpt
//   saveUser() {
//     if (this.depositsForm.valid) {
//         const depositValue = this.depositsForm.value;
        
 
//         if (true) {
//             this.restApiService.patchDepositData(depositValue).subscribe({
//                 next: (deposit: Deposit) => {
//                     this.service.deposits = this.content.map((order: { id: any; }) => order.id === deposit.id ? { ...order, ...deposit } : order);
//                     //this.content.map((order => order.id === deposit.ids ? { ...order, ...deposit } : order));
//                     this.dismissAndReset();
//                 },
//                 error: (error) => this.handleError(error)
//             });
//         } else {
//             this.restApiService.postDepositData(depositValue).subscribe({
//                 next: (deposit: Deposit) => {
//                     this.service.deposits.push(deposit);
//                     this.dismissAndReset();
//                     this.showSuccessMessage();
//                 },
//                 error: (error) => this.handleError(error)
//             });
//         }
//     } else {
//         this.showInvalidFormWarning();
//     }
// }
 
// dismissAndReset() {
//     this.modalService.dismissAll();
//     setTimeout(() => {
//         this.depositsForm.reset();
//         this.submitted = true;
//     }, 2000);
// }
 
// showSuccessMessage() {
//     Swal.fire({
//         title: 'Deposit inserted successfully!',
//         icon: 'success',
//         timer: 2000,
//         timerProgressBar: true,
//     });
// }
 
showInvalidFormWarning() {
    console.warn('Form is invalid');
}
 
handleError(error: any) {
    console.error('Error:', error);
}









  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Deposit';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.restApiService.getSingleDepositData(id).subscribe({
      next: (deposit: Deposit) => {
        this.econtent = deposit;
        this.depositsForm.controls['name'].setValue(this.econtent.name);
        this.depositsForm.controls['state'].setValue(this.econtent.state);
        this.depositsForm.controls['city'].setValue(this.econtent.city);
        this.depositsForm.controls['ids'].setValue(this.econtent.id);
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });

  }

  /**
   * View Data Get
   * @param content modal content
   */
  viewDataGet(id: number) {
    this.restApiService.getSingleDepositData(id).subscribe({
      next: (deposit: Deposit) => {
        this.econtent = deposit;
        (document.querySelector('.deposit-details h5') as HTMLImageElement).innerHTML = this.econtent.name;
        (document.querySelector('.deposit-details p') as HTMLImageElement).innerHTML = this.econtent.state;
        (document.querySelector('._name') as HTMLImageElement).innerHTML = this.econtent.name;
        (document.querySelector('._state') as HTMLImageElement).innerHTML = this.econtent.state;
        (document.querySelector('._city') as HTMLImageElement).innerHTML = this.econtent.city;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.deposits.forEach((x: { stateX: any; }) => x.stateX = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.deposits.length; i++) {
      if (this.deposits[i].stateX == true) {
        result = this.deposits[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";

  }
  isAllChecked() {
    return this.content.every((_: { stateX: any; }) => _.stateX);
  }

  /**
  * Multiple Default Select2
  */
  selectValue = ['Lead', 'Partner', 'Exiting', 'Long-term'];

  // Csv File Export
  csvFileExport() {
    var orders = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Deposit Data',
      useBom: true,
      noDownload: false,
      headers: ["Id", "Name", "State", "City"]
    };
    new ngxCsv(this.content, "Deposit", orders);
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    const checkArray: UntypedFormArray = this.depositsForm.get('subItem') as UntypedFormArray;
    checkArray.push(new UntypedFormControl(e.target.value));
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.deposits.length; i++) {
      if (this.deposits[i].stateX == true) {
        result = this.deposits[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.restApiService.deleteDeposit(id).subscribe({
        next: data => { },
        error: err => {
          this.content = JSON.parse(err.error).message;
        }
      });
      document.getElementById('c_' + id)?.remove();
    }
    else {
      this.checkedValGet.forEach((item: any) => {
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

  // Sort filter
  sortField: any;
  sortBy: any
  SortFilter() {
    this.sortField = (document.getElementById("choices-single-default") as HTMLInputElement).value;
    if (this.sortField[0] == 'A') {
      this.sortBy = 'desc';
      this.sortField = this.sortField.replace(/A/g, '')
    }
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
  onSort({ column, direction }: depositSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.depositsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
