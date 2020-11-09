const moment = require('moment');
const conexao = require('../infra/conexao');
const fs = require('fs');
const Devourer = require('../controllers/devourer');
const { waitForDebugger } = require('inspector');

class Impressora {
    adiciona(impressora, res) {

        const sql = 'INSERT INTO impressoras SET ?'

        conexao.query(sql, impressora,(erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(impressora)
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
            setTimeout(()=> {
                console.dir(impressorasAtualizadas[0]);
            //    for (var row = 0; row < impressorasAtualizadas.length; row++) {
                    this.adiciona(impressorasAtualizadas[0], res);
             //   }
            }, 5000);
        }
    }

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

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = 'UPDATE impressoras SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ ...valores, id })
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