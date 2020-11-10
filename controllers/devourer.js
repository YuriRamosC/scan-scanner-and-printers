const fs = require('fs');
const request = require('request');
const Impressora = require('../models/impressoras');
const hostname = 'https://api.printwayy.com';
const printers_path = '/devices/v1/printers';
const urlBase = `${hostname}${printers_path}`;
const headers = {
    'printwayy-key': '5542C0E2-6C0F-43F1-B576-5056CED690B1'
};


class Devourer {
    requestPrintWayy(skip, impressorasAtualizadas) {
        return new Promise((resolve, reject) => {
            let string = '';
            let skipString = '';
            let requestReturn;
            if (skip > 0) {
                skipString = '?skip=' + skip;
            }
            let urlFinal = urlBase + skipString;
            request({ url: urlFinal, headers: headers }, (err, req, resp) => {
                if (err) {
                    console.log(err);
                    alert(err);
                } else {
                    let biribinha = JSON.parse(resp);
                    var impressoras = biribinha.data;
                    //percorrendo o JSON recebido
                    for (var row in impressoras) {
                        //SQL //
                        let customerName = '';
                        let ipFinal = '';
                        if (impressoras[row].customer != null) {
                            customerName = impressoras[row].customer.name;
                        }
                        if (impressoras[row].ipAdress != 'NULL') {
                            ipFinal = impressoras[row].ipAddress;
                        }
                        impressorasAtualizadas.push({
                            id_way: impressoras[row].id,
                            tipo_conexao: impressoras[row].type,
                            status: impressoras[row].status,
                            serialNumber: impressoras[row].serialNumber,
                            lastCommunication: impressoras[row].lastCommunication,
                            installationPoint: impressoras[row].installationPoint,
                            observation: impressoras[row].observation,
                            ipAddress: ipFinal,
                            manufacturer: impressoras[row].manufacturer,
                            model: impressoras[row].model,
                            customer_name: customerName
                        });
                    }
                }
                if (skip == 0) {
                    resolve(this.requestPrintWayy(100, impressorasAtualizadas));
                } else if (skip == 100) {
                    resolve(this.requestPrintWayy(200, impressorasAtualizadas));
                } else if (skip == 200) {
                    resolve(Impressora.gravarImpressorasBD(impressorasAtualizadas, resp));
                }
                /// console.log('Essa é a Promise: '+skip);
            });
        });
    }

    tratarDados(impressorasAtualizadas) {
        return new Promise((resolve, reject) => {

            this.requestPrintWayy(0, impressorasAtualizadas);

            resolve(impressorasAtualizadas);
        });

    };
}
module.exports = new Devourer;