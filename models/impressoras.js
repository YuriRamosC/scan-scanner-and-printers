const moment = require('moment');
const conexao = require('../infra/conexao');
const fs = require('fs');
const Devourer = require('../controllers/devourer');
const { waitForDebugger } = require('inspector');

class Impressora {
    adiciona(impressora, res) {

        const sql = 'INSERT INTO Impressoras SET ?'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(impressora)
            }
        })

    }

    lista(res) {
        const sql = 'SELECT * FROM Impressoras'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }


    async listaDevour(res) {
        var impressorasAtualizadas = [];
        var ok = 0;
        var resp = 0;

        try {
            await Devourer.requestPrintWayy(0, impressorasAtualizadas);
            await Devourer.requestPrintWayy(100, impressorasAtualizadas);
            await Devourer.requestPrintWayy(200, impressorasAtualizadas);
        } finally {
            //     console.log('Finally: ' + impressorasAtualizadas.length);
            setTimeout(function () {
                console.dir(impressorasAtualizadas[0]);
                for (var row = 0; row < impressorasAtualizadas.length; row++) {
                    Impressora.adiciona(impressorasAtualizadas[row], res);
                }
            }, 5000);
        }
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Impressoras WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const impressora = resultados[0]
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(impressora)
            }
        })
    }

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = 'UPDATE Impressoras SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ ...valores, id })
            }
        })
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Impressoras WHERE id=?'

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