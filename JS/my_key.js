// bibleAPI.js
// Interacción con la API de Scripture.api.bible

// --- Constantes ---
// Definimos constantes. NOTA: La API_KEY aquí es visible públicamente.
// Considera un backend proxy para seguridad en aplicaciones reales.
const API_KEY = "0d353db371695e1880013884ba6f06a2"; // ¡RIESGO DE SEGURIDAD!
const BASE_URL = "https://api.scripture.api.bible/v1";
const DEFAULT_BIBLE_ID = "b32b9d1b64b4ef29-01"; // Reina Valera 1960

// Lista de versículos predefinidos
// Usamos 'export' para que pueda ser importada en otros archivos si es necesario
export const PREDEFINED_VERSES = [
  "JER.29.11",
  "PSA.23",
  "1COR.4.4-8",
  "PHP.4.13",
  "JHN.3.16",
  "ROM.8.28",
  "ISA.41.10",
  "PSA.46.1",
  "GAL.5.22-23",
  "HEB.11.1",
  "2TI.1.7",
  "1COR.10.13",
  "PRO.22.6",
  "ISA.40.31",
  "JOS.1.9",
  "HEB.12.2",
  "MAT.11.28",
  "ROM.10.9-10",
  "PHP.2.3-4",
  "MAT.5.43-44",
];

// --- Clase principal para manejar la API de la Biblia ---
// Usamos 'export' para que pueda ser importada
export class BibleAPI {
  constructor(apiKey = API_KEY, bibleId = DEFAULT_BIBLE_ID) {
    this.apiKey = apiKey;
    this.bibleId = bibleId;
    console.log(`BibleAPI initialized with Bible ID: ${this.bibleId}`);
  }

  // Método interno para realizar las peticiones fetch
  async fetchFromAPI(endpoint) {
    const url = `${BASE_URL}${endpoint}`;
    try {
      console.log(`Workspaceing from API: ${url}`);
      const response = await fetch(url, {
        headers: {
          "api-key": this.apiKey,
        },
      });

      if (!response.ok) {
        // Lanzar un error con más detalle si la respuesta no es exitosa
        const errorBody = await response.text(); // Intenta leer el cuerpo del error
        throw new Error(
          `HTTP error! status: ${response.status}, URL: ${url}, Body: ${errorBody}`
        );
      }

      const data = await response.json();
      console.log("API Response received."); // Log menos ruidoso para respuestas exitosas
      return data;
    } catch (error) {
      // Log el error detallado y re-lánzalo
      console.error(`Error fetching from API URL: ${url}`, error);
      throw error; // Re-lanzar para que el código llamador lo maneje
    }
  }

  async getBibleVersions() {
    try {
      const data = await this.fetchFromAPI("/bibles");
      // La API envuelve la lista en una propiedad 'data'
      if (data && data.data && Array.isArray(data.data)) {
        console.log(`Workspaceed ${data.data.length} Bible versions.`);
        return data.data;
      } else {
        console.warn(
          "API response for versions did not contain expected data array:",
          data
        );
        // Lanzar un error si la estructura de la respuesta no es la esperada
        throw new Error("Unexpected API response structure for versions.");
      }
    } catch (error) {
      console.error("Error fetching Bible versions:", error);
      // Re-lanzar el error consistentemente
      throw error;
    }
  }

  async getPassage(verseId) {
    try {
      const params = new URLSearchParams({
        "content-type": "text",
        "include-notes": false,
        "include-titles": false,
        "include-chapter-numbers": false,
        "include-verse-numbers": true,
      }); // Opciones para obtener solo texto y números de versículo
      const endpoint = `/bibles/${
        this.bibleId
      }/passages/${verseId}?${params.toString()}`;
      const data = await this.fetchFromAPI(endpoint);

      // Verificar la estructura de la respuesta para pasajes
      if (
        data &&
        data.data &&
        typeof data.data.content === "string" &&
        typeof data.data.reference === "string"
      ) {
        console.log(`Workspaceed passage for ${verseId}`);
        return data.data;
      } else {
        console.warn(
          "API response for passage did not contain expected content/reference:",
          data
        );
        throw new Error(
          `Unexpected API response structure for passage ${verseId}.`
        );
      }
    } catch (error) {
      console.error(`Error fetching passage ${verseId}:`, error);
      throw error; // Re-lanzar el error
    }
  }

