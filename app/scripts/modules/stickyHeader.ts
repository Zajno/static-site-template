
const classes = {
    menu: 'show-menu',
};

const treshold = 0;

let headers: NodeListOf<HTMLElement>;
let enabled: boolean;

function setEnabled(enable: boolean) {
    if (enabled === enable) {
        return;
    }

    enabled = enable;

    if (!headers) {
        headers = document.querySelectorAll('.header');
    }

    if (enabled) {
        headers.forEach(h => {
            h.classList.add(classes.menu);
        });
    } else {
        headers.forEach(h => {
            h.classList.remove(classes.menu);
        });
    }
}

function update(currentScroll: number) {
    setEnabled(currentScroll > treshold);
}

export default {
    update,
};
