import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { MovimentacoesService, Movimentacao } from '../movimentacoes-service';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DatePipe, CurrencyPipe],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css'
})
export class Financeiro implements OnInit {
  private api = inject(MovimentacoesService);

  movimentacoes: Movimentacao[] = [];
  carregando = false;
  salvando = false;
  erro = '';

  tipo: 'receita' | 'despesa' = 'receita';
  categoria = '';
  descricao = '';
  valor: number | null = null;
  data = '';

  ngOnInit(): void {
    this.carregar();
  }

  get saldo(): number {
    return this.movimentacoes.reduce(
      (total, m) => (m.tipo === 'receita' ? total + m.valor : total - m.valor),
      0
    );
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.api.listar().subscribe({
      next: dados => {
        this.movimentacoes = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar movimentações.';
        this.carregando = false;
      }
    });
  }

  criar(): void {
    if (!this.categoria || !this.descricao || this.valor == null || !this.data) {
      return;
    }

    this.salvando = true;
    this.erro = '';

    const nova: Movimentacao = {
      tipo: this.tipo,
      categoria: this.categoria,
      descricao: this.descricao,
      valor: Number(this.valor),
      data: this.data
    };

    this.api.criar(nova).subscribe({
      next: mov => {
        this.movimentacoes.push(mov);
        this.limparFormulario();
        this.salvando = false;
      },
      error: () => {
        this.erro = 'Erro ao salvar movimentação.';
        this.salvando = false;
      }
    });
  }

  excluir(m: Movimentacao): void {
    if (!m._id) return;

    this.api.excluir(m._id).subscribe({
      next: () => {
        this.movimentacoes = this.movimentacoes.filter(item => item._id !== m._id);
      },
      error: () => {
        this.erro = 'Erro ao excluir movimentação.';
      }
    });
  }

  private limparFormulario(): void {
    this.tipo = 'receita';
    this.categoria = '';
    this.descricao = '';
    this.valor = null;
    this.data = '';
  }
}
