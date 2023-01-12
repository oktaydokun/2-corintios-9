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

  const stateAddTitheForm = {
    memberId: '',
    value: '',
    referenceMonth: '',
    referenceYear: ''
  }

  async function saveTitheInDB () {
    const { memberId, value, referenceMonth, referenceYear } = stateAddTitheForm
    const id = await window.idGen.gen()
    await window.dbTithe.create({
      id,
      member_id: memberId,
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
    const memberIdSelect = createElement('select', 'add-tithe-member-id-select', 'member-id-select')
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

    const memberIdLabel = createElement('label', 'add-tithe-member-id-label', 'member-id-label')
    memberIdLabel.setAttribute('for', 'add-tithe-member-id-select')
    memberIdLabel.appendChild(memberIdSelect)

    return memberIdLabel
  }

  function createValueField () {
    const valueInput = createElement('input', 'add-tithe-value-input', 'value-input')
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

    const valueLabel = createElement('label', 'add-tithe-value-label', 'value-label')
    valueLabel.setAttribute('for', 'add-tithe-value-input')
    valueLabel.innerText = 'R$ '
    valueLabel.appendChild(valueInput)

    return valueLabel
  }

  function createMonthField () {
    const monthSelect = createElement('select', 'add-tithe-month-select', 'month-select')
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

    const monthLabel = createElement('label', 'add-tithe-month-label', 'month-label')
    monthLabel.setAttribute('for', 'add-tithe-month-select')
    monthLabel.appendChild(monthSelect)

    return monthLabel
  }

  function createYearField () {
    const yearSelect = createElement('select', 'add-tithe-year-select', 'year-select')
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

    const yearLabel = createElement('label', 'add-tithe-year-label', 'year-label')
    yearLabel.setAttribute('for', 'add-tithe-year-select')
    yearLabel.appendChild(yearSelect)

    return yearLabel
  }

  function createAddTitheScreen () {
    const form = createElement('form', 'add-tithe-screen-form', 'add-tithe-form')

    const fieldset = createElement('fieldset')
    const title = createElement('legend', 'add-tithe-screen-title', 'add-tithe-title')
    title.innerText = 'Cadastrar Dízimo'

    const memberIdSelect = createMemberIdField()

    const valueInput = createValueField()

    const monthSelect = createMonthField()

    const yearSelect = createYearField()

    const submitButton = createElement('button', 'add-tithe-submit-button', 'submit-button')
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
        document.getElementById('add-tithe-member-id-select').value = ''
        document.getElementById('add-tithe-value-input').value = ''
        document.getElementById('add-tithe-month-select').value = ''
        document.getElementById('add-tithe-year-select').value = ''
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
      document.getElementById('add-tithe-member-id-select').appendChild(option)
    })
  })

  getMonths().then((months) => {
    for (let index = 0; index < months.length; index += 1) {
      const option = document.createElement('option')
      option.value = index + 1
      option.innerHTML = months[index]
      document.getElementById('add-tithe-month-select').appendChild(option)
    }
  })
})()
