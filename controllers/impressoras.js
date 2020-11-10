const Impressora = require('../models/impressoras');
const Devourer = require('./devourer');
module.exports = app => {

    app.get('/impressoras', (req, res) => {
        Impressora.lista(res);
    })

    app.get('/impressoras/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Impressora.buscaPorId(id, res);
    })

    app.post('/impressoras', (req, res) => {
        const impressora = req.body

        Impressora.adiciona(impressora, res);
    })

    app.get('/impressoraslength',(req, res) => {
        Impressora.listaOnlyLength(res);
    } );
    app.get('/impressoras-printwayy', (req, res) => {
        let impressorasAtualizadas = [];
        Devourer.tratarDados(impressorasAtualizadas);
    });
    app.patch('/impressoras/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const valores = req.body

        Impressora.altera(id, valores, res)
    })

    app.delete('/impressoras/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Impressora.deleta(id, res)
    })
}
