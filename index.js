document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token')

  if (!token) {
    // Если токена нет, просто выходим (пользователь увидит кнопку "Login")
    return
  }
  // Если токен есть — пытаемся авторизоваться автоматически
  loadUserData(token)
})

async function loadUserData(token) {
  try {
    const response = await fetch('http://localhost:8000/api/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Тот самый "паспорт"
      },
    })

    if (response.ok) {
      const data = await response.json()
      // Если сервер подтвердил токен, обновляем UI (имя пользователя)
      openFormBtn.classList.add('is-hidden')
      usernameBtn.textContent = data.username
      userProfileBlock.classList.remove('is-hidden')
    } else {
      // Если токен плохой/просрочен — чистим мусор
      localStorage.removeItem('token')
    }
  } catch (err) {
    console.error('Ошибка при проверке токена:', err)
  }
}
const notiBlock = document.querySelector('.sign-popup')
const notiText = document.querySelector('.sign-popup__text')
function showPopup(message) {
  notiText.textContent = message
  notiBlock.classList.add('show')
  setTimeout(() => {
    notiBlock.classList.remove('show')
  }, 2000)
}

// ######################## VARIABLES ##########################
const resourcesList = []
const favorites = document.getElementById('favorites')
const mainBlock = document.querySelector('.main')
const cardsListELement = document.querySelector('.cards-list')
// #############################################################

// ####################### AUTH ###############################
const openFormBtn = document.querySelector('.login-btn')
const overlay = document.querySelector('.overlay')
const loginForm = document.querySelector('.login-form')
const loginUI = document.querySelector('.login-form__login')
const signupUI = document.querySelector('.signup-form__wrapper')
const loginSubmitBtn = document.getElementById('login-submit')
const signupSubmitBtn = document.getElementById('signup-submit')
const closeFormBtn = document.getElementById('close-form-btn')
const signupSwaper = document.getElementById('swap-to-signup')
const loginSwaper = document.getElementById('swap-to-login')
openFormBtn.addEventListener('click', () => {
  loginForm.classList.remove('is-hidden')
  overlay.classList.remove('is-hidden')
})

const closeAll = () => {
  loginForm.classList.add('is-hidden')
  overlay.classList.add('is-hidden')
}

overlay.addEventListener('click', closeAll)
closeFormBtn.addEventListener('click', closeAll)
signupSwaper.addEventListener('click', () => {
  loginUI.classList.add('is-hidden')
  signupUI.classList.remove('is-hidden')
})
loginSwaper.addEventListener('click', () => {
  loginUI.classList.remove('is-hidden')
  signupUI.classList.add('is-hidden')
})

const usernameErr = document.querySelector('.username-error')
const passwordErr = document.querySelector('.password-error')
const userProfileBlock = document.getElementById('user-profile')
const usernameBtn = document.getElementById('user-name-display')

loginForm.addEventListener('submit', async (e) => {
  console.log(e.target)
  e.preventDefault()
  e.stopPropagation()

  const isLoginVisible = !loginUI.classList.contains('is-hidden')

  if (isLoginVisible) {
    const email = document.getElementById('login-input').value
    const password = document.getElementById('login-password').value

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        console.log('Ответ от сервера (Login):', data)
        closeAll()
        openFormBtn.classList.add('is-hidden')
        usernameBtn.textContent = data.username
        userProfileBlock.classList.remove('is-hidden')
        console.log(data)
        notiBlock.style = 'background-color: green'
        showPopup(`Привет, ${data.username}`)
      } else {
        const data = await response.json()
        console.log('Ответ от сервера (Login):', data)
        console.log(data)
        notiBlock.style = 'background-color: red'
        showPopup(`Ошибка: ${data.error}`)
      }
    } catch (err) {
      console.error('Ошибка подключения к серверу:', err)
    }
  } else {
    const userEl = document.getElementById('signup-username')
    const emailEl = document.getElementById('signup-email')
    const passEl = document.getElementById('signup-password')

    if (!userEl || !emailEl || !passEl) {
      console.error('Ошибка: Один из элементов регистрации не найден!', {
        userEl,
        emailEl,
        passEl,
      })
      return
    }

    const username = userEl.value
    const signupEmail = emailEl.value
    const signupPassword = passEl.value

    if (username.length < 4) {
      usernameErr.classList.remove('is-hidden')
      signupSubmitBtn.setAttribute('disabled', '')
      setTimeout(() => {
        usernameErr.classList.add('is-hidden')
        signupSubmitBtn.removeAttribute('disabled')
      }, 3000)
      return
    }
    if (signupPassword.length < 8) {
      passwordErr.classList.remove('is-hidden')
      setTimeout(() => {
        passwordErr.classList.add('is-hidden')
      }, 3000)
      return
    }

    try {
      console.log('Начинаем регистрацию для:', username)

      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: signupEmail,
          password: signupPassword,
        }),
      })

      const data = await response.json()
      console.log('Ответ от сервера (Signup):', data)
      closeAll()
      openFormBtn.classList.add('is-hidden')
      usernameBtn.textContent = data.username
      userProfileBlock.classList.remove('is-hidden')
      console.log(data)
    } catch (err) {
      console.error('Ошибка при регистрации:', err)
    }
  }
  return false
})

