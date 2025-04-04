document.getElementById('mobile-menu-button').addEventListener('click', function () {
    const menu = document.getElementById('navigation-menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
    menu.classList.toggle('flex-col');
    menu.classList.toggle('absolute');
    menu.classList.toggle('top-20');
    menu.classList.toggle('left-0');
    menu.classList.toggle('right-0');
    menu.classList.toggle('bg-black/50');
    menu.classList.toggle('p-4');
    menu.classList.toggle('shadow-md');
    menu.classList.toggle('space-y-4');
    menu.classList.toggle('backdrop-blur-sm');

    // Agregar animación de fade a los elementos del menú
    const links = menu.getElementsByTagName('a');
    Array.from(links).forEach((link, index) => {
        link.classList.toggle('opacity-0');
        link.classList.toggle('opacity-100');
        link.style.transitionDelay = `${index * 100}ms`;
    });
});
