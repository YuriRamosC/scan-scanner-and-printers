const Impressora = require('../models/impressoras');
const Devourer = require('./devourer');
const listaView = require('../views/lista/lista.marko');
module.exports = app => {

    app.get('/impressoras', (req, res) => {
        Impressora.lista(res, function(impressoras){
            res.marko(listaView, {impressoras:impressoras});
        });
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

        Impressora.listaOffline(res, function(impressoras){
            res.marko(listaView, {impressoras:impressoras, offline: 'true'});
        });
    });

    app.get('/impressoras-printwayy', (req, res) => {
        var impressorasAtualizadas = [];
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
