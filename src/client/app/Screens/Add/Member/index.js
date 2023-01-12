(() => {
  function toast ({
    text,
    type = 'success',
    duration = 5000
  }) {
    const toast = document.createElement('div')
    toast.id = 'toast'
    toast.className = `toast toast-${type}`

    toast.innerHTML = text

    document.body.appendChild(toast)
    const ID = setTimeout(() => {
      document.getElementById('toast').remove()
    }, duration)

    document.getElementById('toast').addEventListener('click', () => {
      clearTimeout(ID)
      document.getElementById('toast').remove()
    })

    document.body.addEventListener('click', () => {
      clearTimeout(ID)
      const toast = document.getElementById('toast')
      if (toast) toast.remove()
    })
  }

  const stateAddMemberForm = {
    name: '',
    congregated: false
  }

  const saveMemberInDB = async () => {
    const { name, congregated } = stateAddMemberForm
    const id = await window.idGen.gen()
    await window.dbMember.create({
      id,
      name,
      congregated
    })
  }

  function createElement (tagName, id = '', className = '') {
    const element = document.createElement(tagName)
    element.id = id
    element.className = className
    return element
  }

  function createNameField () {
    const nameInput = createElement('input', 'add-member-name-input', 'name-input')
    nameInput.setAttribute('type', 'text')
    nameInput.setAttribute('placeholder', 'Escreva o nome completo do membro aqui')
    nameInput.setAttribute('required', true)

    nameInput.addEventListener('keyup', (event) => {
      stateAddMemberForm.name = event.target.value
      event.target.value = stateAddMemberForm.name
    })

    const nameLabel = createElement('label', 'add-member-name-label', 'name-label')
    nameLabel.setAttribute('for', 'add-member-name-input')
    nameLabel.appendChild(nameInput)

    return nameLabel
  }

  function createCongregatedField () {
    const congregatedInput = createElement('input', 'add-member-congregated-input', 'congregated-input')
    congregatedInput.setAttribute('type', 'checkbox')

    congregatedInput.addEventListener('change', (event) => {
      stateAddMemberForm.congregated = event.target.checked
      event.target.checked = stateAddMemberForm.congregated
    })

    const congregatedLabel = createElement('label', 'add-member-congregated-label', 'congregated-label')
    congregatedLabel.setAttribute('for', 'add-member-congregated-input')
    congregatedLabel.innerText = 'É Congregado? '
    congregatedLabel.appendChild(congregatedInput)

    return congregatedLabel
  }

  function createAddMemberScreen () {
    const form = createElement('form', 'add-member-screen-form', 'add-member-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', 'add-member-screen-title', 'add-member-title')
    title.innerText = 'Cadastrar Membro'

    const nameInput = createNameField()

    const congregatedInput = createCongregatedField()

    const submitButton = createElement('button', 'add-member-submit-button', 'submit-button')
    submitButton.setAttribute('type', 'submit')
    submitButton.innerText = 'CADASTRAR'

    const div = createElement('div')

    div.appendChild(nameInput)
    div.appendChild(congregatedInput)

    fieldset.appendChild(title)
    fieldset.appendChild(div)

    form.appendChild(fieldset)
    form.appendChild(submitButton)

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const { name } = stateAddMemberForm

      if (!name) {
        toast({
          text: 'Preencha o nome do membro!',
          type: 'error'
        })
        return
      }

      saveMemberInDB().then(() => {
        toast({
          text: `Membro <strong>${name.split(' ')[0]}</strong> cadastrado com sucesso!`
        })
        document.getElementById('add-member-name-input').value = ''
        document.getElementById('add-member-congregated-input').checked = false
        stateAddMemberForm.name = ''
        stateAddMemberForm.congregated = false
      }).catch((error) => {
        toast({
          text: `Erro ao cadastrar membro: ${error.message}`,
          type: 'error'
        })
      })
    })

    document.getElementById('main-content').appendChild(form)
  }

  createAddMemberScreen()
})()
