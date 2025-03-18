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
      const keys = element.dataset.i18n.split("."); // Dividimos la key, ej: "objectives.title"
  
      // Navegamos dinámicamente por el objeto usando dot notation
      let value = translations;
      keys.forEach((key) => {
        if (value[key]) {
          value = value[key];
        } else {
          console.warn(`La clave "${key}" no se encuentra en el objeto translations.`);
          value = null;
          return;
        }
      });
  
      // Si encontramos un valor, lo actualizamos
      if (value) {
        element.innerText = value;
      }
    });
  }
});
