const conexao = require('../infra/conexao');
const fs = require('fs');
const Devourer = require('../controllers/devourer');
const { waitForDebugger } = require('inspector');
const { resolve } = require('path');
const codename = require('../controllers/codename');
require('marko/node-require').install();
require('marko/express');

class Impressora {
    adiciona(impressora, res) {

        console.dir(impressora);
        const sql = 'INSERT INTO impressoras SET ?'

        conexao.query(sql, impressora, (erro, resultados) => {
            if (erro.sqlMessage == '23000') {

            } else if (erro) {
            }
            else {
                res.status(201).json(impressora);
            }
        })

    }
    lista(res, callback) {
        const sql = 'SELECT * FROM impressoras'

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
        const sql = `SELECT * FROM impressoras where status LIKE ${search} ORDER BY scan_status ASC, lastCommunication DESC`

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                callback(resultados);
            }
        });
    }

    gravarImpressorasBD(impressorasAtualizadas, res) {
        const sql = 'INSERT INTO impressoras SET ?';
        for (let row = 0; row < impressorasAtualizadas.length; row++) {
            conexao.query(sql, impressorasAtualizadas[row], (erro, resultados) => {
                if (erro) {
                    if (erro.code === 'ER_DUP_ENTRY') {
                        if (impressorasAtualizadas[row].status == 'online' && impressorasAtualizadas[row].scan_status != 'everythingOk' && impressorasAtualizadas[row].scan_status != null) {
                            var previousStatus = impressorasAtualizadas[row].scan_status;
                            impressorasAtualizadas[row].scan_status = '';
                            console.log(impressorasAtualizadas[row].serialNumber + ' -> Status antigo' + previousStatus);
                        }
                        this.altera(impressorasAtualizadas[row].id_way, impressorasAtualizadas[row], res);

                    } else {
                        res.status(400).json(erro);
                    }
                }
            });
        };
        //colocar o array de mensagens junto com esse redirect
        return res.redirect('/impressoras');
    };


    buscaPorId(id, res, callback) {
        const sql = `SELECT * FROM impressoras WHERE id_way LIKE \'${id}\'`;
        conexao.query(sql, (erro, resultados) => {
            const impressora = resultados[0];
            if (erro) {
                res.status(400).json(erro);
            } else {
                callback(impressora);
            }
        })
    }
    altera(id_way, valores, res) {
        const sql = 'UPDATE impressoras SET ? WHERE id_way=?';
        var impressoraTest = [];
        this.buscaPorId(id_way, res, function (impressora) {
            impressoraTest = impressora;
        });
        conexao.query(sql, [valores, id_way], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {

                if (resultados.changedRows > 0) {
                    if (impressoraTest.status == 'offline' && valores.status == 'online') {
                        console.log(valores.customer_name + ' ' + valores.manufacturer + ' ' + valores.model + ' ' + valores.serialNumber + ' ficou online, status antigo: ' + impressoraTest.scan_status);
                        if (impressoraTest.scan_status != 'everythingOk' && impressoraTest.scan_status != null) {
                            this.altera(id_way, { scan_status: 'recentlyOnline' }, res);
                        }
                    }
                    else if (valores.status == 'online' && impressoraTest.scan_status == 'recentlyOnline') {
                        this.altera(id_way, { scan_status: '' }, res);
                    }
                    else if (impressoraTest.status == 'online' && valores.status == 'offline') {
                        console.log(valores.customer_name + ' ' + valores.manufacturer + ' ' + valores.model + ' ' + valores.serialNumber + ' ficou offline')
                    }
                }
                else if (valores.status == 'online' && impressoraTest.scan_status == 'recentlyOnline') {
                    this.altera(id_way, { scan_status: '' }, res);
                }
            }
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM impressoras WHERE id=?'

        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ id })
            }
        })
    }
}

module.exports = new Impressora