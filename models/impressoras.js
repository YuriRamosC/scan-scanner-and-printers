
const moment = require('moment');
const conexao = require('../infra/conexao');
const request = require('request');

const hostname ='https://api.printwayy.com';
const printers_path='/devices/v1/printers';

//5542C0E2-6C0F-43F1-B576-5056CED690B1

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

    listaDevour(res) {
        request(`${hostname}${printers_path}`, (err, req, body) =>{
            console.log(body);
        });
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