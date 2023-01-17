(async () => {
  const theme = await window.theme.get()
  document.getElementById(`${theme}-theme`).classList.add('theme-selected')
})()

const information = document.getElementById('info')
// eslint-disable-next-line no-undef
information.innerText = `Esta aplicação está usando Chrome (v${versions.chrome()}), Node.js (v${versions.node()}) e Electron (v${versions.electron()})`

document.getElementById('light-theme').addEventListener('click', async () => {
  await window.theme.light()
  document.querySelector('.theme-selected').classList.remove('theme-selected')
  document.getElementById('light-theme').classList.add('theme-selected')
})

document.getElementById('dark-theme').addEventListener('click', async () => {
  await window.theme.dark()
  document.querySelector('.theme-selected').classList.remove('theme-selected')
  document.getElementById('dark-theme').classList.add('theme-selected')
})

document.getElementById('system-theme').addEventListener('click', async () => {
  await window.theme.system()
  document.querySelector('.theme-selected').classList.remove('theme-selected')
  document.getElementById('system-theme').classList.add('theme-selected')
})
