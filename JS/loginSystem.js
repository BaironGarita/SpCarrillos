// loginSystem.js
// Sistema de login reutilizable con Alpine.js para proyectos sin backend

function loginSystem() {
  return {
    username: '',
    password: '',
    isLoggedIn: false,
    showLoginModal: false,
    loginError: '',
    showWelcome: false,
    // Función para simular login
    login() {
      // Simulamos validación simple (normalmente esto se haría en el backend)
      if (this.password.length < 4) {
        this.loginError = 'La contraseña debe tener al menos 4 caracteres';
        return;
      }

      // Simulamos autenticación exitosa
      this.isLoggedIn = true;
      this.showLoginModal = false;
      this.loginError = '';

      // Mostrar popup de bienvenida
      this.showWelcome = true;
      setTimeout(() => { this.showWelcome = false; }, 4000);

      // Guardamos el estado de login en localStorage para persistencia
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', this.username);

      // Enviamos correo de notificación
      this.sendLoginNotification();
    },
    // Función para cerrar sesión
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.password = '';
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    },
    // Función para enviar notificación por correo
    sendLoginNotification() {
      // Aquí usamos EmailJS para enviar el correo
      // Necesitarás configurar tu cuenta en https://www.emailjs.com/
      const serviceID = 'YOUR_SERVICE_ID'; // Reemplazar con tu service ID
      const templateID = 'YOUR_TEMPLATE_ID'; // Reemplazar con tu template ID
      const userID = 'YOUR_USER_ID'; // Reemplazar con tu user ID
      const templateParams = {
        to_email: 'correo@destino.com', // Reemplazar con el correo de destino
        user_name: this.username,
        login_time: new Date().toLocaleString()
      };
      // Comentado para evitar errores ya que requiere configuración
      // Descomenta y configura cuando tengas tus credenciales
      /*
      emailjs.send(serviceID, templateID, templateParams, userID)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
          console.log('FAILED...', error);
        });
      */
      // Simulamos éxito en la consola
      console.log('Notificación enviada para usuario:', this.username);
    },
    // Inicialización - Verifica si hay una sesión guardada
    init() {
      const savedLogin = localStorage.getItem('isLoggedIn');
      if (savedLogin === 'true') {
        this.isLoggedIn = true;
        this.username = localStorage.getItem('username') || '';
      }
    }
  };
}
