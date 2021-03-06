const moment = require("moment")
const conexao = require("../infraestrutura/conexao")

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format("YYYY-MM-DD HH:MM:SS")
        const data = moment(atendimento.data, "DD-MM-YYYY").format("YYYY-MM-DD HH:MM:SS")

        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: "data",
                valido: dataEhValida,
                mensagem: "Data deve ser maior ou igual a data de criação"
            },
            {
                nome: "cliente",
                valido: clienteEhValido,
                mensagem: "O nome do cliente deve ter 5 ou mais caracteres"
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        const atendimentoDatado = {...atendimento, dataCriacao, data}
        
        const sql = "INSERT INTO Atendimentos SET ?"

        if(existemErros) {
            res.status(400).json(erros)
        } else {
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro) {
                    res.status(400).json(erro)
                } else {
                    res.status(201).json(`atendimento criado com sucesso`)
                }
            })
        }

        
    }

    lista(res) {
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, "DD-MM-YYYY").format("YYYY-MM-DD HH:MM:SS")
        }

        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erros, resultados) => {
            if(erros) {
                res.status(400).json(erros) 
            } else {
                res.status(200).json(`atendimento ${id} alterado`)
            }
        })
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE ID=?'

        conexao.query(sql, id, (erros, resultados) => {
            if(erros) {
                res.status(400).json(erros) 
            } else {
                res.status(200).json(`atendimento ${id} deletado`)
            }
        })
    }
}

module.exports = new Atendimento