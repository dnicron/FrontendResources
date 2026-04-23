// ######################## VARIABLES ##########################
const resourcesList = []
const mainBlock = document.querySelector('.main')
const cardsListELement = document.querySelector('.cards-list')
// #############################################################
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
    data.fullDescription || data.description || 'Описание скоро появится...'
}

const closeBtn = document.getElementById('exit-btn')

closeBtn.addEventListener('click', () => {
  mainBlock.classList.remove('is-sidebar-open')
})

new Resource({
  tech: 'JS',
  title: 'Learn JavaScript',
  source: 'website',
  description:
    'Один из лучших учебников по JS в мире. Подробно разбирает всё: от основ до продвинутых концепций вроде прототипов и асинхронности.',
  fullDescription:
    'Этот ресурс по праву считается "Библией" фронтенд-разработчика. Учебник охватывает всё: от элементарных переменных до сложных тем, таких как замыкания, прокси, итераторы и асинхронные генераторы. Каждая тема сопровождается практическими заданиями и тестами для закрепления материала. Идеально подходит как для старта с нуля, так и для восполнения пробелов у опытных разработчиков.',
  grade: 'beginner',
  cost: 'free',
})

new Resource({
  tech: 'ALL',
  title: 'Roadmap.sh',
  source: 'roadmap',
  description:
    'Пошаговые руководства и визуальные карты путей развития для разработчиков.',
  fullDescription:
    'Это проект №1 в мире по визуализации образовательных траекторий. Здесь ты найдешь детальные карты: "Frontend", "Backend", "React" и многие другие. Каждая точка на карте — это не просто название технологии, а ссылка на лучшие материалы для её изучения. Помогает не утонуть в океане информации и четко видеть следующую цель.',
  grade: 'beginner',
  cost: 'free',
})

new Resource({
  tech: 'JS',
  title: 'Codewars',
  source: 'website',
  description:
    'Тренируй навыки программирования, решая задачи (ката) разной сложности.',
  fullDescription:
    'Образовательная платформа, где обучение превращено в игру. Ты решаешь задачи, зарабатываешь очки и повышаешь свой ранг (кю). Это лучший способ "набить руку" на логике JavaScript, научиться работать с массивами, строками и алгоритмами. После решения каждой задачи можно посмотреть, как её решили другие — это колоссально расширяет кругозор.',
  grade: 'beginner',
  cost: 'free',
})

new Resource({
  tech: 'ALL',
  title: 'BigDevSoon',
  source: 'website',
  description:
    'Практикуйся на реальных проектах. От простых компонентов до полноценных приложений.',
  fullDescription:
    'Платформа для тех, кто устал от бесконечных туториалов и хочет строить реальные вещи. Здесь тебе дают макеты и требования, а ты реализуешь их. Проекты разделены на уровни сложности, что позволяет плавно переходить от верстки карточек к созданию сложных веб-приложений с логикой и состоянием.',
  grade: 'medium',
  cost: 'free',
})

new Resource({
  tech: 'CSS',
  title: 'Верстаем.онлайн',
  source: 'website',
  description:
    'Практические курсы и макеты для тех, кто хочет научиться верстать профессионально.',
  fullDescription:
    'Проект, сфокусированный на качественной верстке. Здесь много внимания уделяется семантике, доступности и современным техникам CSS. Если хочешь научиться верстать так, чтобы твой код не рассыпался от одного изменения и выглядел идеально на всех устройствах — это правильное место.',
  grade: 'beginner',
  cost: 'free',
})

new Resource({
  tech: 'ALL',
  title: 'Дока',
  source: 'website',
  description: 'Документация для разработчиков на человеческом языке.',
  fullDescription:
    'Это "open-source" справочник по HTML, CSS и JavaScript, написанный понятным языком. "Дока" отличается тем, что объясняет сложные концепции через жизненные аналогии и простые примеры. Идеально подходит, когда официальная документация MDN кажется слишком тяжелой и перегруженной терминами.',
  grade: 'beginner',
  cost: 'free',
})

new Resource({
  tech: 'ALL',
  title: 'Web Skills',
  source: 'roadmap',
  description:
    'Визуализированный обзор навыков, необходимых современному веб-разработчику.',
  fullDescription:
    'Интерактивная карта навыков, которая помогает оценить свой уровень. Она разбита на категории: основы, сборка проектов, фреймворки, тестирование. Клик по любому навыку открывает список проверенных ресурсов для его изучения. Отличный инструмент для самопроверки и планирования обучения.',
  grade: 'beginner',
  cost: 'free',
})

