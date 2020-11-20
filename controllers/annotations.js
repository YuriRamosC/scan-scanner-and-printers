const Annotation = require('../models/annotations');
const listaView = require('../views/annotations/lista/lista.marko');
const formView = require('../views/annotations/form/form.marko');
module.exports = app => {

    app.get('/annotations', (req, res) => {
        Annotation.lista(res, function(annotations){
            res.marko(listaView, {annotations:annotations});
        });
    })

    app.get('/annotations/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Annotation.buscaPorId(id, res);
    })


    app.post('/annotations', (req, res) => {
        const annotation = req.body

        Annotation.adiciona(annotation, res);
    });

    //edição dos status
    app.get('/annotations/form/:id', (req, res) => {
        Annotation.buscaPorId(req.params.id, res, function(annotation){
            res.marko(formView, {annotation: annotation});
        });
    });
}
