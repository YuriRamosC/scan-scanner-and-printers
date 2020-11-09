const fs = require('fs');
const request = require('request');
const hostname = 'https://api.printwayy.com';
const printers_path = '/devices/v1/printers';
const urlBase = `${hostname}${printers_path}`;
const headers = {
    'printwayy-key': '5542C0E2-6C0F-43F1-B576-5056CED690B1'
};


class Devourer {
    async requestPrintWayy(skip, impressorasAtualizadas, resp) {
        try {
            let string = '';
            let skipString = '';
            if (skip > 0) {
                skipString = '?skip=' + skip;
            }
            let urlFinal = urlBase + skipString;
            request({ url: urlFinal, headers: headers }, (err, req, resp) => {
                console.log(urlFinal);
                if (err) {
                    console.log(err);
                    alert(err);
                } else {
                    let biribinha = JSON.parse(resp);
                    let impressoras = biribinha.data;
                    //percorrendo o JSON recebido
                    for (var row in impressoras) {
                        //SQL //
                        let customerName = '';
                        if (impressoras[row].customer != null) {
                            customerName = impressoras[row].customer.name;
                        }
                        impressorasAtualizadas.push({
                            id_way: impressoras[row].id,
                            tipo_conexao: impressoras[row].type,
                            status: impressoras[row].status,
                            serialNumber: impressoras[row].serialNumber,
                            lastCommunication: impressoras[row].lastCommunication,
                            installationPoint: impressoras[row].installationPoint,
                            observation: impressoras[row].observation,
                            ipAddres: impressoras[row].ipAddres,
                            manufacturer: impressoras[row].manufacturer,
                            model: impressoras[row].model,
                            customer_name: customerName
                        });
                    }
                }
                console.log(impressorasAtualizadas.length);
            });
        } finally {
            return impressorasAtualizadas;
        }
    }
}
module.exports = new Devourer;

/*
"customer": {
        "id": "cfc6635d-0355-47ea-ae56-cb48feed6eed",
        "name": "GRINGO CONEXÕES"
    },
*/