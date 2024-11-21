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
  @Input() searchType: string = '';
  @Input() filterOptions: { value: string, label: string }[] = [];
  @Input() boolLink: boolean = true;
  @Output() actionButtonClick = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() linkCopied = new EventEmitter<string>();

  searchText: string = ''; // Adicione esta variável

  // Função para lidar com a busca
  get filteredData(): any[] {
    if (!this.searchText) {
      return this.data;
    }

    const search = this.searchText.toLowerCase();
    return this.data.filter(item =>
      item?.[this.searchType]?.toLowerCase().includes(search)
    );
  }

  onCopyClick(link: string,) {
    this.linkCopied.emit(link)
    console.log('Dashboard: '+this.boolLink)
  }

  onDeleteClick(): void {
    this.deleteItem.emit();
  }

  onActionClick(): void {
    this.actionButtonClick.emit();
  }

}