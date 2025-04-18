// Register homeData component with Alpine on init

document.addEventListener('alpine:init', () => {
  Alpine.data('homeData', () => ({
    activeSlide: 0,
    slides: [
      {
        img: "img/Carousel-1.webp",
        title: "Iglesia Carrillos Bajo de Poás",
        link: "Html/Peticiones.Html",
        buttonText: "Tienes Peticiones de Oración?"
      },
      {
        img: "img/Carousel-2.webp",
        title: "Iglesia Carrillos Bajo de Poás",
        link: "Html/Peticiones.Html",
        buttonText: "Tienes Peticiones de Oración?"
      }
    ],
    visionMission: [
      {
        title: "Visión",
        text: "Conectar en adoración al hombre con Dios, restaurándolo y llevándolo a ser un discípulo comprometido con Jesucristo, su familia, la iglesia, la comunidad y el mundo.",
        ref: "1 Pedro 2:9"
      },
      {
        title: "Misión",
        text: "Predicar el evangelio utilizando todas las formas y oportunidades dadas por el Espíritu Santo, discipular, desarrollar madurez, equipar a los santos, crecer integralmente y mantener la armonía.",
        ref: "Marcos 16:15"
      }
    ],
    next() {
      this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    },
    prev() {
      this.activeSlide = (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    }
  }));
});
