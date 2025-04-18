// loginSystem.js
// Sistema de login reutilizable con Alpine.js para proyectos sin backend
function loginSystem() {
  return {
    username: "",
    password: "",
    isLoggedIn: false,
    showLoginModal: false,
    loginError: "",
    showWelcome: false,
    // Función para simular login
    login() {
      // Simulamos validación simple (normalmente esto se haría en el backend)
      if (this.password.length < 4) {
        this.loginError = "La contraseña debe tener al menos 4 caracteres";
        return;
      }
      // Simulamos autenticación exitosa
      this.isLoggedIn = true;
      this.showLoginModal = false;
      this.loginError = "";
      // Mostrar popup de bienvenida
      this.showWelcome = true;
      setTimeout(() => {
        this.showWelcome = false;
      }, 4000);
      // Guardamos el estado de login en localStorage para persistencia
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", this.username);
      // Enviamos correo de notificación
      this.InicializarEmailjs();
      this.sendLoginNotification();
    },
    // Función para cerrar sesión
    logout() {
      this.isLoggedIn = false;
      this.username = "";
      this.password = "";
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
    },
    // Función para enviar notificación por correo (usando FormSubmit)

    InicializarEmailjs() {
      emailjs.init({
        publicKey: "IDEgNjhkkuiDGCYxh",
      });
    },
    sendLoginNotification() {
      const serviceID = "service_o1rvzf7";
      const templateID = "template_otmf7a8";
      const templateParams = {
        name: this.username,
        email_to: "bairongaba@gmail.com",
        time: new Date().toLocaleString(),
        message: "Se da por notificado el inicio de sesion.",
      };

      emailjs.send(serviceID, templateID, templateParams).then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
    },
    // Inicialización - Verifica si hay una sesión guardada
    init() {
      const savedLogin = localStorage.getItem("isLoggedIn");
      if (savedLogin === "true") {
        this.isLoggedIn = true;
        this.username = localStorage.getItem("username") || "";
      }
    },
  };
}
