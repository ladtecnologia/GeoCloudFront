import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { Deposit } from 'src/app/models/Deposit';

export type SortColumn = keyof Deposit | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface depositSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[depositsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdDepositsSortableHeader {

  @Input() depositsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() depositsort = new EventEmitter<depositSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.depositsort.emit({column: this.depositsortable, direction: this.direction});
  }
}
