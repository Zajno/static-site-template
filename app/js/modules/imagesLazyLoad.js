
const classes = {
    show: 'loadLazy',
};

let loaded;

function doLoad() {
    if (loaded) {
        return;
    }

    loaded = true;

    const lazyElements = document.querySelectorAll('.lazy');
    lazyElements.forEach(e => {
        e.onload = () => {
            e.classList.add(classes.show);
        };
        e.src = e.dataset.src;
    });
}

export default {
    doLoad,
};
