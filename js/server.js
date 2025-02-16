require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./index'); // Importa as rotas
const pool = require('./db'); // Conexão com o banco de dados

app.use(express.json()); // Permite trabalhar com JSON nas requisições

// Rota de teste da conexão
app.get('/teste', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Testa conexão
        res.json({ message: "Conexão bem-sucedida!", data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao conectar ao banco de dados" });
    }
});

app.use('/api', routes); // Define as rotas da aplicação

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
