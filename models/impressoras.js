const moment = require('moment');
const conexao = require('../infra/conexao');
const fs = require('fs');
const Devourer = require('../controllers/devourer');
const { waitForDebugger } = require('inspector');
const { resolve } = require('path');

class Impressora {
    adiciona(impressora, res) {

        console.dir(impressora);
        const sql = 'INSERT INTO impressoras SET ?'

        conexao.query(sql, impressora, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(impressora);
            }
        })

    }
    lista(res) {
        const sql = 'SELECT * FROM impressoras'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }

    gravarImpressorasBD(impressorasAtualizadas, res) {
        return new Promise((resolve, reject) => {
            console.dir('Quantas impressoras tem: ' + impressorasAtualizadas.length);
            const sql = 'INSERT INTO impressoras SET ?';
            for (var row = 0; row < impressorasAtualizadas.length; row++) {
                conexao.query(sql, impressorasAtualizadas[row], (erro, resultados) => {
                    if (erro) {
                        //res.status(400).json(erro);
                        console.log(erro);
                    }
                });
            };

            resolve(impressorasAtualizadas);
        });
    };


    buscaPorId(id, res) {
        const sql = `SELECT * FROM impressoras WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const impressora = resultados[0]
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(impressora)
            }
        })
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