function openAndCloseMenuLabels () {
  Array.from(
    document.querySelectorAll('.main-menu-label')
  ).forEach((element) => {
    element.addEventListener('mouseenter', () => {
      element.querySelector('.sub-menu-labels').style.display = 'block'
    })

    element.addEventListener('mouseleave', () => {
      element.querySelector('.sub-menu-labels').style.display = 'none'
    })
  })
}

openAndCloseMenuLabels()

function createMainScript (src) {
  const oldScript = document.getElementById('main-script')

  if (oldScript) oldScript.remove()

  const script = document.createElement('script')
  script.setAttribute('id', 'main-script')
  script.setAttribute('src', src)

  document.body.appendChild(script)
}

function openScreen (src) {
  document.getElementById('main-content').innerHTML = ''
  createMainScript(src)
};

const ADD_MEMBER_SRC = './app/Screens/Add/Member/index.js'
const ADD_TITHE_SRC = './app/Screens/Add/Tithe/index.js'
const ADD_OFFER_SRC = './app/Screens/Add/Offer/index.js'
const ADD_DISPENSE_CATEGORY_SRC = './app/Screens/Add/DispenseCategory/index.js'
const ADD_DISPENSE_SRC = './app/Screens/Add/Dispense/index.js'

document.getElementById('add-member')
  .addEventListener('click', () => {
    openScreen(ADD_MEMBER_SRC)
  })

document.getElementById('add-tithe')
  .addEventListener('click', () => {
    openScreen(ADD_TITHE_SRC)
  })

document.getElementById('add-offer')
  .addEventListener('click', () => {
    openScreen(ADD_OFFER_SRC)
  })

document.getElementById('add-dispense-category')
  .addEventListener('click', () => {
    openScreen(ADD_DISPENSE_CATEGORY_SRC)
  })

document.getElementById('add-dispense')
  .addEventListener('click', () => {
    openScreen(ADD_DISPENSE_SRC)
  })
