const conexao = require('../infra/conexao');
const fs = require('fs');
const Devourer = require('../controllers/devourer');
const { waitForDebugger } = require('inspector');
const { resolve } = require('path');
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
        const sql = `SELECT * FROM impressoras where status LIKE ${search}`

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                callback(resultados);
            }
        });
    }

    gravarImpressorasBD(impressorasAtualizadas, res) {
        // return new Promise((resolve, reject) => {
        console.dir('Quantas impressoras tem: ' + impressorasAtualizadas.length);
        const sql = 'INSERT INTO impressoras SET ?';
        for (let row = 0; row < impressorasAtualizadas.length; row++) {
            conexao.query(sql, impressorasAtualizadas[row], (erro, resultados) => {
                if (erro) {
                    if (erro.code === 'ER_DUP_ENTRY') {
                        this.altera(impressorasAtualizadas[row].id_way, impressorasAtualizadas[row], res);

                    } else {
                        res.status(400).json(erro);
                    }
                }
            });
        };

        return res.redirect('/impressoras');
    };


    buscaPorId(id, res) {
        const sql = 'SELECT * FROM impressoras WHERE id_way LIKE '+id;
        conexao.query(sql, (erro, resultados) => {
            const impressora = resultados[0];

            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(impressora)
            }
        })
    }
    altera(id_way, valores, res) {
        const sql = 'UPDATE impressoras SET ? WHERE id_way=?';

        conexao.query(sql, [valores, id_way], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {

                if (resultados.changedRows > 0) {
                    console.log(valores.serialNumber+' teve valores atualizados');
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