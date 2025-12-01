import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Movimentacao {
  _id?: string;                 
  tipo: 'receita' | 'despesa';  
  categoria: string;            
  descricao: string;            
  valor: number;                
  data: string;                 
}

@Injectable({
  providedIn: 'root'            // Torna o serviço disponível em toda a aplicação
})
export class MovimentacoesService {

  private http = inject(HttpClient);  // Injeta o HttpClient
  private baseUrl = 'http://localhost:3000/movimentacoes'; // URL da API

  listar(): Observable<Movimentacao[]> {
    // Faz uma requisição GET e retorna todas as movimentações
    return this.http.get<Movimentacao[]>(this.baseUrl);
  }

  criar(mov: Movimentacao): Observable<Movimentacao> {
    // Envia uma movimentação para ser salva (POST)
    return this.http.post<Movimentacao>(this.baseUrl, mov);
  }

  excluir(id: string): Observable<void> {
    // Remove uma movimentação pelo ID (DELETE)
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