new Resource({
  tech: 'ALL',
  title: 'Frontend Practice',
  source: 'website',
  description:
    'Реальные сайты для тренировки навыков верстки. Повторяй лучшие интерфейсы.',
  fullDescription:
    'Хочешь научиться верстать как профи? Возьми реальный крутой сайт и попробуй его скопировать. Frontend Practice подбирает сайты с интересной сеткой, анимациями и типографикой, предоставляя ссылки на ассеты. Это отличная возможность собрать портфолио из действительно красивых проектов.',
  grade: 'medium',
  cost: 'free',
})

new Resource({
  tech: 'CSS',
  title: 'Большая книга CSS',
  source: 'книга',
  description:
    'Настольная книга любого верстальщика. Учит строить современные макеты, разбираться в специфичности селекторов и тонкостях анимаций.',
  fullDescription:
    'Книга Дэвида Макфарланда — это глубокое погружение в мир стилизации. Вы узнаете, как строить сетки любой сложности на Flexbox и Grid, как усмирить специфичность селекторов и создавать адаптивные интерфейсы, которые идеально выглядят на любых устройствах. Особое внимание уделено кроссбраузерности и современным фишкам CSS, таким как переменные и продвинутые фильтры.',
  grade: 'medium',
  cost: 'paid',
})

new Resource({
  tech: 'ALL',
  title: 'MDN Web Docs',
  source: 'docs',
  description:
    'Библия веб-разработки. Официальная документация, где можно найти описание любого тега, свойства CSS или метода JavaScript.',
  fullDescription:
    'Если учебники объясняют "как", то MDN — это истина в последней инстанции о том, "как это устроено". Здесь вы найдете подробнейшее описание каждого HTML-тега, свойства CSS и методов JavaScript API. Документация постоянно обновляется сообществом и содержит таблицы совместимости с браузерами, что делает её незаменимым инструментом в ежедневной работе.',
  grade: 'medium',
  cost: 'free',
})

new Resource({
  tech: 'CSS',
  title: 'CSS-Tricks',
  source: 'website',
  description:
    'Огромный архив статей и гайдов. Знаменит своим "Полным руководством по Flexbox" и "Полным руководством по Grid".',
  fullDescription:
    'CSS-Tricks начинался как личный блог Криса Койера, но вырос в главную энциклопедию CSS в мире. Их "Complete Guide to Flexbox" и "Complete Guide to Grid" открыты в закладках у каждого профи. Здесь можно найти решение любой проблемы с версткой: от центрирования дива до сложных SVG-анимаций и темных тем.',
  grade: 'medium',
  cost: 'free',
})

new Resource({
  tech: 'JS',
  title: 'React.dev',
  source: 'Docs',
  description:
    'Официальное руководство по библиотеке React: использование хуков и управление состоянием.',
  fullDescription:
    'Новая версия документации React делает упор на функциональные компоненты и современный подход с использованием Hooks. Обучение построено на интерактивных примерах прямо в браузере. Вы научитесь думать "в стиле React", разделять интерфейс на независимые компоненты и эффективно управлять состоянием приложения без лишних перерисовок.',
  grade: 'advanced',
  cost: 'free',
})

new Resource({
  tech: 'JS',
  title: 'Frontend Masters',
  source: 'Courses',
  description:
    'Видеокурсы высочайшего качества от экспертов индустрии и авторов библиотек.',
  fullDescription:
    'Это "тяжелая артиллерия" в мире обучения. Курсы ведут люди, которые буквально создавали инструменты, которыми мы пользуемся (например, автор курса по JS — Кайл Симпсон). Контент платный, но уровень проработки материала, глубина и актуальность полностью оправдывают цену для тех, кто хочет стать Senior-разработчиком.',
  grade: 'advanced',
  cost: 'paid',
})

new Resource({
  tech: 'ALL',
  title: 'CodePen',
  source: 'Service',
  description:
    'Онлайн-песочница для фронтенд-разработчиков. Идеальное место для экспериментов и вдохновения.',
  fullDescription:
    'CodePen — это не просто редактор кода в браузере, а огромная социальная сеть. Здесь можно найти тысячи готовых компонентов: от безумных шейдеров на WebGL до чистых CSS-рисунков. Отличное место, чтобы быстро набросать идею или посмотреть, как другие реализуют сложные UI-эффекты.',
  grade: 'beginner',
  cost: 'free',
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
  parent
    .querySelectorAll('.is-active')
    .forEach((el) => el.classList.remove('is-active'))
  filterBtn.classList.add('is-active')
  console.log(filteredState)
  // Запускаем общую фильтрацию
  applyFilters()
})

const searchForm = document.querySelector('.search-form')
const searchBtn = document.querySelector('.search-form__btn')
const searchInput = document.querySelector('.search-form__input')

searchForm.addEventListener('submit', (e) => {
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
