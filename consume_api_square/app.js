async function getImages() {
    const listDiv = document.querySelector('.list')

    const response = await fetch(`http://localhost:8081/images`)
    
    const data = await response.json()

    console.log(data)

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
getImages();

async function showImage(id) {
    const showDiv = document.querySelector('.show')

    showDiv.style.display = 'block'

    const response = await fetch(`http://localhost:8081/images/${id}`)

    const data = await response.json()

    showDiv.innerHTML = `
        <h1>Nick: ${data.name}</h1>
        <p>URL: ${data.url}</p>
    `
}

async function sendDataOnBank() {
    const nameInput = document.querySelector('.nameInp')
    const urlInput = document.querySelector('.urlInp')

    const obj = {
        name: nameInput.value,
        url: urlInput.value
    }

   try {
    await fetch('http://localhost:8081/images', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(obj)
    })

    nameInput.value = ''
    urlInput.value = ''
    getImages()
    
   } catch (error) {
       console.log(error)
   }
}

async function insertDataForUpdate(id) {
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

async function editImage() {
    const nameInput = document.querySelector('.nameInp')
    const urlInput = document.querySelector('.urlInp')
    const idInput = document.querySelector('.idInp')
    const obj = {
        id: idInput.value,
        name: nameInput.value,
        url: urlInput.value
    }

    await fetch('http://localhost:8081/images', {
        headers : { 
            'Content-Type': 'application/json'
        },
        method: 'put',
        body: JSON.stringify(obj)
    })

    getImages()
}

async function deleteImage(id) {
    await fetch(`http://localhost:8081/images/${id}`, {
        headers : { 
            'Content-Type': 'application/json'
        },
        method: 'delete'
    })

    getImages()
}