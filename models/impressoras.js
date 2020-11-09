
const moment = require('moment');
const conexao = require('../infra/conexao');
const request = require('request');
const fs = require('fs');
const hostname = 'https://api.printwayy.com';
const printers_path = '/devices/v1/printers';
const url = `${hostname}${printers_path}`;
const headers = {
    'printwayy-key': '5542C0E2-6C0F-43F1-B576-5056CED690B1'
};

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
        let biribinha;
        var impressoras;
        let string = '';
        request({ url: url, headers: headers }, (err, req, resp) => {
            if (err) {
                console.log(err);
                alert(err);
            } else {
                biribinha = JSON.parse(resp);
                impressoras = biribinha.data;
            }
        });
        console.log(impressoras);
        //percorrendo o JSON recebido
        for (var row in impressoras) {
            //SQL //
            string += JSON.stringify(impressoras[row], null, 4);
        }
        // aqui finaliza
        fs.writeFile('impressoras.txt', string, function (err) {
            if (err) return console.log(err);
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