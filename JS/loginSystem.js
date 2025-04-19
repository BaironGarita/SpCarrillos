// loginSystem.js
// Sistema de login reutilizable con Alpine.js para proyectos sin backend
// Mejorado: Separación de concerns, inicialización única de EmailJS, uso de constantes.

// --- Constantes ---
// Definimos constantes para mejorar la legibilidad y facilitar cambios
const LOCAL_STORAGE_LOGIN_STATUS_KEY = "isLoggedIn";
const LOCAL_STORAGE_USERNAME_KEY = "username";
const MIN_PASSWORD_LENGTH = 4;

// IDs de Email.js (Considera cómo manejar esto de forma segura en apps reales)
const EMAILJS_PUBLIC_KEY = "IDEgNjhkkuiDGCYxh";
const EMAILJS_SERVICE_ID = "service_bvvhohp";
const EMAILJS_TEMPLATE_ID = "template_otmf7a8";

// --- Inicialización de Servicios Externos ---
// Inicializamos Email.js UNA SOLA VEZ cuando el script se carga
function initializeEmailjs() {
  // Verificar si emailjs existe antes de inicializar
  if (typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
    console.log("Email.js inicializado.");
  } else {
    console.error("Email.js library not loaded.");
    // Considera mostrar un error en la UI o manejar la ausencia de la librería
  }
}

// Llamamos a la inicialización de Email.js al cargar el script
initializeEmailjs();

// --- Función principal del componente Alpine ---
function loginSystem() {
  return {
    // --- Estado ---
    username: "",
    password: "",
    isLoggedIn: false, // Estado principal de autenticación
    showLoginModal: false, // Estado UI para el modal de login
    loginError: "", // Estado UI para mensajes de error
    showWelcome: false, // Estado UI para el popup de bienvenida

    // --- Métodos ---

    // Método de inicialización del componente (llamado con x-init)
    init() {
      console.log("Componente loginSystem inicializado.");
      // Cargar estado guardado de localStorage
      this.loadSavedLoginState();
    },

    // Cargar estado de login desde localStorage
    loadSavedLoginState() {
      const savedLogin = localStorage.getItem(LOCAL_STORAGE_LOGIN_STATUS_KEY);
      if (savedLogin === "true") {
        this.isLoggedIn = true;
        this.username = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY) || "";
        console.log("Estado de login cargado desde localStorage.");
      }
    },

    // Función para simular login
    login() {
      // Limpiar errores previos
      this.loginError = "";

      // Validamos en frontend (simulación)
      if (this.password.length < MIN_PASSWORD_LENGTH) {
        this.loginError = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
        console.warn("Intento de login fallido: Validación de contraseña.");
        return; // Detenemos el proceso si falla la validación
      }

      // --- Lógica de simulación de autenticación exitosa ---
      // En un sistema real, aquí harías una llamada a tu backend
      console.log("Simulando autenticación exitosa...");
      this.isLoggedIn = true; // Marcar como logeado
      this.showLoginModal = false; // Cerrar modal
      this.password = ""; // Limpiar campo de contraseña por seguridad

      // --- Lógica posterior al login ---

      // Guardar estado en localStorage
      this.saveLoginState();

      // Mostrar popup de bienvenida
      this.showWelcomeMessage();

      // Enviar correo de notificación (si Email.js está cargado)
      if (typeof emailjs !== "undefined") {
        this.sendLoginNotification();
      } else {
        console.error("Email.js no está disponible para enviar notificación.");
      }
    },

    // Guardar estado de login en localStorage
    saveLoginState() {
      localStorage.setItem(LOCAL_STORAGE_LOGIN_STATUS_KEY, "true");
      localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, this.username);
      console.log("Estado de login guardado en localStorage.");
    },

    // Mostrar el popup de bienvenida temporalmente
    showWelcomeMessage() {
      this.showWelcome = true;
      console.log("Mostrando mensaje de bienvenida.");
      setTimeout(() => {
        this.showWelcome = false;
        console.log("Ocultando mensaje de bienvenida.");
      }, 4000); // 4 segundos
    },

    // Enviar notificación por correo usando Email.js
    sendLoginNotification() {
      const templateParams = {
        name: this.username || "Usuario Desconocido", // Usar nombre o un fallback
        time: new Date().toLocaleString(),
        message: "Se da por notificado el inicio de sesion.",
      };

      console.log("Intentando enviar notificación por Email.js...");
      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(
          (response) => {
            console.log(
              "Notificación enviada con éxito!",
              response.status,
              response.text
            );
          },
          (error) => {
            console.error("Falló el envío de la notificación...", error);
            // Considera qué hacer en caso de fallo (ej: notificar al usuario, loguear el error en un servicio)
          }
        );
    },

    // Función para cerrar sesión
    logout() {
      console.log("Cerrando sesión...");
      this.isLoggedIn = false;
      this.username = ""; // Limpiar nombre de usuario en el estado
      this.password = ""; // Limpiar contraseña (ya se hace en login, pero buena práctica)

      // Eliminar estado de localStorage
      this.removeLoginState();

      // Opcional: Reiniciar otros estados UI si es necesario al cerrar sesión
      this.showLoginModal = false;
      this.loginError = "";
      this.showWelcome = false; // Asegurarse de que el popup no esté visible
      console.log("Sesión cerrada.");
    },

    // Eliminar estado de login de localStorage
    removeLoginState() {
      localStorage.removeItem(LOCAL_STORAGE_LOGIN_STATUS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
      console.log("Estado de login eliminado de localStorage.");
    },
  };
}
