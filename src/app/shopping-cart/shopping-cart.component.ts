import { Component, ChangeDetectorRef } from '@angular/core';
import { Shopping } from './shopping';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent  {

  counter = 0;


items: Shopping[] = [];
newItems: Shopping = {
  itemName: '',
  itemCode:'',
  Price: 0,
  Brand: '', 
  Quantity: 0
}

totalQuantity = 0

editingIndex: number|null= null;



additem() {
if(this.editingIndex != null) {
  this.items[this.editingIndex] = {...this.newItems}
  this.editingIndex = null;
} else {
  this.items.push({...this.newItems})
}
this.resetNewItem();
}

resetNewItem(){
  this.newItems = {
    itemName: '',
    itemCode: '',
    Price: 0,
    Quantity: 0,
    Brand: ''
  }
}

incrementQuantity(index: number) {
  console.log('Handling increment for index:', index); // Debugging line
  this.items[index].Quantity++;
  if (this.editingIndex === index) {
    this.newItems.Quantity = this.items[index].Quantity;
  }
}

decrementQuantity(index: number) {
  console.log('Handling decrement for index:', index); // Debugging line
  if (this.items[index].Quantity > 0) {
    this.items[index].Quantity--;
    if (this.editingIndex === index) {
      this.newItems.Quantity = this.items[index].Quantity;
    }
  }
}

saveEdit(index: number ) {
  this.editingIndex= index;
  this.newItems = {...this.items[index]}
  console.log('Handling edit for index:', index); // Debugging line
}

deleteItem(index: number) {
  this.items.splice(index);
  if(this.editingIndex === index) {
    this.editingIndex = null
    this.resetNewItem();
  }
}


 
}
