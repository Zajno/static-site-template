
import { BeginLoading, SetMainElememt } from './lazyLoadComponent';
import ImageLazyLoadComponent from './imageLazyLoadComponent';

function RegisterAllImages() {
    console.log('start load');
    ImageLazyLoadComponent.RegisterAll();
}

export default {
    RegisterAllImages,
    BeginLoading,
    SetMainElememt,
};
