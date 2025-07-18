import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
import { MessageStatus } from 'src/app/shared/utils/enums/MessageStatus.enum';
import { MessageHandlerService } from 'src/app/shared/utils/message-handler.service';
import { GetAllProductsResponse } from 'src/models/interfaces/products';
import { ProductsService } from 'src/services/products/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private messageHandlerService: MessageHandlerService
  ) { }

  productList: Array<GetAllProductsResponse> = [];
  productsChartData!: ChartData;
  productsChartOptions!: ChartOptions;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadingProducts();
  }

  loadingProducts() {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        this.productList = resp;
        this.productsDtService.setProductsData(this.productList);
        this.setProductsChatConfig();
      },
      error: (err) => {
        this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Falha ao carregar dados. Tente novamente.');
        console.log(err);
      }
    })
  }

  setProductsChatConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.productsChartData = {
      labels: this.productList.map((product) => product.name),
      datasets: [
        {
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.productList.map((product) => product.amount)
        }
      ]
    };

    this.productsChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 'bold'
            },
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
