import { TestBed } from '@angular/core/testing';
import { MovimentacoesService } from './movimentacoes-service';

describe('MovimentacoesService', () => {
  let service: MovimentacoesService; // Instância do service

  beforeEach(() => {
    // Configura o ambiente de teste
    TestBed.configureTestingModule({});

    // Obtém a instância do service para os testes
    service = TestBed.inject(MovimentacoesService);
  });

  it('should be created', () => {
    // Verifica se o service foi criado corretamente
    expect(service).toBeTruthy();
  });
});
