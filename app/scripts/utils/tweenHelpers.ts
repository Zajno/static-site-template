
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

const customEase = CustomEase.create('customEase', 'M0,0 C0.17,0.17 0.22,1 1,1 ');

function hideElements(elements) {
    gsap.set(elements, { autoAlpha: 0 });
}

function clearTweens(elements) {
    gsap.killTweensOf(elements);
}

export default {
    customEase,
    hideElements,
    clearTweens,
};
