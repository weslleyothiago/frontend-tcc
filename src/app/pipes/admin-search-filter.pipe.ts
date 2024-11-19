import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class AdminSearchFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, field: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase(); // Faz a pesquisa ser insensível ao caso
    return items.filter(item => item[field]?.toLowerCase().includes(searchText));
  }

}
