import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Shopping } from '../shopping-cart/shopping';

@Component({
  selector: 'app-shopping-table',
  templateUrl: './shopping-table.component.html',
  styleUrls: ['./shopping-table.component.scss']
})
export class ShoppingTableComponent {

  @Input() items: Shopping[] = [];
  @Input() editingIndex: number|null= null;

  @Output() increment = new EventEmitter<number>();
  @Output() decrement = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  incrementQuantity(index: number){
    this.increment.emit(index);
    console.log(index);
  }

  decrementQuantity(index: number){
    this.decrement.emit(index);
    console.log(index);
  }

  saveEdit(index: number){
    this.edit.emit(index)
  }

  deleteItem(index: number) {
    this.delete.emit(index);
  }
}
