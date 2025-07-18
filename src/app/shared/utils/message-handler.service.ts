import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageStatus } from './enums/MessageStatus.enum';

@Injectable({
  providedIn: 'root'
})
export class MessageHandlerService {

  constructor(
    private messageService: MessageService
  ) { }

  handlerMessage(status: MessageStatus, msg: string): void {
    this.messageService.add({
      severity: status,
      summary: status === MessageStatus.Error ? 'Erro' : 'Sucesso',
      detail: msg,
      life: 2500
    });
  }
}
