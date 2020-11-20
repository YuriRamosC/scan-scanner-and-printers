const conexao = require('../infra/conexao');
const fs = require('fs');
const Devourer = require('../controllers/devourer');
const { waitForDebugger } = require('inspector');
const { resolve } = require('path');
const codename = require('../controllers/codename');
require('marko/node-require').install();
require('marko/express');

class Annotation {
    adiciona(annotation, res) {

        console.dir(annotation);
        const sql = 'INSERT INTO annotations SET ?'

        conexao.query(sql, annotation, (erro, resultados) => {
            if (erro.sqlMessage == '23000') {

            } else if (erro) {
            }
            else {
                res.status(201).json(annotation);
            }
        })

    }
    lista(res, callback) {
        const sql = 'SELECT * FROM annotations'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                callback(resultados);
            }
        })
    }

    listaOffline(res, callback) {
        const search = '\'offline\'';
        const sql = `SELECT * FROM annotations where status LIKE ${search} ORDER BY scan_status ASC, lastCommunication DESC`

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                callback(resultados);
            }
        });
    }

    gravarImpressorasBD(annotationsAtualizadas, res) {
        const sql = 'INSERT INTO annotations SET ?';
        for (let row = 0; row < annotationsAtualizadas.length; row++) {
            conexao.query(sql, annotationsAtualizadas[row], (erro, resultados) => {
                if (erro) {
                    if (erro.code === 'ER_DUP_ENTRY') {
                        if (annotationsAtualizadas[row].status == 'online' && annotationsAtualizadas[row].scan_status != 'everythingOk' && annotationsAtualizadas[row].scan_status != null) {
                            var previousStatus = annotationsAtualizadas[row].scan_status;
                            annotationsAtualizadas[row].scan_status = '';
                            console.log(annotationsAtualizadas[row].serialNumber + ' -> Status antigo'+ previousStatus);
                        }
                        this.altera(annotationsAtualizadas[row].id_way, annotationsAtualizadas[row], res);

                    } else {
                        res.status(400).json(erro);
                    }
                }
            });
        };
        //colocar o array de mensagens junto com esse redirect
        return res.redirect('/annotations');
    };


    buscaPorId(id, res, callback) {
        const sql = `SELECT * FROM annotations WHERE id_way LIKE \'${id}\'`;
        conexao.query(sql, (erro, resultados) => {
            const annotation = resultados[0];
            if (erro) {
                res.status(400).json(erro);
            } else {
                callback(annotation);
            }
        })
    }
    altera(id_way, valores, res) {
        const sql = 'UPDATE annotations SET ? WHERE id_way=?';
        var annotationTest = {};
        this.buscaPorId(id_way, res, function (annotation) {
            annotationTest = annotation;
        });
        conexao.query(sql, [valores, id_way], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {

                if (resultados.changedRows > 0) {
                    if (annotationTest.status == 'offline' && valores.status == 'online') {
                        console.log(valores.customer_name+ ' '+ valores.manufacturer+ ' '+ valores.model +' '+valores.serialNumber + ' ficou online, status anterior: ');
                        if (annotationTest.scan_status != 'everythingOk' && annotationTest.scan_status != null) {
                            this.altera(id_way, { scan_status: 'recentlyOnline' }, res);
                        }
                    }
                    else if (annotationTest.status == 'online' && valores.status == 'offline') {
                        console.log(valores.customer_name+ ' '+ valores.manufacturer+ ' '+ valores.model +' '+valores.serialNumber + ' ficou offline')
                    }
                }
            }
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM annotations WHERE id=?'

        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ id })
            }
        })
    }
}

module.exports = new Annotation