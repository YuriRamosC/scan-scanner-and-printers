const Impressora = require('../models/impressoras');
const Devourer = require('./devourer');
const listaView = require('../views/lista/lista.marko');
const formView = require('../views/form/form.marko');
const countersView = require('../views/counters/counters.marko');
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
    //finaliza a edição
    app.post('/impressoras-offline', (req, res) => {
        const valores = {scan_status: req.body.scan_status, scan_observation: req.body.scan_observation}
        console.dir(valores);
        Impressora.altera(req.body.id_way, valores, res);
        res.redirect('/impressoras-offline');
    });


    app.get('/impressoras-printwayy', (req, res) => {
        var impressorasAtualizadas = [];
        Devourer.tratarDados(impressorasAtualizadas, res);
    }); 

    //edição dos status
    app.get('/impressoras/form/:id_way', (req, res) => {
        Impressora.buscaPorId(req.params.id_way, res, function(impressora){
            res.marko(formView, {impressora: impressora});
        });
    });

    app.get('/impressoras-monitoramento', (req, res) => {
        Devourer.buscarCounters(res, function(contadoresResult){
            //console.dir(contadoresResult);
            res.marko(countersView, {impressoras:contadoresResult});
        });
    });
}
