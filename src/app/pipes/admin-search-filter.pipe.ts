import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter', // Nome do Pipe para ser usado no template
  pure: false, // Define que o pipe será recalculado quando os dados mudarem
})
export class AdminSearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property: string): any[] {
    if (!items || !searchText || !property) {
      return items; // Retorna todos os itens se não houver filtro
    }

    const lowerSearchText = searchText.toLowerCase();

    return items.filter(item =>
      item[property]?.toString().toLowerCase().includes(lowerSearchText)
    );
  }
}
