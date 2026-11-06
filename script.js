const API_URL = 'http://localhost:8000'

const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

let itens = []
let id // guarda o id do funcionario em edição (undefined = criando novo)

function openModal(edit = false, itemId = null) {
    modal.classList.add('active')

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active')
        }
    }

    if (edit) {
        const item = itens.find(i => i.id === itemId)
        sNome.value = item.nome
        sFuncao.value = item.funcao
        sSalario.value = item.salario
        id = itemId
    } else {
        sNome.value = ''
        sFuncao.value = ''
        sSalario.value = ''
        id = undefined
    }
}

function editItem(itemId) {
    openModal(true, itemId)
}

async function deleteItem(itemId) {
    try {
        const response = await fetch(`${API_URL}/funcionario/delete?id=${itemId}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        await loadItens()
    } catch (error) {
        console.error('Erro ao deletar item:', error)
    }
}

function insertItem(item) {
    let tr = document.createElement('tr')

    tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.funcao}</td>
        <td>R$ ${item.salario}</td>

        <td class="acao">
            <button onclick="editItem(${item.id})">
                <i class="bx bx-edit"></i>
            </button>
        </td>

        <td class="acao">
            <button onclick="deleteItem(${item.id})">
                <i class="bx bx-trash"></i>
            </button>
        </td>
    `

    tbody.appendChild(tr)
}

btnSalvar.onclick = async e => {
    e.preventDefault()

    if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
        return
    }

    const payload = {
        nome: sNome.value,
        funcao: sFuncao.value,
        salario: parseFloat(sSalario.value)
    }

    try {
        if (id !== undefined) {
            // edição -> PUT
            const response = await fetch(`${API_URL}/funcionario/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        } else {
            // novo -> POST
            const response = await fetch(`${API_URL}/funcionario/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        }

        modal.classList.remove('active')
        await loadItens()
        id = undefined
    } catch (error) {
        console.error('Erro ao salvar item:', error)
    }
}

async function loadItens() {
    try {
        const response = await fetch(`${API_URL}/funcionarios`)
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        itens = await response.json()

        tbody.innerHTML = ''
        itens.forEach(item => insertItem(item))
    } catch (error) {
        console.error('Erro ao carregar itens:', error)
    }
}

loadItens()