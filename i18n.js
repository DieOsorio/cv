document.addEventListener("DOMContentLoaded", async function () {
  const userLang = getBrowserLanguage();
  const translations = await loadTranslations(userLang);

  updateContent(translations);

  function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith("es") ? "es" : "en"; // Si el idioma es español, usa "es", sino "en"
  }

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`./utilis/${lang}/${lang}.json`);
      if (!response.ok) throw new Error("Error cargando el archivo de idioma");

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return {}; // Si hay un error, devuelve un objeto vacío para evitar fallos
    }
  }

  function updateContent(translations) {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const keys = element.dataset.i18n.split(".");
      let value = translations;
      for (let key of keys) {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
          value = value[key];
        } else {
          console.warn(`La clave "${key}" no se encuentra en el objeto translations.`);
          value = null;
          break;
        }
      }
      if (value !== null && value !== undefined) {
        element.innerText = value;
      }
    });
  }
});