  async getRandomVerse() {
    if (PREDEFINED_VERSES.length === 0) {
      console.warn("PREDEFINED_VERSES list is empty.");
      throw new Error("The list of predefined verses is empty.");
    }
    const verseIndex = Math.floor(Math.random() * PREDEFINED_VERSES.length);
    const verseId = PREDEFINED_VERSES[verseIndex];
    console.log(`Selected random verse ID: ${verseId}`);
    return await this.getPassage(verseId);
  }

  // Este método no interactúa con la API, es una utilidad de procesamiento de datos
  sortVersionsByLanguage(versions) {
    const grouped = {};

    versions.forEach((version) => {
      // Asegurarse de que language y name existen
      const language = version.language?.name || "Unknown Language";
      if (!grouped[language]) {
        grouped[language] = [];
      }
      grouped[language].push(version);
    });

    // Ordenar cada grupo alfabéticamente por nombre
    for (let language in grouped) {
      // Usar hasOwnProperty para evitar iterar sobre propiedades heredadas
      if (Object.prototype.hasOwnProperty.call(grouped, language)) {
        grouped[language].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      }
    }

    return grouped;
  }

  // Método para cambiar la Biblia activa después de la inicialización
  setBibleId(newBibleId) {
    if (typeof newBibleId === "string" && newBibleId) {
      this.bibleId = newBibleId;
      console.log(`Bible ID updated to: ${this.bibleId}`);
    } else {
      console.warn("Invalid Bible ID provided:", newBibleId);
    }
  }
}

// --- Función de inicialización para mostrar un versículo aleatorio (usando las clases) ---
// Esta función sigue mezclando API y UI, pero es un ejemplo de cómo usar la clase.
// En una aplicación con Alpine.js, esta lógica estaría dentro de un componente.
async function initRandomVerseDisplay(
  contentSelector = "#verse-content",
  refSelector = "#verse"
) {
  // Crear una ÚNICA instancia de la API para esta funcionalidad de versículo aleatorio
  const api = new BibleAPI(); // Usa valores por defecto o pásalos aquí si necesitas otros

  try {
    // Obtener el versículo usando la instancia de la clase
    const verseData = await api.getRandomVerse();

    // Actualizar el DOM - Esto es la parte UI
    const contentElement = document.querySelector(contentSelector);
    const refElement = document.querySelector(refSelector);

    if (contentElement) {
      contentElement.innerHTML = verseData.content || ""; // Usar innerHTML si el contenido puede tener etiquetas (como números de versículo)
    } else {
      console.error(
        `Content element not found with selector: ${contentSelector}`
      );
    }

    if (refElement) {
      refElement.textContent = verseData.reference || "";
    } else {
      console.error(
        `Reference element not found with selector: ${refSelector}`
      );
    }

    console.log("Versículo mostrado en la página.");
  } catch (error) {
    console.error("Error al mostrar versículo:", error);
    // Manejo de error en la UI
    const contentElement = document.querySelector(contentSelector);
    if (contentElement) {
      contentElement.innerHTML =
        "Lo siento, hubo un error al cargar el versículo. Por favor, intenta de nuevo más tarde.";
    }
    const refElement = document.querySelector(refSelector);
    if (refElement) {
      refElement.textContent = ""; // Limpiar referencia si falla
    }
  }
}

// Ejecutar la función de inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => initRandomVerseDisplay());

// Si necesitas usar la clase o constantes en otros módulos/scripts:
// import { BibleAPI, PREDEFINED_VERSES } from './tu_ruta_al_archivo/bibleAPI.js';
// const api = new BibleAPI();
// api.getBibleVersions().then(...);
