const { banco, contas, saques, depositos, transferencias } = require('../bancodedados');
const fns = require('date-fns');


function listarContasBancarias(req, res) {
    try {
        req.query.senha_banco === 'Cubos123Bank' ? res.status(200).json(contas) : res.status(403).json({
            mensagem: 'A senha do banco informada é inválida!'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
}

let numDaProxConta = 1
function criarContaBancaria(req, res) {
    try {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        
        if (!nome) {
            res.status(400).json({
                mensagem: 'Nome não informado!'
            })
            return;
        }

        if (!cpf) {
            res.status(400).json({
                mensagem: 'CPF não informado!'
            })
            return;
        }

        if (cpf.length !== 11){
            res.status(400).json({
                mensagem: 'Insira um CPF válido!'
            })
            return;
        }

        if (!data_nascimento) {
            res.status(400).json({
                mensagem: 'Data de Nascimento não informada!'
            })
            return;
        }

        const MaiorDeIdade = fns.differenceInCalendarYears(new Date(), fns.parseISO(data_nascimento));
        if(MaiorDeIdade < 18){
            res.status(403).json({
                mensagem: 'É preciso ser maior de idade para criar uma conta no banco!'
            })
            return;
        }
        

        if (!telefone) {
            res.status(400).json({
                mensagem: 'Telefone não informado'
            })
            return;
        }

        if(telefone.length < 11 || telefone.length > 11){
            res.status(400).json({
                mensagem: 'Informe um telefone válido!'
            })
            return;
        }

        if (!email) {
            res.status(400).json({
                mensagem: 'Email não informado!'
            })
            return;
        }

        if(!email.includes('@') || !email.includes('.')){
            res.status(400).json({
                mensagem: 'Insira um email válido!'
            })
            return;
        }

        if (!senha) {
            res.status(400).json({
                mensagem: 'Senha não informada!'
            })
            return;
        }


        const verificarCpf = contas.find(conta => conta.usuario.cpf === cpf);
        const verificarEmail = contas.find(conta => conta.usuario.email === email);
        if (verificarCpf ) {
            res.status(400).json({
                mensagem: "Já existe uma conta com o cpf informado!"
            })
            return;
        }
        if (verificarEmail ) {
            res.status(400).json({
                mensagem: "Já existe uma conta com o e-mail informado!"
            })
            return;
        }

        const novaConta = {
            numero: numDaProxConta,
            saldo: 0,
            usuario: {
                nome: nome,
                cpf: cpf,
                data_nascimento: data_nascimento,
                telefone: telefone,
                email: email,
                senha: senha
            }
        }

        contas.push(novaConta);
        numDaProxConta++;
        res.status(201).json();


    } catch (error) {
        console.log(error);
        res.status(500).json();
    }


}



function atualizarUsuarioDaConta(req, res) {
    try {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        if (!nome) {
            res.status(400).json({
                mensagem: 'Nome não informado!'
            })
            return;
        }

        if (!cpf) {
            res.status(400).json({
                mensagem: 'CPF não informado!'
            })
            return;
        }

        if (cpf.length !== 11){
            res.status(400).json({
                mensagem: 'Insira um CPF válido!'
            })
            return;
        }

        if (!data_nascimento) {
            res.status(400).json({
                mensagem: 'Data de Nascimento não informada!'
            })
            return;
        }

        const MaiorDeIdade = fns.differenceInCalendarYears(new Date(), fns.parseISO(data_nascimento));
        if(MaiorDeIdade < 18){
            res.status(403).json({
                mensagem: 'É preciso ser maior de idade para ter uma conta no banco!'
            })
            return;
        }

        if (!telefone) {
            res.status(400).json({
                mensagem: 'Telefone não informado'
            })
            return;
        }

        if(telefone.length < 11 || telefone.length > 11){
            res.status(400).json({
                mensagem: 'Informe um telefone válido!'
            })
            return;
        }

        if (!email) {
            res.status(400).json({
                mensagem: 'Email não informado!'
            })
            return;
        }

        if(!email.includes('@') || !email.includes('.')){
            res.status(400).json({
                mensagem: 'Insira um email válido!'
            })
            return;
        }

        if (!senha) {
            res.status(400).json({
                mensagem: 'Senha não informada!'
            })
            return;
        }
        

        const verificarNumConta = contas.find(conta => conta.numero === Number(req.params.numeroConta));
        if (!verificarNumConta) {
            res.status(404).json({
                mensagem: 'A conta inserida não existe!'
            })
            return;
        }

        const index = contas.findIndex(conta => conta.numero === Number(req.params.numeroConta));
        const salvarConta = contas[index];
        contas.splice(index, 1);

        const verificarCpf = contas.find(conta => conta.usuario.cpf === cpf);
        if (verificarCpf) {
            res.status(400).json({
                mensagem: 'Já existe uma conta cadastrada com o CPF informado!'
            })
            return;
        }

        const verificarEmail = contas.find(conta => conta.usuario.email === email);
        if (verificarEmail) {
            res.status(400).json({
                mensagem: 'Já existe uma conta cadastrada com o e-mail informado!'
            })
            return;
        }

        contas.splice(index, 0, salvarConta);

        verificarNumConta.usuario = {
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha
        }
        res.status(200).json();

    } catch (error) {
        console.log(error);
        res.status(500).json();
    }

}


function excluirConta(req, res) {
    try{
        const verificarNumConta = contas.find(conta => conta.numero === Number(req.params.numeroConta));
    if (!verificarNumConta) {
        res.status(404).json({
            mensagem: 'A conta inserida não existe!'
        })
        return;
    }
    const verificarSaldo = verificarNumConta.saldo === 0 ? true : false;
    if (!verificarSaldo) {
        res.status(400).json({
            mensagem: 'A conta só pode ser excluída se estiver com o saldo zerado!'
        })
        return;
    }

    const index = contas.findIndex(conta => conta.numero === Number(req.params.numeroConta));
    const salvarConta = contas[index];
    contas.splice(index, 1);

    res.status(200).json();
    }catch (error){
        console.log(error);
        res.status(500).json();
    }

}


function depositar(req, res) {
    try {
        const { numero_conta, valor } = req.body;
        if (!numero_conta) {
            res.status(400).json({
                mensagem: 'Número da conta não informado!'
            })
            return;
        }

        if (!valor) {
            res.status(400).json({
                mensagem: 'Valor do depósito não informado!'
            })
            return;
        }

        const verificarNumConta = contas.find(conta => conta.numero === Number(numero_conta));
        if (!verificarNumConta) {
            res.status(404).json({
                mensagem: 'A conta inserida não existe!'
            })
            return;
        }

        if (Number(valor) <= 0) {
            res.status(400).json({
                mensagem: 'Valor Inválido!'
            })
            return;
        }

        const pattern = 'yyyy-MM-dd HH:mm:ss'
        const dataDeposito = fns.format(new Date(), pattern);
        
        verificarNumConta.saldo += valor;
        
        const registroDeDeposito = {
            data: dataDeposito,
            numero_conta: numero_conta,
            valor: valor
        }

        depositos.push(registroDeDeposito);

        res.status(200).json();



    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
}



function sacar(req, res) {
    try {
        const { numero_conta, valor, senha } = req.body;
        if (!numero_conta) {
            res.status(400).json({
                mensagem: 'Número da conta não informado!'
            })
            return;
        }

        if (!valor) {
            res.status(400).json({
                mensagem: 'Valor do saque não informado!'
            })
            return;
        }

        if (!senha) {
            res.status(400).json({
                mensagem: 'Senha não informada'
            })
            return;
        }

        const verificarNumConta = contas.find(conta => conta.numero === Number(numero_conta));
        if (!verificarNumConta) {
            res.status(404).json({
                mensagem: 'A conta inserida não existe!'
            })
            return;
        }

        if (verificarNumConta.usuario.senha !== senha) {
            res.status(401).json({
                mensagem: 'Senha incorreta!'
            })
            return;
        }

        if (verificarNumConta.saldo === 0) {
            res.status(400).json({
                mensagem: 'A conta informada não possui saldo disponvível para saque'
            })
            return;
        } else if (verificarNumConta.saldo < valor) {
            res.status(400).json({
                mensagem: 'A conta informada não possui saldo suficiente para o valor solicitado para o saque'
            })
            return;
        }

        if (Number(valor) <= 0) {
            res.status(400).json({
                mensagem: 'Valor Inválido!'
            })
            return;
        }

        const pattern = 'yyyy-MM-dd HH:mm:ss'
        const dataSaque = fns.format(new Date(), pattern);
        
        verificarNumConta.saldo -= valor;

        const registroDeSaque = {
            data: dataSaque,
            numero_conta: numero_conta,
            valor: valor
        }

        saques.push(registroDeSaque);

        res.status(200).json();


    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
}


function transferir (req, res) {
    try {
        const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
        if (!numero_conta_origem) {
            res.status(400).json({
                mensagem: 'Número da conta de origem não informado!'
            })
            return;
        }

        if (!numero_conta_destino) {
            res.status(400).json({
                mensagem: 'Número da conta de destino não informado!'
            })
            return;
        }

        if (!valor) {
            res.status(400).json({
                mensagem: 'Valor para tranferência não informado!'
            })
            return;
        }

        if (!senha) {
            res.status(400).json({
                mensagem: 'Senha não informada!'
            })
            return;
        }

        const verificarNumContaOrigem = contas.find(conta => conta.numero === Number(numero_conta_origem));
        if (!verificarNumContaOrigem) {
            res.status(404).json({
                mensagem: 'A conta de origem inserida não existe!'
            })
            return;
        }

        const verificarNumContaDestino = contas.find(conta => conta.numero === Number(numero_conta_destino));
        if (!verificarNumContaDestino) {
            res.status(404).json({
                mensagem: 'A conta de destino inserida não existe!'
            })
            return;
        }

        if (verificarNumContaOrigem.usuario.senha !== senha) {
            res.status(401).json({
                mensagem: 'Senha incorreta!'
            })
            return;
        }

        if (verificarNumContaOrigem.saldo === 0) {
            res.status(400).json({
                mensagem: 'A conta informada não possui saldo disponvível para tranferência'
            })
            return;
        } else if (verificarNumContaOrigem.saldo < valor) {
            res.status(400).json({
                mensagem: 'A conta informada não possui saldo suficiente para o valor solicitado para a tranferência'
            })
            return;
        }

        const pattern = 'yyyy-MM-dd HH:mm:ss'
        const dataTransferencia = fns.format(new Date(), pattern);

        verificarNumContaOrigem.saldo -= valor;
        verificarNumContaDestino.saldo += valor;

        const registroTranferencia = {
            data: dataTransferencia,
            numero_conta_origem: numero_conta_origem,
            numero_conta_destino: numero_conta_destino,
            valor: valor
        }

        transferencias.push(registroTranferencia);

        res.status(200).json();

    }catch (error){
        console.log(error);
        res.status(500).json();
    }

}


function saldo (req, res){
    try {
        const { numero_conta, senha } = req.query;
        if (!numero_conta) {
            res.status(400).json({
                mensagem: 'Número da conta não informado!'
            })
            return;
        }

        if (!senha) {
            res.status(400).json({
                mensagem: 'Senha não informada!'
            })
            return;
        }

        const verificarNumConta = contas.find(conta => conta.numero === Number(numero_conta));
        if (!verificarNumConta) {
            res.status(404).json({
                mensagem: 'A conta inserida não existe!'
            })
            return;
        }

        if (verificarNumConta.usuario.senha !== senha) {
            res.status(401).json({
                mensagem: 'Senha incorreta!'
            })
            return;
        }

        res.status(200).json({
            saldo: verificarNumConta.saldo
        });

    }catch(error){
        console.log(error);
        res.status(500).json()
    }


}


function extrato (req, res) {
    try {
        const { numero_conta, senha } = req.query;

        if (!numero_conta) {
            res.status(400).json({
                mensagem: 'Número da conta não informado!'
            })
            return;
        }
       
        if (!senha) {
            res.status(400).json({
                mensagem: 'Senha não informada!'
            })
            return;
        }

        const verificarNumConta = contas.find(conta => conta.numero === Number(numero_conta));
        if (!verificarNumConta) {
            res.status(404).json({
                mensagem: 'A conta inserida não existe!'
            })
            return;
        }

        if (verificarNumConta.usuario.senha !== senha) {
            res.status(401).json({
                mensagem: 'Senha incorreta!'
            })
            return;
        }

        const transferenciasEnviadas = transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);
        const transferenciasRecebidas = transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

        res.status(200).json({
            depositos,
            saques,
            transferenciasEnviadas,
            transferenciasRecebidas
        })




    }catch(error){
        console.log(error);
        res.status(500).json();
    }

}

module.exports = { listarContasBancarias, criarContaBancaria, atualizarUsuarioDaConta, excluirConta, depositar, sacar, transferir, saldo, extrato };