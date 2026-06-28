<div align="center">
  <h1>🌑 Styled Start Page</h1>
  <p><strong>Кастомизированная стартовая страница / новая вкладка для браузера</strong></p>

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

## Это форк

Этот репозиторий — **форк** проекта [`tartarus-startpage`](https://github.com/AllJavi/tartarus-startpage) от [AllJavi](https://github.com/AllJavi), который, в свою очередь, основан на оригинальном [`dawn`](https://github.com/b-coimbra/dawn) от [b-coimbra](https://github.com/b-coimbra).

Здесь сохранены идеи оригинала, но добавлены собственные улучшения: единые диалоги для работы с вкладками, IndexedDB для хранения изображений, возможность удалять кастомные фото и исправления интерфейса.

---

## Для чего этот проект

Это **кастомизированная стартовая страница / новая вкладка для браузера**.

---

## Быстрый старт

### Просмотр

```bash
# Открыть файл напрямую
index.html

# Или запустить локальный сервер
python3 -m http.server 8080
```

После этого откройте в браузере: `http://localhost:8080`.

### Использование как новой вкладки

Страница рассчитана на использование в качестве кастомной новой вкладки браузера.

**Firefox** — можно настроить через `about:config` или `user.js`, без установки расширений, чтобы в качестве новой вкладки открывался URL или путь к `index.html`.

**Chrome / Edge / Chromium** — обычно требуется расширение для замены новой вкладки (например, [Custom New Tab URL](https://chromewebstore.google.com/detail/custom-new-tab-url/)).

---

## Особенности

- Редактируемые вкладки и категории ссылок.
- Быстрый поиск с префиксами (`!g`, `!y`, `!d` и др.).
- Кастомные фон и баннеры для вкладок.
- Загруженные изображения хранятся локально в **IndexedDB**.
- Возможность удалять ранее загруженные фото.
- Единые диалоги для создания и редактирования вкладки.

---

## Горячие клавиши

| Клавиша | Действие |
| :--- | :--- |
| <kbd>1</kbd>–<kbd>9</kbd> / <kbd>Клик</kbd> | Переключение вкладок |
| <kbd>s</kbd> | Открыть окно поиска |
| <kbd>q</kbd> | Изменение фона |
| <kbd>e</kbd> | Режим редактирования вкладок |
| <kbd>Esc</kbd> | Закрыть диалоги |

---

## Как пользоваться

### Вкладки

В режиме редактирования (<kbd>e</kbd>) можно:

- **Добавить** новую вкладку через отдельное окно создания.
- **Переименовать** вкладку и изменить её баннер в одном окне.
- **Удалить** вкладку.
- Добавлять, удалять и переименовывать категории и ссылки.

### Поиск

В окне поиска (<kbd>s</kbd>) используйте префиксы для разных поисковых систем:

| Префикс | Поисковик |
| :--- | :--- |
| `!g` | Google |
| `!d` | DuckDuckGo |
| `!y` | YouTube |
| `!r` | Reddit |
| `!p` | Pinterest |

Пример: `!y lo-fi music` откроет поиск на YouTube.

### Фон и кастомные изображения

В окне настроек (<kbd>q</kbd>) можно выбрать фон из встроенных вариантов или загрузить своё фото. Ранее загруженные фоны можно удалить (кнопка `×` при наведении на кастомную миниатюру).

---

## Настройка

Вся конфигурация находится в файле [`userconfig.js`](userconfig.js). Его нужно редактировать вручную — в интерфейсе нет текстового ввода JSON или формы для всего конфига.

Здесь можно настроить:

- **Вкладки и категории** — добавлять, удалять и переименовывать разделы и ссылки.
- **Иконки** — выбирать иконки из набора `Tabler Icons` и задавать их цвета.
- **Поисковые движки** — добавлять свои с префиксами `!<id>`.
- **Фон** — указывать путь к изображению или выбирать из встроенных баннеров.
- **Часы и погода** — формат времени и город для прогноза.
- **Горячие клавиши** — назначать клавиши для открытия поиска, настроек и вкладок.

### Пример добавления ссылки в `userconfig.js`

Откройте `userconfig.js`, найдите нужную категорию внутри `tabs` и добавьте объект в массив `links`:

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

## Технологии

- **HTML / CSS / JavaScript** — чистый фронтенд, без сборки и зависимостей.
- **Tabler Icons** — для иконок ссылок.
- **Google Fonts** — шрифты Nunito, Roboto, Raleway.
- **IndexedDB** — для локального хранения загруженных пользователем изображений.
- **OpenWeather API** — для отображения погоды.

---

## Кредиты и благодарности

Этот проект не существовал бы без оригинальных авторов:

- **[dawn](https://github.com/b-coimbra/dawn)** — оригинальная стартовая страница от [b-coimbra](https://github.com/b-coimbra).
- **[tartarus-startpage](https://github.com/AllJavi/tartarus-startpage)** — форк от [AllJavi](https://github.com/AllJavi), который стал базой для данного репозитория.

---

## Лицензия

Распространяется под лицензией [MIT](./LICENSE).

---

<div align="center">
  <sub>Сделано с ❤️ на основе tartarus-startpage.</sub>
</div>
