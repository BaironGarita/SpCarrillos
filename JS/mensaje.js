document.addEventListener("alpine:init", () => {
  Alpine.data("formData", () => ({
    enviarAnonimo: false,
    mostrarNombre: true,
    nombre: "",
    mensaje: "",
    numeroTelefono: "+50664068796",
    errorMsg: "",

    enviarWhatsApp() {
      this.errorMsg = "";
      if (this.mostrarNombre && (!this.nombre || this.nombre.trim() === "")) {
        this.errorMsg = "Por favor, ingresa tu nombre.";
        return;
      }
      if (!this.mensaje || this.mensaje.trim() === "") {
        this.errorMsg = "Por favor ingresa tu petición de oración.";
        return;
      }

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
