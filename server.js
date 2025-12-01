import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json()); // API aceita JSON

app.use(cors({
  origin: 'http://localhost:4200',  // URL do Angular
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Conectar no MongoDB Atlas
// Banco: movimentacoes
mongoose.connect(process.env.MONGODB_URI, { dbName: 'movimentacoes' })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro na conexão:', err.message));

  
const movimentacaoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['receita', 'despesa']
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  valor: {
    type: Number,
    required: true,
    min: 0
  },
  data: {
    type: Date,
    required: true
  }
}, {
  collection: 'movimentacoes',
  timestamps: true
});

const Movimentacao = mongoose.model('Movimentacao', movimentacaoSchema, 'movimentacoes');

// Rota inicial (teste rápido)
app.get('/', (req, res) => res.json({ msg: 'API Gestor Financeiro rodando' }));

// Criar movimentação
app.post('/movimentacoes', async (req, res) => {
  try {
    const movimentacao = await Movimentacao.create(req.body);
    res.status(201).json(movimentacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todas as movimentações
app.get('/movimentacoes', async (req, res) => {
  try {
    const lista = await Movimentacao.find().sort({ data: -1, createdAt: -1 });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar uma movimentação por ID
app.get('/movimentacoes/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const mov = await Movimentacao.findById(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json(mov);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar totalmente (PUT)
app.put('/movimentacoes/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const mov = await Movimentacao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, overwrite: true }
    );
    if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json(mov);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar parcialmente (PATCH)
app.patch('/movimentacoes/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const mov = await Movimentacao.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json(mov);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar movimentação
app.delete('/movimentacoes/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const mov = await Movimentacao.findByIdAndDelete(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(process.env.PORT, () =>
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
);
