(() => {
  // Ids
  const TOAST_ID = 'toast'
  const ADD_EXPENSE_CATEGORY_SCREEN_FORM_ID = 'add-expense-category-screen-form'
  const ADD_EXPENSE_CATEGORY_SCREEN_TITLE_ID = 'add-expense-category-screen-title'
  const ADD_EXPENSE_CATEGORY_NAME_LABEL_ID = 'add-expense-category-name-label'
  const ADD_EXPENSE_CATEGORY_NAME_INPUT_ID = 'add-expense-category-name-input'
  const ADD_EXPENSE_CATEGORY_SUBMIT_BUTTON_ID = 'add-expense-category-submit-button'

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

  const stateAddExpenseCategoryForm = {
    name: ''
  }

  function toggleDisabledSubmitButton () {
    const submitButton = document.getElementById(ADD_EXPENSE_CATEGORY_SUBMIT_BUTTON_ID)
    submitButton.disabled = !submitButton.disabled
  }

  const saveExpenseCategoryInDB = async () => {
    try {
      toggleDisabledSubmitButton()
      const { name } = stateAddExpenseCategoryForm
      const id = await window.idGen.gen()
      const nameAlreadyExists = await window.dbExpenseCategory.getByName(name)
      if (nameAlreadyExists) throw new Error('Já existe uma categoria de despesa com esse nome')
      await window.dbExpenseCategory.create({
        id,
        name
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

  function createNameExpenseField () {
    const nameExpenseInput = createElement('input', ADD_EXPENSE_CATEGORY_NAME_INPUT_ID, 'name-input')
    nameExpenseInput.setAttribute('type', 'text')
    nameExpenseInput.setAttribute('placeholder', 'Escreva o nome da categoria de despesa aqui')
    nameExpenseInput.setAttribute('required', true)

    nameExpenseInput.addEventListener('keyup', (event) => {
      stateAddExpenseCategoryForm.name = event.target.value
      event.target.value = stateAddExpenseCategoryForm.name
    })

    const nameExpenseLabel = createElement('label', ADD_EXPENSE_CATEGORY_NAME_LABEL_ID, 'name-label')
    nameExpenseLabel.setAttribute('for', ADD_EXPENSE_CATEGORY_NAME_INPUT_ID)
    nameExpenseLabel.appendChild(nameExpenseInput)

    return nameExpenseLabel
  }

  function createAddExpenseCategoryScreen () {
    const form = createElement('form', ADD_EXPENSE_CATEGORY_SCREEN_FORM_ID, 'add-expense-category-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', ADD_EXPENSE_CATEGORY_SCREEN_TITLE_ID, 'add-expense-category-title')
    title.innerText = 'Cadastrar Categoria de Despesa'

    const nameExpenseInput = createNameExpenseField()

    const submitButton = createElement('button', ADD_EXPENSE_CATEGORY_SUBMIT_BUTTON_ID, 'submit-button')
    submitButton.setAttribute('type', 'submit')
    submitButton.innerText = 'CADASTRAR'

    const div = createElement('div')

    div.appendChild(nameExpenseInput)

    fieldset.appendChild(title)
    fieldset.appendChild(div)

    form.appendChild(fieldset)
    form.appendChild(submitButton)

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      saveExpenseCategoryInDB().then(() => {
        toast({
          text: 'Categoria de despesa cadastrada com sucesso!'
        })
        document.getElementById(ADD_EXPENSE_CATEGORY_NAME_INPUT_ID).value = ''
        stateAddExpenseCategoryForm.name = ''
      }).catch((error) => {
        toast({
          text: error.message,
          type: 'error'
        })
      })
    })

    document.getElementById('main-content').appendChild(form)
  }

  createAddExpenseCategoryScreen()
})()
