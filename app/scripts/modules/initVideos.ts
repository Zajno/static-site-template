import logger from 'app/logger';

const SCREEN_WIDTH_FOR_VIDEOS = 1024;
// if (window.innerWidth > 1024 && $('.home-hero-img-wrap').length > 0) {

export default function initVideos(width: number) {
    // home page change content video & img
    const videos = document.querySelectorAll('.home-hero-img-wrap video') as NodeListOf<HTMLVideoElement>;
    const videoSources = document.querySelectorAll('.home-hero-img-wrap video source') as NodeListOf<HTMLSourceElement>;
    const imgEl = document.querySelectorAll('.home-hero-img-wrap .img-large') as NodeListOf<HTMLImageElement>;

    // logger.log('initVideos:', videos);
    if (width > SCREEN_WIDTH_FOR_VIDEOS && videos.length > 0) {
        logger.log('initVideos: videos!');
        videoSources.forEach(elem => {
            elem.src = elem.dataset.src; // $(elem).data('src');
        });
        videos[0].load();
    } else {
        logger.log('initVideos: images!');
        imgEl.forEach((elem) => {
            elem.src = elem.dataset.src; // $(elem).data('src');
        });
    }
}
