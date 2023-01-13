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

  const stateAddExpenseCategoryForm = {
    name: ''
  }

  const saveExpenseCategoryInDB = async () => {
    const { name } = stateAddExpenseCategoryForm
    const id = await window.idGen.gen()
    const nameAlreadyExists = await window.dbExpenseCategory.getByName(name)
    if (nameAlreadyExists) throw new Error('Já existe uma categoria de despesa com esse nome')
    await window.dbExpenseCategory.create({
      id,
      name
    })
  }

  function createElement (tagName, id = '', className = '') {
    const element = document.createElement(tagName)
    element.id = id
    element.className = className
    return element
  }

  function createNameExpenseField () {
    const nameExpenseInput = createElement('input', 'add-expense-category-name-input', 'name-input')
    nameExpenseInput.setAttribute('type', 'text')
    nameExpenseInput.setAttribute('placeholder', 'Escreva o nome da categoria de despesa aqui')
    nameExpenseInput.setAttribute('required', true)

    nameExpenseInput.addEventListener('keyup', (event) => {
      stateAddExpenseCategoryForm.name = event.target.value
      event.target.value = stateAddExpenseCategoryForm.name
    })

    const nameExpenseLabel = createElement('label', 'add-expense-category-name-label', 'name-label')
    nameExpenseLabel.setAttribute('for', 'add-expense-category-name-input')
    nameExpenseLabel.appendChild(nameExpenseInput)

    return nameExpenseLabel
  }

  function createAddExpenseCategoryScreen () {
    const form = createElement('form', 'add-expense-category-screen-form', 'add-expense-category-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', 'add-expense-category-screen-title', 'add-expense-category-title')
    title.innerText = 'Cadastrar Categoria de Despesa'

    const nameExpenseInput = createNameExpenseField()

    const submitButton = createElement('button', 'add-expense-category-submit-button', 'submit-button')
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
        document.getElementById('add-expense-category-name-input').value = ''
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
