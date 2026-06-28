<div align="center">
  <h1>🌑 Styled Start Page</h1>
  <p><strong>Кастомная стартовая страница для браузера — стильный форк с исправлениями и улучшениями</strong></p>

  <a href="https://github.com/vasilisqq/styled_start_page_browser/stargazers">
    <img src="https://img.shields.io/github/stars/vasilisqq/styled_start_page_browser?color=a9b665&style=for-the-badge&logo=starship" alt="Stars">
  </a>
  <a href="https://github.com/vasilisqq/styled_start_page_browser/issues">
    <img src="https://img.shields.io/github/issues/vasilisqq/styled_start_page_browser?color=ea6962&style=for-the-badge&logo=codecov" alt="Issues">
  </a>
  <a href="https://github.com/vasilisqq/styled_start_page_browser/network/members">
    <img src="https://img.shields.io/github/forks/vasilisqq/styled_start_page_browser?color=7daea3&style=for-the-badge&logo=jfrog-bintray" alt="Forks">
  </a>
  <a href="https://github.com/vasilisqq/styled_start_page_browser/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-orange.svg?color=d4be98&style=for-the-badge&logo=archlinux" alt="License">
  </a>
</div>

---

## ⚠️ Это форк

Этот репозиторий — **форк** проекта [`tartarus-startpage`](https://github.com/AllJavi/tartarus-startpage) от [AllJavi](https://github.com/AllJavi), который, в свою очередь, основан на оригинальном [`dawn`](https://github.com/b-coimbra/dawn) от [b-coimbra](https://github.com/b-coimbra).

Здесь сохранены все основные идеи оригинала, но добавлены собственные улучшения, исправления и доработки интерфейса.

---

## 💡 Для чего этот проект

Это **стартовая страница для браузера** — минималистичная, настраиваемая и красивая альтернатива стандартной новой вкладке. Она позволяет:

- Хранить избранные ссылки по категориям на одном экране.
- Быстро переключаться между вкладками (например, «main», «ai»).
- Использовать встроенный поиск с разными поисковыми системами.
- Настраивать внешний вид: фон, баннеры, цвета иконок, часы и погоду.
- Открывать страницу вместо стандартной новой вкладки браузера.

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/vasilisqq/styled_start_page_browser.git
cd styled_start_page_browser
```

### 2. Запуск

Проект состоит только из статических файлов (`HTML`, `CSS`, `JS`). Для запуска достаточно открыть файл `index.html` в браузере:

```bash
# Простой способ — открыть напрямую
index.html

# Или запустить локальный сервер для удобной разработки
python3 -m http.server 8080
```

После этого откройте в браузере: `http://localhost:8080`.

### 3. Установка как стартовой страницы

#### Firefox

1. Установите расширение, позволяющее задать кастомную новую вкладку (например, [New Tab Override](https://addons.mozilla.org/ru/firefox/addon/new-tab-override/)).
2. Укажите путь к локальному файлу `index.html` или URL, по которому доступен проект.

#### Chrome / Edge / Chromium

1. Установите расширение для кастомной новой вкладки (например, [Custom New Tab URL](https://chromewebstore.google.com/detail/custom-new-tab-url/)).
2. Укажите путь к `index.html` или локальный URL.

> **Совет:** если хотите использовать страницу постоянно, разместите проект на локальном сервере или на GitHub Pages.

---

## ⚙️ Настройка

Вся конфигурация находится в файле [`userconfig.js`](userconfig.js). Здесь можно настроить:

- **Вкладки и категории** — добавлять, удалять и переименовывать разделы и ссылки.
- **Иконки** — выбирать иконки из набора `Tabler Icons` и задавать их цвета.
- **Поисковые движки** — добавлять свои с префиксами `!<id>`.
- **Фон** — указывать путь к GIF/изображению или выбирать из встроенных баннеров.
- **Часы и погода** — формат времени и город для прогноза.
- **Горячие клавиши** — назначать клавиши для открытия поиска, настроек и вкладок.

Также доступно визуальное окно настроек, которое открывается клавишей `q`.

### Пример добавления своей ссылки

```js
{
  name: "my-site",
  url: "https://example.com",
  icon: "brand-github",
  icon_color: "#4cc9f0",
}
```

> Полный список иконок доступен на сайте [Tabler Icons](https://tabler-icons.io/).

---

## ⌨️ Горячие клавиши

| Клавиша | Действие |
| :--- | :--- |
| <kbd>1</kbd>–<kbd>9</kbd> / <kbd>Колесо мыши</kbd> / <kbd>Клик</kbd> | Переключение вкладок |
| <kbd>s</kbd> | Открыть окно поиска |
| <kbd>q</kbd> | Открыть окно настроек |
| <kbd>Esc</kbd> | Закрыть диалоги |

---

## 🔍 Поиск

В окне поиска можно использовать разные поисковые системы через префиксы:

| Префикс | Поисковик |
| :--- | :--- |
| `!g` | Google |
| `!d` | DuckDuckGo |
| `!y` | YouTube |
| `!r` | Reddit |
| `!p` | Pinterest |

Пример: `!y lo-fi music` откроет поиск на YouTube.

---

## 🖼 Доступные фоны и баннеры

Фоновые изображения находятся в папке [`src/img/banners/`](src/img/banners/). Чтобы сменить фон, измените значение `background` в `userconfig.js` или выберите фон через окно настроек (`q`).

---

## 🛠 Технологии

- **HTML / CSS / JavaScript** — чистый фронтенд, без сборки и зависимостей.
- **Tabler Icons** — для иконок ссылок.
- **Google Fonts** — шрифты Nunito, Roboto, Raleway.
- **IndexedDB** — для локального хранения загруженных пользовательских фонов и баннеров без переполнения localStorage.
- **OpenWeather API** — для отображения погоды.

---

## 📜 Кредиты и благодарности

Этот проект не существовал бы без оригинальных авторов:

- **[dawn](https://github.com/b-coimbra/dawn)** — оригинальная стартовая страница от [b-coimbra](https://github.com/b-coimbra).
- **[tartarus-startpage](https://github.com/AllJavi/tartarus-startpage)** — форк от [AllJavi](https://github.com/AllJavi), который стал базой для данного репозитория.

---

## 📄 Лицензия

Распространяется под лицензией [MIT](./LICENSE).

---

<div align="center">
  <sub>Сделано с ❤️ на основе tartarus-startpage.</sub>
</div>
