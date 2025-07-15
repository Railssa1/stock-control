import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/models/enums/products';
import { EventAction, GetAllProductsResponse } from 'src/models/interfaces/products';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();

  productSelected!: GetAllProductsResponse;

  addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;
  saleProductEvent = ProductEvent.SALE_PRODUCT_EVENT;

  handlerProductEvent(action: string, id?: string): void {
    if (action && action !== "") {
      const productEventData = id && id !== "" ? { action, id } : { action };
      this.productEvent.emit(productEventData);
    }
  }
}
