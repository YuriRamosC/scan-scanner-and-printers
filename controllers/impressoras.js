const Impressora = require('../models/impressoras');
const Devourer = require('./devourer');
const listaView = require('../views/printers/lista/lista.marko');
const formView = require('../views/printers/form/form.marko');
const countersView = require('../views/printers/counters/counters.marko');
module.exports = app => {
    app.get('/impressoras', (req, res) => {
        var anotacoes = [];
        //  Anotacoes.lista(res, function (resultados) {
        //       anotacoes = resultados;
        Impressora.lista(res, function (impressoras) {
            res.marko(listaView, { impressoras: impressoras });
        });
        //   });
    })
    app.get('/api-impressoras', (req, res) => {
        Impressora.lista(res, function (impressoras) {
            res.status(200).json({ impressoras: impressoras });
        });
    })
    app.get('/api-impressoras-offline', (req, res) => {
        Impressora.listaOffline(res, function (impressoras) {
            res.status(200).json({ impressoras: impressoras, offline: 'true' });
        });
    });
    app.post('/api-impressoras-offline', (req, res) => {
        const valores = { scan_status: req.body.scan_status, scan_observation: req.body.scan_observation }
        Impressora.alteraApi(req.body.id_way, valores, res, function () {
            res.status(200).json({result: 'Alterado'});
        });
    });


    

    app.get('/impressoras-offline', (req, res) => {
        Impressora.listaOffline(res, function (impressoras) {
            res.marko(listaView, { impressoras: impressoras, offline: 'true' });
        });
    });

    //finaliza a edição
    app.post('/impressoras-offline', (req, res) => {
        const valores = { scan_status: req.body.scan_status, scan_observation: req.body.scan_observation }
        Impressora.altera(req.body.id_way, valores, res);
        res.redirect('/impressoras-offline');
    });



    app.get('/impressoras/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Impressora.buscaPorId(id, res);
    })

    app.post('/impressoras', (req, res) => {
        const impressora = req.body

        Impressora.adiciona(impressora, res);
    });

    app.get('/impressoras-printwayy', (req, res) => {
        var impressorasAtualizadas = [];
        Devourer.tratarDados(impressorasAtualizadas, res);
    });

    //edição dos status
    app.get('/impressoras/form/:id_way', (req, res) => {
        Impressora.buscaPorId(req.params.id_way, res, function (impressora) {
            res.marko(formView, { impressora: impressora });
        });
    });

    app.get('/impressoras-monitoramento', (req, res) => {
        Devourer.buscarCounters(res, function (contadoresResult) {
            res.marko(countersView, { impressoras: contadoresResult });
        });
    });
}
