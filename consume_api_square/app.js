class Images {
    static async get() {
        const listDiv = document.querySelector('.list')

        const response = await fetch(`http://localhost:8081/images`)
        
        const data = await response.json()

        listDiv.innerHTML = data.map(({ name, url, createdAt, updatedAt, _id }) => `
            <h1>${name}</h1>
            <p>${url}</p>
            <p>${createdAt}</p>
            <p>${updatedAt}</p>
            <button onclick="showImage('${_id}')">Ver Image</button>
            <button onclick="deleteImage('${_id}')">Deletar</button>
            <button onclick="insertDataForUpdate('${_id}')">Editar</button>
            ${_id}
        `).join('')
    }

    async post({name, url}) {

        const obj = { name, url }

        await fetch('http://localhost:8081/images', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(obj)
        })
    
        ManipulateInputs.cleanFieldInput()

        Images.get()
    }

    async put({ id, name, url }) {
        const obj = { id, name, url }
        
        await fetch('http://localhost:8081/images', {
            headers : { 
                'Content-Type': 'application/json'
            },
            method: 'put',
            body: JSON.stringify(obj)
        })
        
        ManipulateInputs.cleanFieldInput()
        
        Images.get()
    }

    async delete(id) {
        await fetch(`http://localhost:8081/images/${id}`, {
            headers : { 
                'Content-Type': 'application/json'
            },
            method: 'delete'
        })

        Images.get()
    }

    async show(id) {
        const showDiv = document.querySelector('.show')

        showDiv.style.display = 'block'

        const response = await fetch(`http://localhost:8081/images/${id}`)

        const data = await response.json()

        showDiv.innerHTML = `
            <h1>Nick: ${data.name}</h1>
            <p>URL: ${data.url}</p>
        `
    }
}
Images.get()

class Validate {
    static async findByName(name) {
        const request = await fetch('http://localhost:8081/images')
        
        const docs = await request.json()

        const namesExists = docs.map(doc => doc.name)

        for(let i = 0; i < namesExists.length; i++) {
            if(name === namesExists[i]) {
                return true;
            }
        }

        return false;
    }
}

class ManipulateInputs {
    static cleanFieldInput() {
        const nameInput = document.querySelector('.nameInp')
        const urlInput = document.querySelector('.urlInp')
        const idInput = document.querySelector('.idInp')
        nameInput.value = ''
        urlInput.value = ''
        idInput.value = ''
    }

    async insertDataInput(id) {
        const nameInput = document.querySelector('.nameInp')
        const urlInput = document.querySelector('.urlInp')
        const idInput = document.querySelector('.idInp')
        const editBtn = document.querySelector('.edit')
    
        editBtn.style.display = 'block'
    
        const showDiv = document.querySelector('.show')
    
        showDiv.style.display = 'block'
    
        const response = await fetch(`http://localhost:8081/images/${id}`)
    
        const data = await response.json()
    
        nameInput.value = data.name
        urlInput.value = data.url
        idInput.value = data._id
    }
}

//Methods that require a id------------------------------------------------------------------------

async function showImage(id) {
    const images = new Images()
    images.show(id)
}

async function deleteImage(id) {
    const images = new Images()
    await images.delete(id)
}

async function insertDataForUpdate(id) {
    const input = new ManipulateInputs()
    await input.insertDataInput(id)
}

//Edit and Put methods with Button functions--------------------------------------------------------

const sendDataBtn = document.querySelector('.sendData')
sendDataBtn.addEventListener('click', async () => {
    const nameInput = document.querySelector('.nameInp')
    const urlInput = document.querySelector('.urlInp')
    
    const nameExists = await Validate.findByName(nameInput.value)
    if(nameExists) {
        const errors = document.querySelector('.errors')
        errors.innerHTML = 'Nome Já Existe'
        return;
    }

    const images = new Images()
    images.post({
        name: nameInput.value, 
        url: urlInput.value
    })
})

const editDataBtn = document.querySelector('.edit')
editDataBtn.addEventListener('click', async () => {
    const nameInput = document.querySelector('.nameInp')
    const urlInput = document.querySelector('.urlInp')
    const idInput = document.querySelector('.idInp')

    const nameExists = await Validate.findByName(nameInput.value)
    if(nameExists) {
        const errors = document.querySelector('.errors')
        errors.innerHTML = 'Nome Já Existe';
        return;
    }

    const images = new Images()
    images.put({
        id: idInput.value,
        name: nameInput.value,
        url: urlInput.value
    })
    
    const editBtn = document.querySelector('.edit')
    
    editBtn.style.display = 'none'
})