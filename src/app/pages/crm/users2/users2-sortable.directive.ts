import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { User } from 'src/app/models/User';

export type SortColumn = keyof User | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface userSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[usersortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdUsersSortableHeader {

  @Input() usersortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() usersort = new EventEmitter<userSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.usersort.emit({column: this.usersortable, direction: this.direction});
  }
}
