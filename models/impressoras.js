const conexao = require('../infra/conexao');
require('marko/node-require').install();
require('marko/express');
const log = require('../controllers/log');

class Impressora {
    adiciona(impressora, res) {

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

    gravarImpressorasBD(printers, res) {
        const sql = 'INSERT INTO impressoras SET ?';
        for (let row = 0; row < printers.length; row++) {
            conexao.query(sql, printers[row], (erro, resultados) => {
                if (erro) {
                    if (erro.code === 'ER_DUP_ENTRY') {
                        if (printers[row].status == 'online' && printers[row].scan_status != 'everythingOk' && printers[row].scan_status != null) {
                            var previousStatus = printers[row].scan_status;
                            printers[row].scan_status = '';
                            log.gravarComData('[ONLINE] ' + printers[row].serialNumber + ' -> Status antigo ' + previousStatus);
                        }
                        this.altera(printers[row].id_way, printers[row], res);

                    } else {
                        res.status(400).json(erro);
                    }
                }
            });
        };
        return res.redirect('/impressoras');
    };
    newGravarImpressorasBD(printers, res) {
        const sql = 'INSERT INTO impressoras SET ?';
        var promises = [];
        var resultsJson = [];
        for (let row = 0; row < printers.length; row++) {
            promises.push(conexao.query(sql, printers[row], (erro, resultados) => {
                if (erro) {
                    if (erro.code === 'ER_DUP_ENTRY') {
                        if (printers[row].status == 'online' && printers[row].scan_status != 'everythingOk' && printers[row].scan_status != null) {
                            var previousStatus = printers[row].scan_status;
                            if (printers[row].scan_status != 'cantCheck') {
                                printers[row].scan_status = '';
                            }
                            log.gravarComData('[ONLINE] ' + printers[row].serialNumber + ' -> Status antigo ' + previousStatus);
                        }
                        this.altera(printers[row].id_way, printers[row], res);
                    } else {
                        res.status(400).json(erro);
                    }
                }
            }));
        };
        //(JSON.stringify(resultsJson))
        Promise.all(promises).then(result => {
            return res.redirect('/api-impressoras');
        });
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
                        log.gravarComData('[ONLINE][' + impressoraTest.scan_status + ']' + valores.customer_name + ' ' + valores.manufacturer + ' ' + valores.model + ' ' + valores.serialNumber);
                        if (impressoraTest.scan_status != 'everythingOk' && impressoraTest.scan_status != null) {
                            this.altera(id_way, { scan_status: 'recentlyOnline' }, res);
                        }
                    }
                    else if (valores.status == 'online' && impressoraTest.scan_status == 'recentlyOnline') {
                        this.altera(id_way, { scan_status: '' }, res);
                    }
                    else if (impressoraTest.status == 'online' && valores.status == 'offline') {
                        log.gravarComData('[OFFLINE] ' + valores.customer_name + ' ' + valores.manufacturer + ' ' + valores.model + ' ' + valores.serialNumber);
                    }
                }
                else if (valores.status == 'online' && impressoraTest.scan_status == 'recentlyOnline') {
                    this.altera(id_way, { scan_status: '' }, res);
                }
            }
        });
    }
    alteraApi(id_way, valores, res, callback) {
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
                        log.gravarComData('[ONLINE][' + impressoraTest.scan_status + ']' + valores.customer_name + ' ' + valores.manufacturer + ' ' + valores.model + ' ' + valores.serialNumber);
                        if (impressoraTest.scan_status != 'everythingOk' && impressoraTest.scan_status != null) {
                            this.altera(id_way, { scan_status: 'recentlyOnline' }, res);
                        }
                    }
                    else if (valores.status == 'online' && impressoraTest.scan_status == 'recentlyOnline') {
                        this.altera(id_way, { scan_status: '' }, res);
                    }
                    else if (impressoraTest.status == 'online' && valores.status == 'offline') {
                        log.gravarComData('[OFFLINE] ' + valores.customer_name + ' ' + valores.manufacturer + ' ' + valores.model + ' ' + valores.serialNumber);
                    }
                }
                else if (valores.status == 'online' && impressoraTest.scan_status == 'recentlyOnline') {
                    this.altera(id_way, { scan_status: '' }, res);
                }
            }
            callback(resultados);
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