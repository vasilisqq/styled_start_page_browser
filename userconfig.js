let saved_config;
try {
  saved_config = JSON.parse(localStorage.getItem("CONFIG"));
  if (saved_config && saved_config.config) saved_config = saved_config.config;
} catch (e) {
  console.error('Failed to parse CONFIG from localStorage:', e);
  saved_config = null;
}

const default_config = {
  overrideStorage: true,
  temperature: {
    location: 'Matão, São Paulo',
    scale: "C",
  },
  clock: {
    format: "h:i p",
    iconColor: "#ff4d8d",
  },
  search: {
    engines: {
      g: ["https://google.com/search?q=", "Google"],
      d: ["https://duckduckgo.com/html?q=", "DuckDuckGo"],
      y: ["https://youtube.com/results?search_query=", "Youtube"],
      r: ["https://www.reddit.com/search/?q=", "Reddit"],
      p: ["https://www.pinterest.es/search/pins/?q=", "Pinterest"],
    },
  },
  keybindings: {
    "s": "search-bar",
    "q": "config-tab",
    "e": "tabs-list",
  },
  disabled: [],
  localIcons: false,
  openLastVisitedTab: true,
  background: 'src/img/banners/bg-1.gif',
  customBackgrounds: [],
  weather: {
    apiKey: '50a34e070dd5c09a99554b57ab7ea7e2',
  },
  tabs: [
    {
      name: "main",
      background_url: "src/img/banners/cbg-9.gif",
      categories: [
        {
          name: "watch",
          links: [
            {
              name: "youtube",
              url: "https://www.youtube.com/",
              icon: "brand-youtube-filled",
              icon_color: "#ff4d8d",
            },
          ],
        },
        {
          name: "inspiration",
          links: [
            {
              name: "pinterest",
              url: "https://www.pinterest.es/",
              icon: "brand-pinterest",
              icon_color: "#ff4d8d",
            },
          ],
        },
        {
          name: "code",
          links: [
            {
              name: "github",
              url: "https://github.com/",
              icon: "brand-github",
              icon_color: "#4cc9f0",
            },
          ],
        },
        {
          name: "mail",
          links: [
            {
              name: "gmail",
              url: "https://mail.google.com/mail/u/0/",
              icon: "brand-gmail",
              icon_color: "#ff4d8d",
            },
          ],
        },
      ],
    },
    {
      name: "ai",
      background_url: "src/img/banners/cbg-13.gif",
      categories: [{
        name: "neural",
        links: [
          {
            name: "claude",
            url: "https://claude.ai/",
            icon: "message-chatbot",
            icon_color: "#9d4edd",
          },
          {
            name: "chatgpt",
            url: "https://chat.openai.com/",
            icon: "brand-openai",
            icon_color: "#ff4d8d",
          },
          {
            name: "gemini",
            url: "https://gemini.google.com/",
            icon: "sparkles",
            icon_color: "#4cc9f0",
          },
          {
            name: "qwen",
            url: "https://chat.qwen.ai/",
            icon: "letter-q",
            icon_color: "#f7b801",
          },
          {
            name: "deepseek",
            url: "https://chat.deepseek.com/",
            icon: "search",
            icon_color: "#ff4d8d",
          },
          {
            name: "perplexity",
            url: "https://www.perplexity.ai/",
            icon: "brain",
            icon_color: "#9d4edd",
          },
        ],
      }],
    },
  ],
};

const CONFIG = new Config(saved_config ?? default_config);
// const CONFIG = new Config(default_config);

(function() {
  var css = document.createElement('link');
  css.href = 'src/css/tabler-icons.min.css';
  css.rel = 'stylesheet';
  css.type = 'text/css';
  if (!CONFIG.config.localIcons)
    document.getElementsByTagName('head')[0].appendChild(css);
})();
