const fs = require('fs');
const request = require('request');
const hostname = 'https://api.printwayy.com';
const printers_path = '/devices/v1/printers';
const urlBase = `${hostname}${printers_path}`;
const headers = {
    'printwayy-key': '5542C0E2-6C0F-43F1-B576-5056CED690B1'
};


class Devourer {
    requestPrintWayy(skip, impressorasAtualizadas) {
        try {
            let string = '';
            let skipString = '';
            if (skip > 0) {
                skipString = '?skip=' + skip;
            }
            let urlFinal = urlBase + skipString;
            return request({ url: urlFinal, headers: headers }, (err, req, resp) => {
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
                        let ipFinal ='';
                        if (impressoras[row].customer != null) {
                            customerName = impressoras[row].customer.name;
                        }
                        if(impressoras[row].ipAdress != 'NULL') {
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
                console.log(impressorasAtualizadas.length);
            });
        } finally {
            return impressorasAtualizadas;
        }
    }

    async tratarDados(impressorasAtualizadas) {
        try {
            impressorasAtualizadas = await this.requestPrintWayy(0, impressorasAtualizadas);
            impressorasAtualizadas = await this.requestPrintWayy(100, impressorasAtualizadas);
            impressorasAtualizadas = await this.requestPrintWayy(200, impressorasAtualizadas);
        } finally {
            //     console.log('Finally: ' + impressorasAtualizadas.length);
            // setTimeout(()=> {
            console.dir('Quantas impressoras tem: ' + impressorasAtualizadas.length);
            //    for (var row = 0; row < impressorasAtualizadas.length; row++) {
            //this.adiciona(impressorasAtualizadas[0], res);
            //   }
            //  }, 5000);
        }
    };
}
module.exports = new Devourer;
/*
"customer": {
        "id": "cfc6635d-0355-47ea-ae56-cb48feed6eed",
        "name": "GRINGO CONEXÕES"
    },
*/