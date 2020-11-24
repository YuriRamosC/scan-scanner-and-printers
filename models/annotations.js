const conexao = require('../infra/conexao');
const fs = require('fs');
const Devourer = require('../controllers/devourer');
const { waitForDebugger } = require('inspector');
const { resolve } = require('path');
const codename = require('../controllers/codename');
const { error } = require('console');
require('marko/node-require').install();
require('marko/express');

class Annotation {
    adiciona(annotation, res) {
        const sql = 'INSERT INTO Anotacoes SET ?'
        conexao.query(sql, annotation, (erro, resultados) => {
            if (erro) {
            } 
            else {
                res.status(201).json(annotation);
            }
        })
    }

    altera(id, valores, res) {
        const sql = 'UPDATE Anotacoes SET ? WHERE id=?';
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                this.altera(id, valores, res);
            }
        });
    }
    lista(res, callback) {
        const sql = 'SELECT * FROM Anotacoes'
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                callback(resultados);
            }
        })
    }
    buscaPorId(id, res, callback) {
        const sql = `SELECT * FROM Anotacoes WHERE id = ${id}`;
        conexao.query(sql, (erro, resultados) => {
            const annotation = resultados[0];
            if (erro) {
                res.status(400).json(erro);
            } else {
                callback(annotation);
            }
        })
    }
    deleta(id, res) {
        const sql = 'DELETE FROM Anotacoes WHERE id=?'
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