// ###########################################################
async function loadResources() {
  try {
    const response = await fetch('http://localhost:8000/resources')
    const data = await response.json()

    // Очищаем текущий список (если нужно) и отрисовываем данные из БД
    contentRender(data)

    data.forEach((item) => resourcesList.push(item))
    console.log(data)
  } catch (err) {
    console.error('Не удалось загрузить ресурсы:', err)
  }
}
loadResources()
class Resource {
  constructor({
    tech,
    title,
    source,
    description,
    fullDescription,
    grade,
    cost,
  }) {
    this.tech = tech
    this.title = title
    this.source = source
    this.description = description
    this.fullDescription = fullDescription
    this.grade = grade
    this.cost = cost

    resourcesList.push(this)
  }
}

const filteredState = {
  tech: 'SHOW ALL',
  source: 'ALL',
  grade: 'ALL',
  cost: 'ALL',
  showFavorites: false,
}

const techIcons = {
  HTML: './assets/html5-icon.svg',
  CSS: './assets/css-icon.svg',
  JS: './assets/javascript-icon.svg',
  ALL: './assets/all-in-one.svg',
}

const tagsGradeClasses = {
  beginner: 'tag-beginner',
  medium: 'tag-medium',
  advanced: 'tag-advanced',
}

const tagsCostClasses = {
  free: 'tag-free',
  paid: 'tag-paid',
}

const notFoundBanner = document.querySelector('.not-found')
function contentRender(list) {
  cardsListELement.innerHTML = ''
  if (list.length === 0) {
    notFoundBanner.classList.remove('is-hidden')
    mainBlock.classList.add('is-hidden')
    return
  }
  notFoundBanner.classList.add('is-hidden')
  mainBlock.classList.remove('is-hidden')
  list.forEach((resource) => {
    const elementsObject = createCard()
    elementsObject.cardIcon.src = techIcons[resource.tech]
    elementsObject.cardTagGrade.classList.add(tagsGradeClasses[resource.grade])
    elementsObject.cardTagCost.classList.add(tagsCostClasses[resource.cost])
    elementsObject.cardTitleElement.textContent = resource.title
    elementsObject.cardCategoryElement.textContent = resource.source
    elementsObject.cardDescriptionElement.textContent = resource.description
    elementsObject.cardTagGrade.textContent = resource.grade
    elementsObject.cardTagCost.textContent = resource.cost
    cardsListELement.append(elementsObject.cardElement)
    elementsObject.cardBtn.addEventListener('click', () => {
      fillDetails(resource)
      mainBlock.classList.add('is-sidebar-open')
    })
  })
}
// #############################################################

function createCard() {
  const cardElement = document.createElement('li')
  cardElement.classList.add('card')
  // Card Header Elements
  const cardHeaderElement = document.createElement('div')
  cardHeaderElement.classList.add('card__header')
  const cardIconBlock = document.createElement('div')
  cardIconBlock.classList.add('card__icon-wrapper')
  const cardIcon = document.createElement('img')
  cardIcon.classList.add('card__icon')
  cardIconBlock.append(cardIcon)
  cardHeaderElement.append(cardIconBlock)
  // Card Body Elements
  const cardBodyElement = document.createElement('div')
  cardBodyElement.classList.add('card__body')
  const cardMetaBlock = document.createElement('div')
  cardMetaBlock.classList.add('card__meta')
  const cardTitleElement = document.createElement('h3')
  cardTitleElement.classList.add('card__title')
  const cardCategoryElement = document.createElement('span')
  cardCategoryElement.classList.add('card__category')
  cardCategoryElement.classList.add('tag')
  const cardDescriptionElement = document.createElement('p')
  cardDescriptionElement.classList.add('card__description')
  cardMetaBlock.append(cardTitleElement, cardCategoryElement)
  cardBodyElement.append(cardMetaBlock, cardDescriptionElement)
  // Card Footer Elements
  const cardFooterElement = document.createElement('div')
  cardFooterElement.classList.add('card__footer')
  const cardTagsBlock = document.createElement('div')
  cardTagsBlock.classList.add('card__tags')
  const cardTagGrade = document.createElement('span')
  cardTagGrade.classList.add('tag')
  const cardTagCost = document.createElement('span')
  cardTagCost.classList.add('tag')
  const cardBtnElement = document.createElement('button')
  cardBtnElement.type = 'button'
  cardBtnElement.classList.add('card__btn-details')
  cardBtnElement.textContent = 'Details →'
  cardTagsBlock.append(cardTagGrade, cardTagCost)
  cardFooterElement.append(cardTagsBlock, cardBtnElement)
  cardElement.append(cardHeaderElement, cardBodyElement, cardFooterElement)

  return {
    cardElement,
    cardIcon,
    cardTitleElement,
    cardCategoryElement,
    cardDescriptionElement,
    cardTagGrade,
    cardTagCost,
    cardBtn: cardBtnElement,
  }
}

