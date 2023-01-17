(() => {
  // Ids
  const TOAST_ID = 'toast'
  const ADD_TITHE_SCREEN_FORM_ID = 'add-tithe-screen-form'
  const ADD_TITHE_SCREEN_TITLE_ID = 'add-tithe-screen-title'
  const ADD_TITHE_MEMBER_ID_LABEL_ID = 'add-tithe-member-id-label'
  const ADD_TITHE_MEMBER_ID_SELECT_ID = 'add-tithe-member-id-select'
  const ADD_TITHE_VALUE_LABEL_ID = 'add-tithe-value-label'
  const ADD_TITHE_VALUE_INPUT_ID = 'add-tithe-value-input'
  const ADD_TITHE_MONTH_LABEL_ID = 'add-tithe-month-label'
  const ADD_TITHE_MONTH_SELECT_ID = 'add-tithe-month-select'
  const ADD_TITHE_YEAR_LABEL_ID = 'add-tithe-year-label'
  const ADD_TITHE_YEAR_SELECT_ID = 'add-tithe-year-select'
  const ADD_TITHE_SUBMIT_BUTTON_ID = 'add-tithe-submit-button'

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

  const stateAddTitheForm = {
    memberId: '',
    value: '',
    referenceMonth: '',
    referenceYear: ''
  }

  function toggleDisabledSubmitButton () {
    const submitButton = document.getElementById(ADD_TITHE_SUBMIT_BUTTON_ID)
    submitButton.disabled = !submitButton.disabled
  }

  async function saveTitheInDB () {
    try {
      toggleDisabledSubmitButton()
      const { memberId, value, referenceMonth, referenceYear } = stateAddTitheForm
      const id = await window.idGen.gen()
      await window.dbTithe.create({
        id,
        member_id: memberId,
        value: parseFloat(value),
        reference_month: referenceMonth,
        reference_year: referenceYear
      })
    } finally {
      toggleDisabledSubmitButton()
    }
  }

  async function getRegisteredMembers () {
    return await window.dbMember.getAll()
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

  function createMemberIdField () {
    const memberIdSelect = createElement('select', ADD_TITHE_MEMBER_ID_SELECT_ID, 'member-id-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione o membro'
    firstOption.disabled = true
    firstOption.selected = true
    memberIdSelect.appendChild(firstOption)
    memberIdSelect.setAttribute('required', true)

    memberIdSelect.addEventListener('change', (event) => {
      stateAddTitheForm.memberId = event.target.value
      event.target.value = stateAddTitheForm.memberId
    })

    const memberIdLabel = createElement('label', ADD_TITHE_MEMBER_ID_LABEL_ID, 'member-id-label')
    memberIdLabel.setAttribute('for', ADD_TITHE_MEMBER_ID_SELECT_ID)
    memberIdLabel.appendChild(memberIdSelect)

    return memberIdLabel
  }

  function createValueField () {
    const valueInput = createElement('input', ADD_TITHE_VALUE_INPUT_ID, 'value-input')
    valueInput.setAttribute('type', 'text')
    valueInput.setAttribute('placeholder', 'Valor do dízimo')
    valueInput.setAttribute('required', true)

    valueInput.addEventListener('keyup', (event) => {
      const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(event.target.value) || event.target.value === ''
      if (!validateValue) {
        event.target.value = stateAddTitheForm.value
        return
      }
      const valueEdit = event.target.value.match(/\d|\.|,/g) || ''
      const value = valueEdit.length ? valueEdit.join('') : ''

      stateAddTitheForm.value = value.replace(',', '.')
      event.target.value = stateAddTitheForm.value
    })

    valueInput.addEventListener('blur', (event) => {
      const value = event.target.value ? parseFloat(event.target.value).toFixed(2) : ''
      stateAddTitheForm.value = value
      event.target.value = stateAddTitheForm.value
    })

    const valueLabel = createElement('label', ADD_TITHE_VALUE_LABEL_ID, 'value-label')
    valueLabel.setAttribute('for', ADD_TITHE_VALUE_INPUT_ID)
    valueLabel.innerText = 'R$ '
    valueLabel.appendChild(valueInput)

    return valueLabel
  }

  function createMonthField () {
    const monthSelect = createElement('select', ADD_TITHE_MONTH_SELECT_ID, 'month-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione o mês'
    firstOption.disabled = true
    firstOption.selected = true
    monthSelect.appendChild(firstOption)
    monthSelect.setAttribute('required', true)

    monthSelect.addEventListener('change', (event) => {
      stateAddTitheForm.referenceMonth = event.target.value
      event.target.value = stateAddTitheForm.referenceMonth
    })

    const monthLabel = createElement('label', ADD_TITHE_MONTH_LABEL_ID, 'month-label')
    monthLabel.setAttribute('for', ADD_TITHE_MONTH_SELECT_ID)
    monthLabel.appendChild(monthSelect)

    return monthLabel
  }

  function createYearField () {
    const yearSelect = createElement('select', ADD_TITHE_YEAR_SELECT_ID, 'year-select')
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
      stateAddTitheForm.referenceYear = event.target.value
      event.target.value = stateAddTitheForm.referenceYear
    })

    const yearLabel = createElement('label', ADD_TITHE_YEAR_LABEL_ID, 'year-label')
    yearLabel.setAttribute('for', ADD_TITHE_YEAR_SELECT_ID)
    yearLabel.appendChild(yearSelect)

    return yearLabel
  }

  function createAddTitheScreen () {
    const form = createElement('form', ADD_TITHE_SCREEN_FORM_ID, 'add-tithe-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', ADD_TITHE_SCREEN_TITLE_ID, 'add-tithe-title')
    title.innerText = 'Cadastrar Dízimo'

    const memberIdSelect = createMemberIdField()

    const valueInput = createValueField()

    const monthSelect = createMonthField()

    const yearSelect = createYearField()

    const submitButton = createElement('button', ADD_TITHE_SUBMIT_BUTTON_ID, 'submit-button')
    submitButton.setAttribute('type', 'submit')
    submitButton.innerText = 'CADASTRAR'

    const div = createElement('div')

    div.appendChild(memberIdSelect)
    div.appendChild(valueInput)
    div.appendChild(monthSelect)
    div.appendChild(yearSelect)

    fieldset.appendChild(title)
    fieldset.appendChild(div)

    form.appendChild(fieldset)
    form.appendChild(submitButton)

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const { value } = stateAddTitheForm

      const isGreaterThanZero = parseFloat(value) > 0

      if (!isGreaterThanZero) {
        toast({
          text: 'O valor do dízimo deve ser maior que zero!',
          type: 'error'
        })
        return
      }

      saveTitheInDB().then(() => {
        toast({
          text: 'Dízimo cadastrado com sucesso!'
        })
        document.getElementById(ADD_TITHE_MEMBER_ID_SELECT_ID).value = ''
        document.getElementById(ADD_TITHE_VALUE_INPUT_ID).value = ''
        document.getElementById(ADD_TITHE_MONTH_SELECT_ID).value = ''
        document.getElementById(ADD_TITHE_YEAR_SELECT_ID).value = ''
        stateAddTitheForm.memberId = ''
        stateAddTitheForm.value = ''
        stateAddTitheForm.referenceMonth = ''
        stateAddTitheForm.referenceYear = ''
      }).catch((error) => {
        toast({
          text: `Erro ao cadastrar Dízimo: ${error}`,
          type: 'error'
        })
      })
    })

    document.getElementById('main-content').appendChild(form)
  }

  createAddTitheScreen()

  getRegisteredMembers().then((members) => {
    members.forEach(({ id, name }) => {
      const option = document.createElement('option')
      option.value = id
      option.innerHTML = `${id} - ${name}`
      document.getElementById(ADD_TITHE_MEMBER_ID_SELECT_ID).appendChild(option)
    })
  })

  getMonths().then((months) => {
    for (let index = 0; index < months.length; index += 1) {
      const option = document.createElement('option')
      option.value = index + 1
      option.innerHTML = months[index]
      document.getElementById(ADD_TITHE_MONTH_SELECT_ID).appendChild(option)
    }
  })
})()
