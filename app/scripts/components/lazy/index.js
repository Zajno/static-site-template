
import { BeginLoading, SetMainElememt } from './lazyLoadComponent';
import ImageLazyLoadComponent from './imageLazyLoadComponent';

function RegisterAllImages() {
    ImageLazyLoadComponent.RegisterAll();
}

export default {
    RegisterAllImages,
    BeginLoading,
    SetMainElememt,
};
