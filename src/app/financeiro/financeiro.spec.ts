import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Financeiro } from './financeiro';

// Teste do componente Financeiro
describe('Financeiro', () => {

  let component: Financeiro;                   // Instância do componente
  let fixture: ComponentFixture<Financeiro>;   // Ambiente de teste

  beforeEach(async () => {

    // Configura o módulo de teste
    await TestBed.configureTestingModule({
      imports: [Financeiro] // Importa o componente standalone
    })
    .compileComponents(); // Prepara os componentes

    // Cria o componente para teste
    fixture = TestBed.createComponent(Financeiro);

    // Pega a instância criada
    component = fixture.componentInstance;

    // Atualiza o template
    fixture.detectChanges();
  });

  // Verifica se o componente foi criado
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
