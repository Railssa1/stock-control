import { DialogService } from 'primeng/dynamicdialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductsFormComponent } from 'src/app/modules/products/components/products-form/products-form.component';
import { ProductEvent } from 'src/models/enums/products';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent {
  constructor(
    private coockie: CookieService,
    private router: Router,
    private dialogService: DialogService
  ) { }

  handlerLogout(): void {
    this.coockie.delete("JWT_TOKEN");
    this.router.navigate(['/login']);
  }

  handlerSaleProduct(): void {
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;
    this.dialogService.open(ProductsFormComponent, {
      header: ProductEvent.SALE_PRODUCT_EVENT,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: saleProductAction }
      }
    });
  }
}