const sidebarImg = document.querySelector('.details__img')
const sidebarTitle = document.querySelector('.sidebar-details__title')
const sidebarSource = document.querySelector('.sidebar-details__source')
const sidebarTagGrade = document.querySelector('.grade-tag')
const sidebarTagCost = document.querySelector('.cost-tag')
const sidebarDescription = document.querySelector(
  '.sidebar-details__description',
)

function fillDetails(data) {
  sidebarImg.src = techIcons[data.tech]
  sidebarTitle.textContent = data.title
  sidebarSource.textContent = data.source
  sidebarTagGrade.textContent = data.grade
  sidebarTagGrade.className = `tag grade-tag ${tagsGradeClasses[data.grade]}`
  sidebarTagCost.textContent = data.cost
  sidebarTagCost.className = `tag cost-tag ${tagsCostClasses[data.cost]}`
  sidebarDescription.textContent =
    data.fulldescription || data.description || 'Описание скоро появится...'
}

const closeBtn = document.getElementById('exit-btn')

closeBtn.addEventListener('click', () => {
  mainBlock.classList.remove('is-sidebar-open')
})

contentRender(resourcesList)

function applyFilters() {
  const filteredList = resourcesList.filter((resource) => {
    const matchTech =
      filteredState.tech === 'SHOW ALL' ||
      resource.tech === filteredState.tech ||
      (filteredState.tech !== 'OTHER' && resource.tech === 'ALL')

    const matchSource =
      filteredState.source === 'ALL' || resource.source === filteredState.source

    const matchGrade =
      filteredState.grade === 'ALL' || resource.grade === filteredState.grade

    const matchCost =
      filteredState.cost === 'ALL' || resource.cost === filteredState.cost

    return matchTech && matchSource && matchGrade && matchCost
  })
  contentRender(filteredList)
  return filteredList
}

function resetAllFilters() {
  filteredState.tech = 'SHOW ALL'
  filteredState.source = 'ALL'
  filteredState.grade = 'ALL'
  filteredState.cost = 'ALL'

  document
    .querySelectorAll('.is-active')
    .forEach((el) => el.classList.remove('is-active'))
  const allDefaultButtons = document.querySelectorAll(
    '[data-type="SHOW ALL"], [data-source="ALL"], [data-grade="ALL"], [data-cost="ALL"]',
  )
  allDefaultButtons.forEach((btn) => {
    btn.classList.add('is-active')
  })
  applyFilters()
}

const notFoundBtn = document.querySelector('.not-found__btn')
document.addEventListener('click', (e) => {
  if (e.target.closest('.not-found__btn')) {
    resetAllFilters()
    return
  }

  const filterBtn = e.target.closest(
    '[data-type], [data-source], [data-grade], [data-cost]',
  )

  if (!filterBtn) return
  favorites.classList.remove('is-active')
  mainBlock.classList.remove('is-sidebar-open')

  if (filterBtn.hasAttribute('data-type'))
    filteredState.tech = filterBtn.getAttribute('data-type')
  console.log(filteredState.tech)
  if (filterBtn.hasAttribute('data-source'))
    filteredState.source = filterBtn.getAttribute('data-source')
  if (filterBtn.hasAttribute('data-grade'))
    filteredState.grade = filterBtn.getAttribute('data-grade')
  if (filterBtn.hasAttribute('data-cost'))
    filteredState.cost = filterBtn.getAttribute('data-cost')
  const parent = filterBtn.closest('#filter-parent')
  parent.querySelectorAll('.is-active').forEach((el) => {
    el.classList.remove('is-active')
    el.removeAttribute('disabled', '')
  })
  filterBtn.classList.add('is-active')
  filterBtn.setAttribute('disabled', '')
  console.log(filteredState)
  // Запускаем общую фильтрацию
  applyFilters()
})

const searchForm = document.querySelector('.search-form')
const searchBtn = document.querySelector('.search-form__btn')
const searchInput = document.querySelector('.search-form__input')

searchForm.addEventListener('submit', (e) => {
  if (e.currentTarget !== searchForm) return
  e.preventDefault()
  let searchList = applyFilters()
  const searchValue = searchInput.value.trim().toLowerCase()

  if (searchValue === '') {
    contentRender(searchList)
    return
  }

  searchList = searchList.filter((resource) => {
    const title = resource.title.toLowerCase()
    const description = resource.description.toLowerCase()
    console.log(title === searchValue)
    return title.includes(searchValue) || description.includes(searchValue)
  })
  contentRender(searchList)
})

const mainMenu = document.querySelector('.nav-main')
const techBtns = document.querySelectorAll('.sub-menu__btn')
favorites.addEventListener('click', () => {
  techBtns.forEach((btn) => {
    btn.classList.remove('is-active')
    btn.removeAttribute('disabled')
  })
  favorites.classList.add('is-active')
})
