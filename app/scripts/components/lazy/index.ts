
import { BeginLoading, SetMainElement } from './lazyLoadComponent';
import ImageLazyLoadComponent from './imageLazyLoadComponent';

function RegisterAllImages() {
    ImageLazyLoadComponent.RegisterAll();
}

export default {
    RegisterAllImages,
    BeginLoading,
    SetMainElement,
};
