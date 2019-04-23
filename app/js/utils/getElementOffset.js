export default function getCoords(elem) {
    const box = elem.getBoundingClientRect();
    const pageYOffset = window.pageYOffset;
    const pageXOffset = window.pageXOffset;

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
    };
}
