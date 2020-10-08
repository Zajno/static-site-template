import logger from 'app/logger';

export default function anchors(enableScroll: boolean) {
    // tslint:disable-next-line: no-shadowed-variable
    let anchors: NodeListOf<HTMLElement>;

    anchors = document.querySelectorAll('.anchor-item');

    anchors.forEach(anchor => {
        if (enableScroll) {
            anchor.addEventListener('click', e => {
                e.preventDefault();

                window.scrollTo({
                    top: document.querySelector(`.${anchor.dataset.anchor}`).getBoundingClientRect().y + pageYOffset,
                    behavior: 'smooth',
                });
            });
        }
    });
}