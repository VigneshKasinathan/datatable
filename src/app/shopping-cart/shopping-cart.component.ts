import { Component, OnInit, NgZone } from '@angular/core';
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
  Price:'',
  Brand: '', 
  Quantity: 0
}

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
    Price: '',
    Quantity: 0,
    Brand: ''
  }
}

incrementQuantity(index: number) {
  this.items[index].Quantity++
  if(this.editingIndex === index) {
    this.newItems.Quantity = this.items[index].Quantity
  }
  
}

decrementQuantity(index: number) {
  if(this.items[index].Quantity > 0 ) {
    this.items[index].Quantity--;
    if(this.editingIndex === index) {
      this.newItems.Quantity = this.items[index].Quantity
    }
  }
}

saveEdit(index: number ) {
  this.editingIndex= index;
  this.newItems = {...this.items[index]}
}

}
