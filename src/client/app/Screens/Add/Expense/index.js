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
    const expenseCategoryIdSelect = createElement('select', 'add-expense-category-id-select', 'expense-category-id-select')
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

    const expenseCategoryIdLabel = createElement('label', 'add-expense-category-id-label', 'expense-category-id-label')
    expenseCategoryIdLabel.setAttribute('for', 'add-expense-category-id-select')
    expenseCategoryIdLabel.appendChild(expenseCategoryIdSelect)

    return expenseCategoryIdLabel
  }

  function createTitleField () {
    const titleInput = createElement('input', 'add-expense-title-input', 'title-input')
    titleInput.setAttribute('type', 'text')
    titleInput.setAttribute('placeholder', 'Escreva um título para a despesa aqui')
    titleInput.setAttribute('required', true)

    titleInput.addEventListener('keyup', (event) => {
      stateAddExpenseForm.title = event.target.value
      event.target.value = stateAddExpenseForm.title
    })

    const titleLabel = createElement('label', 'add-expense-title-label', 'title-label')
    titleLabel.setAttribute('for', 'add-expense-title-input')
    titleLabel.appendChild(titleInput)

    return titleLabel
  }

  function createValueField () {
    const valueInput = createElement('input', 'add-expense-value-input', 'value-input')
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

    const valueLabel = createElement('label', 'add-expense-value-label', 'value-label')
    valueLabel.setAttribute('for', 'add-expense-value-input')
    valueLabel.innerText = 'R$ '
    valueLabel.appendChild(valueInput)

    return valueLabel
  }

  function createMonthField () {
    const monthSelect = createElement('select', 'add-expense-month-select', 'month-select')
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

    const monthLabel = createElement('label', 'add-expense-month-label', 'month-label')
    monthLabel.setAttribute('for', 'add-expense-month-select')
    monthLabel.appendChild(monthSelect)

    return monthLabel
  }

  function createYearField () {
    const yearSelect = createElement('select', 'add-expense-year-select', 'year-select')
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

    const yearLabel = createElement('label', 'add-expense-year-label', 'year-label')
    yearLabel.setAttribute('for', 'add-expense-year-select')
    yearLabel.appendChild(yearSelect)

    return yearLabel
  }

  function createAddExpenseScreen () {
    const form = createElement('form', 'add-expense-screen-form', 'add-expense-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', 'add-expense-screen-title', 'add-expense-title')
    title.innerText = 'Cadastrar Despesa'

    const expenseCategoryIdSelect = createExpenseCategoryIdField()

    const titleInput = createTitleField()

    const valueInput = createValueField()

    const monthSelect = createMonthField()

    const yearSelect = createYearField()

    const submitButton = createElement('button', 'add-expense-screen-submit-button', 'submit-button')
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
        document.getElementById('add-expense-category-id-select').value = ''
        document.getElementById('add-expense-title-input').value = ''
        document.getElementById('add-expense-value-input').value = ''
        document.getElementById('add-expense-month-select').value = ''
        document.getElementById('add-expense-year-select').value = ''

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
      document.getElementById('add-expense-category-id-select').appendChild(option)
    })
  })

  getMonths().then((months) => {
    for (let index = 0; index < months.length; index += 1) {
      const option = document.createElement('option')
      option.value = index + 1
      option.innerHTML = months[index]
      document.getElementById('add-expense-month-select').appendChild(option)
    }
  })
})()
