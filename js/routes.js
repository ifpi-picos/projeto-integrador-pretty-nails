app.get('/usuario/:id', async (req, res) => {
    const { id } = req.params; // Captura o ID da URL
    try {
        const result = await pool.query('SELECT nome, email, foto FROM usuarios WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Retorna os dados do usuário
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});
