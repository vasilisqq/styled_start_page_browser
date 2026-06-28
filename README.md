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

#### Автоматизация

Скрипт: [`scripts/set-startpage.sh`](scripts/set-startpage.sh)

Требования:
- Linux
- `sudo` для записи в системные директории
- `python3` или `jq` — для обновления существующих `policies.json`

Формат запуска:

```bash
sudo ./scripts/set-startpage.sh <URL> <browser>
```

Поддерживаемые браузеры: `firefox`, `chrome`, `chromium`, `edge`.

Пример:

```bash
sudo ./scripts/set-startpage.sh "file:///home/user/styled_start_page_browser/index.html" firefox
```

Действие скрипта по браузерам:

| Браузер | Путь к `policies.json` | Политика |
| :--- | :--- | :--- |
| Firefox | `/usr/lib/firefox/distribution/policies.json` или `/usr/lib64/firefox/distribution/policies.json` | `NewTabPage` |
| Chrome | `/etc/opt/chrome/policies/managed/policies.json` | `NewTabPageLocation` |
| Chromium | `/etc/chromium/policies/managed/policies.json` | `NewTabPageLocation` |
| Edge | `/etc/opt/edge/policies/managed/policies.json` | `NewTabPageLocation` |

#### Ручная настройка

**Firefox**

Создать файл `policies.json` в одном из путей:

- Linux: `/usr/lib/firefox/distribution/policies.json` или `/usr/lib64/firefox/distribution/policies.json`
- macOS: `/Applications/Firefox.app/Contents/Resources/distribution/policies.json`
- Windows: `C:\Program Files\Mozilla Firefox\distribution\policies.json`

Содержимое:

```json
{
  "policies": {
    "NewTabPage": "<URL>"
  }
}
```

**Chrome / Chromium / Edge**

Linux:

| Браузер | Путь |
| :--- | :--- |
| Chrome | `/etc/opt/chrome/policies/managed/policies.json` |
| Chromium | `/etc/chromium/policies/managed/policies.json` |
| Edge | `/etc/opt/edge/policies/managed/policies.json` |

Содержимое:

```json
{
  "NewTabPageLocation": "<URL>"
}
```

Windows — через реестр:

| Браузер | Путь реестра |
| :--- | :--- |
| Chrome | `HKEY_CURRENT_USER\SOFTWARE\Policies\Google\Chrome\NewTabPageLocation` |
| Edge | `HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Edge\NewTabPageLocation` |
| Chromium | `HKEY_CURRENT_USER\SOFTWARE\Policies\Chromium\NewTabPageLocation` |

macOS — требуется Configuration Profile или system-wide политика. User-level файл для новой вкладки не поддерживается.

#### `user.js` (Firefox, ограниченный вариант)

Если system-wide `policies.json` недоступен, в профиле Firefox можно создать `user.js`:

```js
user_pref("browser.startup.homepage", "<URL>");
user_pref("browser.newtabpage.enabled", false);
```

Путь к профилю:
- Linux: `~/.mozilla/firefox/XXXX.default-release/`
- macOS: `~/Library/Application Support/Firefox/Profiles/XXXX.default-release/`
- Windows: `%APPDATA%\Mozilla\Firefox\Profiles\XXXX.default-release\`

Ограничение: `user.js` устанавливает стартовую страницу и отключает стандартную новую вкладку, но не заменяет URL новой вкладки. Полноценная замена URL требует `policies.json` или расширения.

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
