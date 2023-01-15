(() => {
  // Ids
  const TOAST_ID = 'toast'
  const ADD_EXPENSE_SCREEN_FORM_ID = 'add-expense-screen-form'
  const ADD_EXPENSE_SCREEN_TITLE_ID = 'add-expense-screen-title'
  const ADD_EXPENSE_CATEGORY_ID_LABEL_ID = 'add-expense-category-id-label'
  const ADD_EXPENSE_CATEGORY_ID_SELECT_ID = 'add-expense-category-id-select'
  const ADD_EXPENSE_TITLE_LABEL_ID = 'add-expense-title-label'
  const ADD_EXPENSE_TITLE_INPUT_ID = 'add-expense-title-input'
  const ADD_EXPENSE_VALUE_LABEL_ID = 'add-expense-value-label'
  const ADD_EXPENSE_VALUE_INPUT_ID = 'add-expense-value-input'
  const ADD_EXPENSE_MONTH_LABEL_ID = 'add-expense-month-label'
  const ADD_EXPENSE_MONTH_SELECT_ID = 'add-expense-month-select'
  const ADD_EXPENSE_YEAR_LABEL_ID = 'add-expense-year-label'
  const ADD_EXPENSE_YEAR_SELECT_ID = 'add-expense-year-select'
  const ADD_EXPENSE_SCREEN_SUBMIT_BUTTON_ID = 'add-expense-screen-submit-button'

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

  const stateAddExpenseForm = {
    expenseCategoryId: '',
    title: '',
    value: '',
    referenceMonth: '',
    referenceYear: ''
  }

  async function saveExpenseInDB () {
    const { expenseCategoryId, title, value, referenceMonth, referenceYear } = stateAddExpenseForm
    const id = await window.idGen.gen()
    await window.dbExpense.create({
      id,
      expense_category_id: expenseCategoryId,
      title,
      value: parseFloat(value),
      reference_month: referenceMonth,
      reference_year: referenceYear
    })
  }

  async function getRegisteredExpenseCategories () {
    return await window.dbExpenseCategory.getAll()
  }

  async function getMonths () {
    return await window.months.get()
  }

  function createElement (tagName, id = '', className = '') {
    const element = document.createElement(tagName)
    element.id = id
    element.className = className
    return element
  }

  function createExpenseCategoryIdField () {
    const expenseCategoryIdSelect = createElement('select', ADD_EXPENSE_CATEGORY_ID_SELECT_ID, 'expense-category-id-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione a categoria da despesa'
    firstOption.disabled = true
    firstOption.selected = true
    expenseCategoryIdSelect.appendChild(firstOption)
    expenseCategoryIdSelect.setAttribute('required', true)

    expenseCategoryIdSelect.addEventListener('change', (event) => {
      stateAddExpenseForm.expenseCategoryId = event.target.value
      event.target.value = stateAddExpenseForm.expenseCategoryId
    })

    const expenseCategoryIdLabel = createElement('label', ADD_EXPENSE_CATEGORY_ID_LABEL_ID, 'expense-category-id-label')
    expenseCategoryIdLabel.setAttribute('for', ADD_EXPENSE_CATEGORY_ID_SELECT_ID)
    expenseCategoryIdLabel.appendChild(expenseCategoryIdSelect)

    return expenseCategoryIdLabel
  }

  function createTitleField () {
    const titleInput = createElement('input', ADD_EXPENSE_TITLE_INPUT_ID, 'title-input')
    titleInput.setAttribute('type', 'text')
    titleInput.setAttribute('placeholder', 'Escreva um título para a despesa aqui')
    titleInput.setAttribute('required', true)

    titleInput.addEventListener('keyup', (event) => {
      stateAddExpenseForm.title = event.target.value
      event.target.value = stateAddExpenseForm.title
    })

    const titleLabel = createElement('label', ADD_EXPENSE_TITLE_LABEL_ID, 'title-label')
    titleLabel.setAttribute('for', ADD_EXPENSE_TITLE_INPUT_ID)
    titleLabel.appendChild(titleInput)

    return titleLabel
  }

  function createValueField () {
    const valueInput = createElement('input', ADD_EXPENSE_VALUE_INPUT_ID, 'value-input')
    valueInput.setAttribute('type', 'text')
    valueInput.setAttribute('placeholder', 'Valor da despesa')
    valueInput.setAttribute('required', true)

    valueInput.addEventListener('keyup', (event) => {
      const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(event.target.value) || event.target.value === ''
      if (!validateValue) {
        event.target.value = stateAddExpenseForm.value
        return
      }
      const valueEdit = event.target.value.match(/\d|\.|,/g) || ''
      const value = valueEdit.length ? valueEdit.join('') : ''

      stateAddExpenseForm.value = value.replace(',', '.')
      event.target.value = stateAddExpenseForm.value
    })

    valueInput.addEventListener('blur', (event) => {
      const value = event.target.value ? parseFloat(event.target.value).toFixed(2) : ''
      stateAddExpenseForm.value = value
      event.target.value = stateAddExpenseForm.value
    })

    const valueLabel = createElement('label', ADD_EXPENSE_VALUE_LABEL_ID, 'value-label')
    valueLabel.setAttribute('for', ADD_EXPENSE_VALUE_INPUT_ID)
    valueLabel.innerText = 'R$ '
    valueLabel.appendChild(valueInput)

    return valueLabel
  }

  function createMonthField () {
    const monthSelect = createElement('select', ADD_EXPENSE_MONTH_SELECT_ID, 'month-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione o mês'
    firstOption.disabled = true
    firstOption.selected = true
    monthSelect.appendChild(firstOption)
    monthSelect.setAttribute('required', true)

    monthSelect.addEventListener('change', (event) => {
      stateAddExpenseForm.referenceMonth = event.target.value
      event.target.value = stateAddExpenseForm.referenceMonth
    })

    const monthLabel = createElement('label', ADD_EXPENSE_MONTH_LABEL_ID, 'month-label')
    monthLabel.setAttribute('for', ADD_EXPENSE_MONTH_SELECT_ID)
    monthLabel.appendChild(monthSelect)

    return monthLabel
  }

  function createYearField () {
    const yearSelect = createElement('select', ADD_EXPENSE_YEAR_SELECT_ID, 'year-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione o ano'
    firstOption.disabled = true
    firstOption.selected = true
    yearSelect.appendChild(firstOption)
    yearSelect.setAttribute('required', true)

    for (let year = new Date().getFullYear(); year >= 2000; year--) {
      const option = document.createElement('option')
      option.value = year
      option.innerHTML = year
      yearSelect.appendChild(option)
    }

    yearSelect.addEventListener('change', (event) => {
      stateAddExpenseForm.referenceYear = event.target.value
      event.target.value = stateAddExpenseForm.referenceYear
    })

    const yearLabel = createElement('label', ADD_EXPENSE_YEAR_LABEL_ID, 'year-label')
    yearLabel.setAttribute('for', ADD_EXPENSE_YEAR_SELECT_ID)
    yearLabel.appendChild(yearSelect)

    return yearLabel
  }

  function createAddExpenseScreen () {
    const form = createElement('form', ADD_EXPENSE_SCREEN_FORM_ID, 'add-expense-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', ADD_EXPENSE_SCREEN_TITLE_ID, 'add-expense-title')
    title.innerText = 'Cadastrar Despesa'

    const expenseCategoryIdSelect = createExpenseCategoryIdField()

    const titleInput = createTitleField()

    const valueInput = createValueField()

    const monthSelect = createMonthField()

    const yearSelect = createYearField()

    const submitButton = createElement('button', ADD_EXPENSE_SCREEN_SUBMIT_BUTTON_ID, 'submit-button')
    submitButton.setAttribute('type', 'submit')
    submitButton.innerText = 'CADASTRAR'

    const div = createElement('div')

    div.appendChild(expenseCategoryIdSelect)
    div.appendChild(titleInput)
    div.appendChild(valueInput)
    div.appendChild(monthSelect)
    div.appendChild(yearSelect)

    fieldset.appendChild(title)
    fieldset.appendChild(div)

    form.appendChild(fieldset)
    form.appendChild(submitButton)

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const { value } = stateAddExpenseForm

      const isGreaterThanZero = parseFloat(value) > 0

      if (!isGreaterThanZero) {
        toast({
          text: 'O valor da despesa deve ser maior que zero!',
          type: 'error'
        })
        return
      }

      saveExpenseInDB().then(() => {
        toast({
          text: 'Despesa cadastrada com sucesso!'
        })
        document.getElementById(ADD_EXPENSE_CATEGORY_ID_SELECT_ID).value = ''
        document.getElementById(ADD_EXPENSE_TITLE_INPUT_ID).value = ''
        document.getElementById(ADD_EXPENSE_VALUE_INPUT_ID).value = ''
        document.getElementById(ADD_EXPENSE_MONTH_SELECT_ID).value = ''
        document.getElementById(ADD_EXPENSE_YEAR_SELECT_ID).value = ''

        stateAddExpenseForm.expenseCategoryId = ''
        stateAddExpenseForm.title = ''
        stateAddExpenseForm.value = ''
        stateAddExpenseForm.referenceMonth = ''
        stateAddExpenseForm.referenceYear = ''
      }).catch((error) => {
        toast({
          text: `Erro ao cadastrar Despesa: ${error}`,
          type: 'error'
        })
      })
    })

    document.getElementById('main-content').appendChild(form)
  }

  createAddExpenseScreen()

  getRegisteredExpenseCategories().then((expenseCategories) => {
    expenseCategories.forEach(({ id, name }) => {
      const option = document.createElement('option')
      option.value = id
      option.innerHTML = `${id} - ${name}`
      document.getElementById(ADD_EXPENSE_CATEGORY_ID_SELECT_ID).appendChild(option)
    })
  })

  getMonths().then((months) => {
    for (let index = 0; index < months.length; index += 1) {
      const option = document.createElement('option')
      option.value = index + 1
      option.innerHTML = months[index]
      document.getElementById(ADD_EXPENSE_MONTH_SELECT_ID).appendChild(option)
    }
  })
})()
