<div align="center">
  <h1>Styled Start Page</h1>
  <p>Кастомизированная стартовая страница / новая вкладка для браузера</p>

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

## Форк

Репозиторий является форком [`tartarus-startpage`](https://github.com/AllJavi/tartarus-startpage) ([AllJavi](https://github.com/AllJavi)), который основан на [`dawn`](https://github.com/b-coimbra/dawn) ([b-coimbra](https://github.com/b-coimbra)).

Отличия от базовых репозиториев:
- единые диалоги создания и редактирования вкладки;
- хранение загруженных изображений в IndexedDB;
- удаление кастомных фонов и баннеров;
- окно настроек отображается поверх всего интерфейса;
- исправления в UI.

---

## Описание

Кастомизированная стартовая страница / новая вкладка для браузера.

---

## Быстрый старт

### Просмотр

```bash
index.html
```

или

```bash
python3 -m http.server 8080
```

После запуска сервера страница доступна по адресу `http://localhost:8080`.

### Кастомная новая вкладка

Страница предназначена для использования в качестве новой вкладки браузера. В качестве URL допустимы любые доступные адреса: `file://`, `http://`, `https://`.

Механизм замены зависит от браузера:

- **Firefox** — URL новой вкладки задаётся через AutoConfig (`autoconfig.js` + `autoconfig.cfg`). Политика `NewTabPage` в `policies.json` только включает/выключает страницу новой вкладки и **не** задаёт её URL.
- **Chrome / Chromium / Edge** — через managed-политику `NewTabPageLocation`.

#### Автоматизация (Linux)

Скрипт: [`scripts/set-startpage.sh`](scripts/set-startpage.sh)

Требования:
- Linux
- `sudo` для записи в системные директории
- `python3` или `jq` — для аккуратного обновления существующих `policies.json` (Chrome / Chromium / Edge)

Формат запуска:

```bash
sudo ./scripts/set-startpage.sh <URL> <browser>
```

Поддерживаемые браузеры: `firefox`, `chrome`, `chromium`, `edge`.

Пример:

```bash
sudo ./scripts/set-startpage.sh "file:///home/user/styled_start_page_browser/index.html" firefox
```

Что делает скрипт:

| Браузер | Метод | Файлы |
| :--- | :--- | :--- |
| Firefox | AutoConfig | `<install>/defaults/pref/autoconfig.js` + `<install>/autoconfig.cfg` |
| Chrome | Политика `NewTabPageLocation` | `/etc/opt/chrome/policies/managed/policies.json` |
| Chromium | Политика `NewTabPageLocation` | `/etc/chromium/policies/managed/policies.json` |
| Edge | Политика `NewTabPageLocation` | `/etc/opt/edge/policies/managed/policies.json` |

Каталог установки Firefox определяется автоматически (`/usr/lib/firefox`, `/usr/lib64/firefox`, `/opt/firefox`, `/usr/lib/firefox-esr`). После настройки перезапустите браузер.

#### Ручная настройка — Firefox (AutoConfig)

URL новой вкладки в Firefox переопределяется через механизм AutoConfig. Нужны два файла внутри каталога установки Firefox.

Каталог установки:

| ОС | Путь |
| :--- | :--- |
| Linux (Arch, Debian) | `/usr/lib/firefox/` |
| Linux (Fedora, openSUSE) | `/usr/lib64/firefox/` |
| macOS | `/Applications/Firefox.app/Contents/Resources/` |
| Windows | `C:\Program Files\Mozilla Firefox\` |

**1. `defaults/pref/autoconfig.js`**

В подкаталоге `defaults/pref/` каталога установки (создайте его, если папки нет) создайте файл `autoconfig.js`:

```js
pref("general.config.filename", "autoconfig.cfg");
pref("general.config.obscure_value", 0);
pref("general.config.sandbox_enabled", false);
```

**2. `autoconfig.cfg`**

В корне каталога установки создайте файл `autoconfig.cfg`. **Первая строка обязательно должна быть комментарием** (начинаться с `//`). Замените URL на полный путь к вашему `index.html`:

```js
// Первая строка обязательно должна быть комментарием.
try {
  ChromeUtils.defineESModuleGetters(this, {
    AboutNewTab: "resource:///modules/AboutNewTab.sys.mjs",
  });

  AboutNewTab.newTabURL = "file:///path/to/your/styled_start_page_browser/index.html";
} catch (e) {
  console.log("AutoConfig Error: ", e);
}
```

**3. Права (Linux / macOS)**

Файлы лежат в системном каталоге, поэтому установите права на чтение:

```bash
sudo chmod 644 /usr/lib/firefox/autoconfig.cfg
sudo chmod 644 /usr/lib/firefox/defaults/pref/autoconfig.js
```

Перезапустите Firefox.

#### Ручная настройка — Chrome / Chromium / Edge

Через managed-политику `NewTabPageLocation`.

**Linux** — создайте `policies.json`:

| Браузер | Путь |
| :--- | :--- |
| Chrome | `/etc/opt/chrome/policies/managed/policies.json` |
| Chromium | `/etc/chromium/policies/managed/policies.json` |
| Edge | `/etc/opt/edge/policies/managed/policies.json` |

Содержимое (для этих браузеров ключ не оборачивается в `policies`):

```json
{
  "NewTabPageLocation": "<URL>"
}
```

**Windows** — через реестр (тип значения `REG_SZ`):

| Браузер | Ключ реестра |
| :--- | :--- |
| Chrome | `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\NewTabPageLocation` |
| Edge | `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\NewTabPageLocation` |
| Chromium | `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Chromium\NewTabPageLocation` |

**macOS** — через домен настроек (managed preferences / Configuration Profile):

| Браузер | Домен | Ключ |
| :--- | :--- | :--- |
| Chrome | `com.google.Chrome` | `NewTabPageLocation` |
| Edge | `com.microsoft.Edge` | `NewTabPageLocation` |

Для теста локально:

```bash
defaults write com.google.Chrome NewTabPageLocation -string "<URL>"
```

Для устойчивого применения политики используйте Configuration Profile (`.mobileconfig`).

#### `user.js` (Firefox, только домашняя страница)

Если не хочется трогать системный каталог, в профиле Firefox можно задать домашнюю страницу через `user.js`:

```js
user_pref("browser.startup.homepage", "<URL>");
```

Путь к профилю:
- Linux: `~/.mozilla/firefox/XXXX.default-release/`
- macOS: `~/Library/Application Support/Firefox/Profiles/XXXX.default-release/`
- Windows: `%APPDATA%\Mozilla\Firefox\Profiles\XXXX.default-release\`

Ограничение: `user.js` задаёт только **домашнюю страницу** (кнопка «Домой», стартовое окно), но **не** заменяет страницу новой вкладки. Для новой вкладки используйте AutoConfig (выше).

---

## Особенности

- Редактируемые вкладки и категории ссылок.
- Быстрый поиск с префиксами (`!g`, `!y`, `!d` и др.).
- Кастомные фон и баннеры для вкладок.
- Загруженные изображения хранятся в IndexedDB.
- Удаление кастомных фонов и баннеров.
- Единые диалоги для создания и редактирования вкладки.
- Окно настроек отображается поверх всего интерфейса.

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

## Использование

### Вкладки

В режиме редактирования (<kbd>e</kbd>) доступны операции:
- добавление новой вкладки;
- переименование вкладки и изменение баннера в одном окне;
- удаление вкладки;
- добавление, удаление и переименование категорий и ссылок.

### Поиск

В окне поиска (<kbd>s</kbd>) используются префиксы для выбора поисковой системы:

| Префикс | Поисковик |
| :--- | :--- |
| `!g` | Google |
| `!d` | DuckDuckGo |
| `!y` | YouTube |
| `!r` | Reddit |
| `!p` | Pinterest |

Пример: `!y lo-fi music` открывает поиск на YouTube.

### Фон и кастомные изображения

В окне настроек (<kbd>q</kbd>) доступны действия:
- выбор фона из встроенных вариантов;
- загрузка своего фото для фона;
- удаление ранее загруженных фонов (кнопка `×` при наведении на кастомную миниатюру).

---

## Настройка

Конфигурация расположена в файле [`userconfig.js`](userconfig.js). Редактирование выполняется вручную в этом файле. В интерфейсе отсутствует форма или текстовый ввод для всего конфига.

В окне настроек (<kbd>q</kbd>) кнопка **export config** скачивает актуальный `userconfig.js` с текущими вкладками, фоном и прочими настройками. Кастомные изображения (фон и баннеры) встраиваются в файл как base64 и при загрузке автоматически сохраняются в IndexedDB. Скачанный файл можно заменить в корне проекта.

Настраиваемые параметры:
- вкладки и категории;
- иконки (`Tabler Icons`) и их цвета;
- поисковые движки (префиксы `!<id>`);
- фон (путь к файлу или встроенный баннер);
- часы и погода (формат времени, город);
- горячие клавиши.

### Пример добавления ссылки в `userconfig.js`

Добавить объект в массив `links` нужной категории внутри `tabs`:

```js
{
  name: "my-site",
  url: "https://example.com",
  icon: "brand-github",
  icon_color: "#4cc9f0",
}
```

Список иконок: [Tabler Icons](https://tabler-icons.io/).

---

## Конфигурация и её приоритет

Конфигурация разделена на статический источник (`userconfig.js`) и динамическое хранилище (`localStorage`, ключ `CONFIG`).

### Статические настройки

Статические настройки берутся из `userconfig.js` и не сохраняются в `localStorage`:

- `temperature`
- `clock`
- `search`
- `keybindings`
- `localIcons`
- `disabled`
- `weather`

При изменении этих полей в файле достаточно перезагрузить страницу.

### Динамические настройки

Динамические настройки сохраняются в `localStorage` и восстанавливаются при загрузке:

- `tabs` — вкладки и ссылки, изменённые через интерфейс;
- `background` — текущий фон;
- `customBackgrounds` — список кастомных фонов;
- `openLastVisitedTab` — флаг открытия последней посещённой вкладки.

### `configHash`

При загрузке вычисляется хеш `default_config` из `userconfig.js`. В `localStorage` сохраняется хеш конфигурации на момент последнего сохранения.

- Если хеши совпадают — вкладки берутся из `localStorage` (сохраняются правки через интерфейс).
- Если хеши не совпадают — вкладки берутся из `userconfig.js` (применяются изменения в файле).

Таким образом, ручное изменение `userconfig.js` автоматически перезаписывает сохранённые вкладки, а правки через интерфейс сохраняются до следующего изменения файла.

---

## Хранение данных

### Изображения

Загруженные пользователем изображения (фон и баннеры вкладок) хранятся в IndexedDB:

- База: `TartarusImages`
- Хранилище: `images`
- Ключ: идентификатор изображения

В `localStorage` и в `userconfig.js` сохраняются только ссылки вида `idb://<id>` или base64-представление при экспорте.

### Стандартные изображения

Встроенные фоны и баннеры (`src/img/banners/*`) хранятся как файлы в проекте. В конфигурации указываются относительные пути.

---

## Очистка и перенос данных

### Перенос на другое устройство

1. Нажать **export config** в окне настроек (`q`).
2. Скачать `userconfig.js`.
3. Заменить файл в корне проекта на другом устройстве.
4. Очистить `localStorage` для нового устройства или убедиться, что ключ `CONFIG` отсутствует.
5. Перезагрузить страницу.

При загрузке base64-изображения из экспортированного файла автоматически сохраняются в IndexedDB, а ссылки заменяются на `idb://<id>`.

### Очистка localStorage

Чтобы сбросить все динамические настройки и начать с чистого `userconfig.js`:

1. Открыть DevTools (`F12`).
2. Перейти в **Application** → **Local Storage** → выбрать сайт.
3. Удалить ключ `CONFIG`.
4. Перезагрузить страницу (`F5` / `Ctrl + R`).

### Очистка IndexedDB

Чтобы удалить кастомные изображения:

1. Открыть DevTools (`F12`).
2. Перейти в **Application** → **IndexedDB** → `TartarusImages` → `images`.
3. Нажать **Delete database** или удалить записи вручную.

---

## Технологии

- HTML / CSS / JavaScript (без сборки и зависимостей).
- Tabler Icons — иконки ссылок.
- Google Fonts — шрифты Nunito, Roboto, Raleway.
- IndexedDB — локальное хранение загруженных изображений.
- OpenWeather API — погода.

---

## Кредиты

- [dawn](https://github.com/b-coimbra/dawn) — [b-coimbra](https://github.com/b-coimbra).
- [tartarus-startpage](https://github.com/AllJavi/tartarus-startpage) — [AllJavi](https://github.com/AllJavi).

---

## Лицензия

[MIT](./LICENSE).

---

<div align="center">
  <sub>На основе tartarus-startpage.</sub>
</div>
