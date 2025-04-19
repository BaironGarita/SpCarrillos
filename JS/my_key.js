// Configuración de la API de la Biblia
const API_KEY = "0d353db371695e1880013884ba6f06a2";
const BASE_URL = 'https://api.scripture.api.bible/v1';
const DEFAULT_BIBLE_ID = 'b32b9d1b64b4ef29-01';

// Lista de versículos predefinidos
const PREDEFINED_VERSES = [
    'JER.29.11', 'PSA.23', '1COR.4.4-8', 'PHP.4.13',
    'JHN.3.16', 'ROM.8.28', 'ISA.41.10', 'PSA.46.1',
    'GAL.5.22-23', 'HEB.11.1', '2TI.1.7', '1COR.10.13',
    'PRO.22.6', 'ISA.40.31', 'JOS.1.9', 'HEB.12.2',
    'MAT.11.28', 'ROM.10.9-10', 'PHP.2.3-4', 'MAT.5.43-44'
];

// Clase principal para manejar la API de la Biblia
class BibleAPI {
    constructor(apiKey = API_KEY, bibleId = DEFAULT_BIBLE_ID) {
        this.apiKey = apiKey;
        this.bibleId = bibleId;
    }

    async fetchFromAPI(endpoint) {
        try {
            console.log(`Fetching from API: ${BASE_URL}${endpoint}`);
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: {
                    'api-key': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching from API:', error);
            throw error;
        }
    }

    async getBibleVersions() {
        try {
            const data = await this.fetchFromAPI('/bibles');
            return data.data;
        } catch (error) {
            console.error('Error fetching Bible versions:', error);
            return [];
        }
    }

    async getPassage(verseId) {
        try {
          const params = new URLSearchParams({ 'content-type': 'text' });
          const data = await this.fetchFromAPI(
            `/bibles/${this.bibleId}/passages/${verseId}?${params}`
          );
          return data.data;
        } catch (error) {
          console.error('Error fetching passage:', error);
          throw error;
        }
      }
      
      async getRandomVerse() {
        const verseIndex = Math.floor(Math.random() * PREDEFINED_VERSES.length);
        const verseId = PREDEFINED_VERSES[verseIndex];
        return await this.getPassage(verseId); // Usar getPassage en lugar de getVerse
      }

    sortVersionsByLanguage(versions) {
        const grouped = {};
        
        versions.forEach(version => {
            const language = version.language.name;
            if (!grouped[language]) {
                grouped[language] = [];
            }
            grouped[language].push(version);
        });
        
        // Ordenar cada grupo alfabéticamente por nombre
        for (let language in grouped) {
            grouped[language].sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return grouped;
    }
}

// Exportar la clase y constantes útiles
window.BibleAPI = BibleAPI;
window.PREDEFINED_VERSES = PREDEFINED_VERSES;   

// Inicializar y mostrar un versículo aleatorio en la página
async function initRandomVerse(contentSelector = '#verse-content', refSelector = '#verse') {
  try {
    const api = new BibleAPI();
    const verseData = await api.getRandomVerse();
    document.querySelector(contentSelector).innerHTML = verseData.content || '';
    document.querySelector(refSelector).textContent = verseData.reference || '';
  } catch (error) {
    console.error('Error al mostrar versículo:', error);
    document.querySelector(contentSelector).innerHTML = 'Lo siento, hubo un error al cargar el versículo.';
  }
}

document.addEventListener('DOMContentLoaded', () => initRandomVerse());
