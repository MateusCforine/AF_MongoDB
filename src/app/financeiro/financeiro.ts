import { Component, OnInit, inject } from '@angular/core';
// Importa ferramentas do Angular

import { FormsModule } from '@angular/forms';
// Para usar ngModel

import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
// Diretivas e pipes usados no HTML

import { MovimentacoesService, Movimentacao } from '../movimentacoes-service';
// Service e interface das movimentações

@Component({
  selector: 'app-financeiro',      // Nome da tag do componente
  standalone: true,                // Componente independente
  imports: [FormsModule, NgIf, NgFor, DatePipe, CurrencyPipe], // Recursos usados
  templateUrl: './financeiro.html', // HTML do componente
  styleUrl: './financeiro.css'      // CSS do componente
})
export class Financeiro implements OnInit {

  private api = inject(MovimentacoesService);
  // Injeta o service para acessar a API

  movimentacoes: Movimentacao[] = []; // Lista de movimentações
  carregando = false;                 // Indicador de carregamento
  salvando = false;                   // Indicador de salvamento
  erro = '';                          // Mensagem de erro

  // Campos do formulário
  tipo: 'receita' | 'despesa' = 'receita';
  categoria = '';
  descricao = '';
  valor: number | null = null;
  data = '';

  ngOnInit(): void {
    this.carregar(); // Carrega dados ao iniciar
  }

  get saldo(): number {
    // Calcula o saldo total
    return this.movimentacoes.reduce(
      (total, m) => (m.tipo === 'receita' ? total + m.valor : total - m.valor),
      0
    );
  }

  carregar(): void {
    // Busca as movimentações no backend
    this.carregando = true;
    this.erro = '';

    this.api.listar().subscribe({
      next: dados => {
        this.movimentacoes = dados; // Recebe a lista
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar movimentações.';
        this.carregando = false;
      }
    });
  }

  criar(): void {
    // Valida o formulário
    if (!this.categoria || !this.descricao || this.valor == null || !this.data) {
      return;
    }

    this.salvando = true;
    this.erro = '';

    // Cria objeto com os dados
    const nova: Movimentacao = {
      tipo: this.tipo,
      categoria: this.categoria,
      descricao: this.descricao,
      valor: Number(this.valor),
      data: this.data
    };

    // Envia para a API
    this.api.criar(nova).subscribe({
      next: mov => {
        this.movimentacoes.push(mov); // Adiciona à lista
        this.limparFormulario();      // Limpa o formulário
        this.salvando = false;
      },
      error: () => {
        this.erro = 'Erro ao salvar movimentação.';
        this.salvando = false;
      }
    });
  }

  excluir(m: Movimentacao): void {
    // Só exclui se tiver ID
    if (!m._id) return;

    this.api.excluir(m._id).subscribe({
      next: () => {
        // Remove da lista local
        this.movimentacoes = this.movimentacoes.filter(item => item._id !== m._id);
      },
      error: () => {
        this.erro = 'Erro ao excluir movimentação.';
      }
    });
  }

  private limparFormulario(): void {
    // Reseta os campos
    this.tipo = 'receita';
    this.categoria = '';
    this.descricao = '';
    this.valor = null;
    this.data = '';
  }
}
