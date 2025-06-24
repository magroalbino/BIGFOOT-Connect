require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userService = require('./services/userService.js');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Rota de registro de novo usuário
 */
app.post('/register', async (req, res) => {
  const { username, password } = req.body; // Muda de id: username para username diretamente

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username e senha são obrigatórios.' });
  }

  try {
    const result = await userService.registerUser(username, password);
    return res.json(result);
  } catch (err) {
    console.error('[Backend] Erro no registro:', err);
    return res.status(500).json({ success: false, error: 'Erro interno no registro.' });
  }
});

/**
 * Rota de login
 */
app.post('/login', async (req, res) => {
  const { username, password } = req.body; // Muda de id: username para username diretamente

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username e senha são obrigatórios.' });
  }

  try {
    const result = await userService.loginUser(username, password);
    return res.json(result);
  } catch (err) {
    console.error('[Backend] Erro no login:', err);
    return res.status(500).json({ success: false, error: 'Erro interno no login.' });
  }
});

/**
 * Middleware para proteger rotas
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token ausente.' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'bigfoot-secret-key', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido.' });
    req.user = decoded;
    next();
  });
}

/**
 * Rota protegida de teste
 */
app.get('/me', authMiddleware, (req, res) => {
  res.json({ username: req.user.username, userId: req.user.userId });
});

/**
 * Inicialização do servidor
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
});