const Annotation = require('../models/annotations');
const listaView = require('../views/annotations/lista/lista.marko');
const formView = require('../views/annotations/form/form.marko');
module.exports = app => {

    app.get('/annotations', (req, res) => {
        Annotation.lista(res, function (annotations) {
            res.marko(listaView, { annotations: annotations });
        });
    })

    app.get('/annotations/:id', (req, res) => {
        const id = parseInt(req.params.id)

        Annotation.buscaPorId(id, res);
    })


    app.post('/annotations', (req, res) => {
        if (req.body.id) {
            const annotation = {id: req.body.id,name: req.body.name, color: req.body.color};
            console.log('change');
            console.log(req.body);
            Annotation.altera(annotation.id, annotation, res);
        } else {
            const annotation = {name: req.body.name, color: req.body.color};
            console.log('add');
            console.log(req.body);
            Annotation.adiciona(annotation, res);
        }
        res.redirect('/annotations');
    });


    //edição dos status
    app.get('/annotations/form/:id', (req, res) => {
        Annotation.buscaPorId(req.params.id, res, function (annotation) {
            res.marko(formView, { annotation: annotation });
        });
    });
}
