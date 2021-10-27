const express = require('express');
const {listarContasBancarias, criarContaBancaria, atualizarUsuarioDaConta, excluirConta, depositar, sacar, transferir, saldo, extrato} = require('./controlers/controlers');
const routers = express();

routers.get('/contas', listarContasBancarias);
routers.post('/contas', criarContaBancaria);
routers.put('/contas/:numeroConta/usuario', atualizarUsuarioDaConta);
routers.delete('/contas/:numeroConta', excluirConta);
routers.post('/transacoes/depositar', depositar);
routers.post('/transacoes/sacar', sacar);
routers.post('/transacoes/tranferir', transferir);
routers.get('/contas/saldo', saldo);
routers.get('/contas/extrato', extrato);



module.exports = routers;