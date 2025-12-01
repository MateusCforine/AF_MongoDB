import { Injectable, inject } from '@angular/core';
// Para criar serviços e injetar dependências

import { HttpClient } from '@angular/common/http';
// Para fazer requisições HTTP

import { Observable } from 'rxjs';
// Tipo usado para respostas assíncronas

export interface Movimentacao {
  _id?: string;                 // ID gerado pelo MongoDB
  tipo: 'receita' | 'despesa';  // Tipo da movimentação
  categoria: string;            // Categoria escolhida
  descricao: string;            // Descrição
  valor: number;                // Valor
  data: string;                 // Data (formato yyyy-MM-dd)
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
