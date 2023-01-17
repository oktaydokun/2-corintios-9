(() => {
  // Ids
  const TOAST_ID = 'toast'
  const ADD_OFFER_SCREEN_FORM_ID = 'add-offer-screen-form'
  const ADD_OFFER_SCREEN_TITLE_ID = 'add-offer-screen-title'
  const ADD_OFFER_MEMBER_ID_LABEL_ID = 'add-offer-member-id-label'
  const ADD_OFFER_MEMBER_ID_SELECT_ID = 'add-offer-member-id-select'
  const ADD_OFFER_VALUE_LABEL_ID = 'add-offer-value-label'
  const ADD_OFFER_VALUE_INPUT_ID = 'add-offer-value-input'
  const ADD_OFFER_MONTH_LABEL_ID = 'add-offer-month-label'
  const ADD_OFFER_MONTH_SELECT_ID = 'add-offer-month-select'
  const ADD_OFFER_YEAR_LABEL_ID = 'add-offer-year-label'
  const ADD_OFFER_YEAR_SELECT_ID = 'add-offer-year-select'
  const ADD_OFFER_SUBMIT_BUTTON_ID = 'add-offer-submit-button'

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

  const stateAddOfferForm = {
    memberId: '',
    value: '',
    referenceMonth: '',
    referenceYear: ''
  }

  function toggleDisabledSubmitButton () {
    const submitButton = document.getElementById(ADD_OFFER_SUBMIT_BUTTON_ID)
    submitButton.disabled = !submitButton.disabled
  }

  async function saveOfferInDB () {
    try {
      toggleDisabledSubmitButton()
      const { memberId, value, referenceMonth, referenceYear } = stateAddOfferForm
      const id = await window.idGen.gen()
      await window.dbOffer.create({
        id,
        member_id: memberId || null,
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
    const memberIdSelect = createElement('select', ADD_OFFER_MEMBER_ID_SELECT_ID, 'member-id-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione o membro'
    firstOption.selected = true
    memberIdSelect.appendChild(firstOption)

    memberIdSelect.addEventListener('change', (event) => {
      stateAddOfferForm.memberId = event.target.value
      event.target.value = stateAddOfferForm.memberId
    })

    const memberIdLabel = createElement('label', ADD_OFFER_MEMBER_ID_LABEL_ID, 'member-id-label')
    memberIdLabel.setAttribute('for', ADD_OFFER_MEMBER_ID_SELECT_ID)
    memberIdLabel.appendChild(memberIdSelect)

    return memberIdLabel
  }

  function createValueField () {
    const valueInput = createElement('input', ADD_OFFER_VALUE_INPUT_ID, 'value-input')
    valueInput.setAttribute('type', 'text')
    valueInput.setAttribute('placeholder', 'Valor da oferta')
    valueInput.setAttribute('required', true)

    valueInput.addEventListener('keyup', (event) => {
      const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(event.target.value) || event.target.value === ''
      if (!validateValue) {
        event.target.value = stateAddOfferForm.value
        return
      }
      const valueEdit = event.target.value.match(/\d|\.|,/g) || ''
      const value = valueEdit.length ? valueEdit.join('') : ''

      stateAddOfferForm.value = value.replace(',', '.')
      event.target.value = stateAddOfferForm.value
    })

    valueInput.addEventListener('blur', (event) => {
      const value = event.target.value ? parseFloat(event.target.value).toFixed(2) : ''
      stateAddOfferForm.value = value
      event.target.value = stateAddOfferForm.value
    })

    const valueLabel = createElement('label', ADD_OFFER_VALUE_LABEL_ID, 'value-label')
    valueLabel.setAttribute('for', ADD_OFFER_VALUE_INPUT_ID)
    valueLabel.innerText = 'R$ '
    valueLabel.appendChild(valueInput)

    return valueLabel
  }

  function createMonthField () {
    const monthSelect = createElement('select', ADD_OFFER_MONTH_SELECT_ID, 'month-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione o mês'
    firstOption.disabled = true
    firstOption.selected = true
    monthSelect.appendChild(firstOption)
    monthSelect.setAttribute('required', true)

    monthSelect.addEventListener('change', (event) => {
      stateAddOfferForm.referenceMonth = event.target.value
      event.target.value = stateAddOfferForm.referenceMonth
    })

    const monthLabel = createElement('label', ADD_OFFER_MONTH_LABEL_ID, 'month-label')
    monthLabel.setAttribute('for', ADD_OFFER_MONTH_SELECT_ID)
    monthLabel.appendChild(monthSelect)

    return monthLabel
  }

  function createYearField () {
    const yearSelect = createElement('select', ADD_OFFER_YEAR_SELECT_ID, 'year-select')
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
      stateAddOfferForm.referenceYear = event.target.value
      event.target.value = stateAddOfferForm.referenceYear
    })

    const yearLabel = createElement('label', ADD_OFFER_YEAR_LABEL_ID, 'year-label')
    yearLabel.setAttribute('for', ADD_OFFER_YEAR_SELECT_ID)
    yearLabel.appendChild(yearSelect)

    return yearLabel
  }

  function createAddOfferScreen () {
    const form = createElement('form', ADD_OFFER_SCREEN_FORM_ID, 'add-offer-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', ADD_OFFER_SCREEN_TITLE_ID, 'add-offer-title')
    title.innerText = 'Cadastrar Oferta'

    const memberIdSelect = createMemberIdField()

    const valueInput = createValueField()

    const monthSelect = createMonthField()

    const yearSelect = createYearField()

    const submitButton = createElement('button', ADD_OFFER_SUBMIT_BUTTON_ID, 'submit-button')
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

      const { value } = stateAddOfferForm

      const isGreaterThanZero = parseFloat(value) > 0

      if (!isGreaterThanZero) {
        toast({
          text: 'O valor da oferta deve ser maior que zero!',
          type: 'error'
        })
        return
      }

      saveOfferInDB().then(() => {
        toast({
          text: 'Oferta cadastrada com sucesso!'
        })
        document.getElementById(ADD_OFFER_MEMBER_ID_SELECT_ID).value = ''
        document.getElementById(ADD_OFFER_VALUE_INPUT_ID).value = ''
        document.getElementById(ADD_OFFER_MONTH_SELECT_ID).value = ''
        document.getElementById(ADD_OFFER_YEAR_SELECT_ID).value = ''
        stateAddOfferForm.memberId = ''
        stateAddOfferForm.value = ''
        stateAddOfferForm.referenceMonth = ''
        stateAddOfferForm.referenceYear = ''
      }).catch((error) => {
        toast({
          text: `Erro ao cadastrar Oferta: ${error}`,
          type: 'error'
        })
      })
    })

    document.getElementById('main-content').appendChild(form)
  }

  createAddOfferScreen()

  getRegisteredMembers().then((members) => {
    members.forEach(({ id, name }) => {
      const option = document.createElement('option')
      option.value = id
      option.innerHTML = `${id} - ${name}`
      document.getElementById('add-offer-member-id-select').appendChild(option)
    })
  })

  getMonths().then((months) => {
    for (let index = 0; index < months.length; index += 1) {
      const option = document.createElement('option')
      option.value = index + 1
      option.innerHTML = months[index]
      document.getElementById('add-offer-month-select').appendChild(option)
    }
  })
})()
