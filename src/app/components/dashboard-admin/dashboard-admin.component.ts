import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
})
export class DashBoardAdminComponent {
  @Input() header: string = '';
  @Input() subtitle: string = '';
  @Input() columns: { label: string; key: string }[] = [];
  @Input() data: any[] = [];
  @Input() actionButtonLabel: string = '';
  @Input() actionButtonIcon: string = 'add-outline';
  @Input() deleteAction?: (item: any) => void;
  @Input() placeholder: string = '';
  @Output() actionButtonClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionButtonClick.emit();
  }
}
