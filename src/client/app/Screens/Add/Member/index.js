(() => {
  // Ids
  const TOAST_ID = 'toast'
  const ADD_MEMBER_SCREEN_FORM_ID = 'add-member-screen-form'
  const ADD_MEMBER_SCREEN_TITLE_ID = 'add-member-screen-title'
  const ADD_MEMBER_NAME_LABEL_ID = 'add-member-name-label'
  const ADD_MEMBER_NAME_INPUT_ID = 'add-member-name-input'
  const ADD_MEMBER_CONGREGATED_LABEL_ID = 'add-member-congregated-label'
  const ADD_MEMBER_CONGREGATED_INPUT_ID = 'add-member-congregated-input'
  const ADD_MEMBER_SUBMIT_BUTTON_ID = 'add-member-submit-button'

  function toast ({
    text,
    type = 'success',
    duration = 5000
  }) {
    const toast = document.createElement('div')
    toast.id = TOAST_ID
    toast.className = `toast toast-${type}`

    toast.innerHTML = text

    document.body.appendChild(toast)
    const ID = setTimeout(() => {
      document.getElementById(TOAST_ID).remove()
    }, duration)

    document.getElementById(TOAST_ID).addEventListener('click', () => {
      clearTimeout(ID)
      document.getElementById(TOAST_ID).remove()
    })

    document.body.addEventListener('click', () => {
      clearTimeout(ID)
      const toast = document.getElementById(TOAST_ID)
      if (toast) toast.remove()
    })
  }

  const stateAddMemberForm = {
    name: '',
    congregated: false
  }

  function toggleDisabledSubmitButton () {
    const submitButton = document.getElementById(ADD_MEMBER_SUBMIT_BUTTON_ID)
    submitButton.disabled = !submitButton.disabled
  }

  async function saveMemberInDB () {
    try {
      toggleDisabledSubmitButton()
      const { name, congregated } = stateAddMemberForm
      const id = await window.idGen.gen()
      await window.dbMember.create({
        id,
        name,
        congregated
      })
    } finally {
      toggleDisabledSubmitButton()
    }
  }

  function createElement (tagName, id = '', className = '') {
    const element = document.createElement(tagName)
    element.id = id
    element.className = className
    return element
  }

  function createNameField () {
    const nameInput = createElement('input', ADD_MEMBER_NAME_INPUT_ID, 'name-input')
    nameInput.setAttribute('type', 'text')
    nameInput.setAttribute('placeholder', 'Escreva o nome completo do membro aqui')
    nameInput.setAttribute('required', true)

    nameInput.addEventListener('keyup', (event) => {
      stateAddMemberForm.name = event.target.value
      event.target.value = stateAddMemberForm.name
    })

    const nameLabel = createElement('label', ADD_MEMBER_NAME_LABEL_ID, 'name-label')
    nameLabel.setAttribute('for', ADD_MEMBER_NAME_INPUT_ID)
    nameLabel.appendChild(nameInput)

    return nameLabel
  }

  function createCongregatedField () {
    const congregatedInput = createElement('input', ADD_MEMBER_CONGREGATED_INPUT_ID, 'congregated-input')
    congregatedInput.setAttribute('type', 'checkbox')

    congregatedInput.addEventListener('change', (event) => {
      stateAddMemberForm.congregated = event.target.checked
      event.target.checked = stateAddMemberForm.congregated
    })

    const congregatedLabel = createElement('label', ADD_MEMBER_CONGREGATED_LABEL_ID, 'congregated-label')
    congregatedLabel.setAttribute('for', ADD_MEMBER_CONGREGATED_INPUT_ID)
    congregatedLabel.innerText = 'É Congregado? '
    congregatedLabel.appendChild(congregatedInput)

    return congregatedLabel
  }

  function createAddMemberScreen () {
    const form = createElement('form', ADD_MEMBER_SCREEN_FORM_ID, 'add-member-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', ADD_MEMBER_SCREEN_TITLE_ID, 'add-member-title')
    title.innerText = 'Cadastrar Membro'

    const nameInput = createNameField()

    const congregatedInput = createCongregatedField()

    const submitButton = createElement('button', ADD_MEMBER_SUBMIT_BUTTON_ID, 'submit-button')
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

      saveMemberInDB().then(() => {
        const { name } = stateAddMemberForm
        toast({
          text: `Membro <strong>${name.split(' ')[0]}</strong> cadastrado com sucesso!`
        })
        document.getElementById(ADD_MEMBER_NAME_INPUT_ID).value = ''
        document.getElementById(ADD_MEMBER_CONGREGATED_INPUT_ID).checked = false
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
