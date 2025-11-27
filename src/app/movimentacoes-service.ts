import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movimentacao {
  _id?: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  descricao: string;
  valor: number;
  data: string; // yyyy-MM-dd
}

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/movimentacoes';

  listar(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(this.baseUrl);
  }

  criar(mov: Movimentacao): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(this.baseUrl, mov);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
