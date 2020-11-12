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
    });

    app.get('/impressoras-offline', (req, res) => {
        Impressora.listaOffline(res);
    });

    app.get('/impressoras-printwayy', (req, res) => {
        var impressorasAtualizadas = [];
        console.log(impressorasAtualizadas.length);

        Devourer.tratarDados(impressorasAtualizadas, res);
    }); 
    app.patch('/impressoras/:id_way', (req, res) => {
        const id_way = parseInt(req.params.id_way)
        const valores = req.body

        Impressora.altera(id_way, valores, res)
    })

    app.delete('/impressoras/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Impressora.deleta(id, res)
    })
}
