Array.from(document.querySelectorAll('.main-menu-label')).forEach((element) => {
  element.addEventListener('mouseenter', () => {
    element.querySelector('.sub-menu-labels').style.display = 'block'
  })

  element.addEventListener('mouseleave', () => {
    element.querySelector('.sub-menu-labels').style.display = 'none'
  })
})
