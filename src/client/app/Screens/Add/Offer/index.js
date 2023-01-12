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

  const stateAddOfferForm = {
    memberId: '',
    value: '',
    referenceMonth: '',
    referenceYear: ''
  }

  async function saveOfferInDB () {
    const { memberId, value, referenceMonth, referenceYear } = stateAddOfferForm
    const id = await window.idGen.gen()
    await window.dbOffer.create({
      id,
      member_id: memberId || null,
      value: parseFloat(value),
      reference_month: referenceMonth,
      reference_year: referenceYear
    })
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
    const memberIdSelect = createElement('select', 'add-offer-member-id-select', 'member-id-select')
    const firstOption = document.createElement('option')
    firstOption.value = ''
    firstOption.innerHTML = 'Selecione o membro'
    firstOption.selected = true
    memberIdSelect.appendChild(firstOption)

    memberIdSelect.addEventListener('change', (event) => {
      stateAddOfferForm.memberId = event.target.value
      event.target.value = stateAddOfferForm.memberId
    })

    const memberIdLabel = createElement('label', 'add-offer-member-id-label', 'member-id-label')
    memberIdLabel.setAttribute('for', 'add-offer-member-id-select')
    memberIdLabel.appendChild(memberIdSelect)

    return memberIdLabel
  }

  function createValueField () {
    const valueInput = createElement('input', 'add-offer-value-input', 'value-input')
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

    const valueLabel = createElement('label', 'add-offer-value-label', 'value-label')
    valueLabel.setAttribute('for', 'add-offer-value-input')
    valueLabel.innerText = 'R$ '
    valueLabel.appendChild(valueInput)

    return valueLabel
  }

  function createMonthField () {
    const monthSelect = createElement('select', 'add-offer-month-select', 'month-select')
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

    const monthLabel = createElement('label', 'add-offer-month-label', 'month-label')
    monthLabel.setAttribute('for', 'add-offer-month-select')
    monthLabel.appendChild(monthSelect)

    return monthLabel
  }

  function createYearField () {
    const yearSelect = createElement('select', 'add-offer-year-select', 'year-select')
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

    const yearLabel = createElement('label', 'add-offer-year-label', 'year-label')
    yearLabel.setAttribute('for', 'add-offer-year-select')
    yearLabel.appendChild(yearSelect)

    return yearLabel
  }

  function createAddOfferScreen () {
    const form = createElement('form', 'add-offer-screen-form', 'add-offer-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', 'add-offer-screen-title', 'add-offer-title')
    title.innerText = 'Cadastrar Oferta'

    const memberIdSelect = createMemberIdField()

    const valueInput = createValueField()

    const monthSelect = createMonthField()

    const yearSelect = createYearField()

    const submitButton = createElement('button', 'add-offer-submit-button', 'submit-button')
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
        document.getElementById('add-offer-member-id-select').value = ''
        document.getElementById('add-offer-value-input').value = ''
        document.getElementById('add-offer-month-select').value = ''
        document.getElementById('add-offer-year-select').value = ''
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
