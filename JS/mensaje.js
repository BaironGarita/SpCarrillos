document.addEventListener("alpine:init", () => {
  Alpine.data("formData", () => ({
    enviarAnonimo: false,
    mostrarNombre: true,
    nombre: "",
    mensaje: "",
    numeroTelefono: "+50664068796",

    init() {
      // Puedes agregar lógica de inicialización aquí si es necesario
    },

    enviarWhatsApp() {
      let mensajeWhatsApp = "";

      if (this.enviarAnonimo) {
        mensajeWhatsApp = `Mensaje anónimo:\n${this.mensaje}`;
      } else {
        mensajeWhatsApp = `Nombre: ${this.nombre}\nMensaje: ${this.mensaje}`;
      }

      const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
      const urlWhatsApp = `https://wa.me/${this.numeroTelefono}?text=${mensajeCodificado}`;

      window.open(urlWhatsApp, "_blank");
    },
  }));
});
