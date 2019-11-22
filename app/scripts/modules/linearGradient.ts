import { TweenMax, TimelineMax } from 'gsap';
import logger from 'app/logger';

type LinearGradient = {
    directionDegrees: number,
    colors: {color: string, pos: number }[],
};

function updateGradientFunc(target: HTMLElement, source: LinearGradient) {
    return () => {
        const css = [
            'linear-gradient(',
            [
                `${source.directionDegrees.toFixed(2)}deg`,
                ...source.colors.map(c => `${c.color} ${(c.pos * 100).toFixed(3)}%`),
            ].join(', '),
            ')',
        ].join('');

        // logger.log('CSS', css);
        target.style.backgroundImage = css;
    };
}

function animateFromTo(target: HTMLElement, duration: number, from: LinearGradient, to: LinearGradient) {
    const stops = [];
    const tweens = [];

    for (let i = 0; i < from.colors.length && i < to.colors.length; ++i) {
        const colorCurrent = { ...from.colors[i] };
        const colorTo = to.colors[i];

        stops.push(colorCurrent);
        tweens.push(TweenMax.to(colorCurrent, duration, { color: colorTo.color, pos: colorTo.pos }));
    }

    const current = {
        directionDegrees: from.directionDegrees,
        colors: stops,
    };

    const timeline = new TimelineMax({ onUpdate: updateGradientFunc(target, current) });

    timeline.add(
        TweenMax.to(current, duration, { directionDegrees: to.directionDegrees }),
        0,
    );

    tweens.forEach(t => {
        timeline.add(t, 0);
    });

    return timeline;
}

function construct(rotationDegrees: number, ...stops: {c: string, p: number }[]): LinearGradient {
    return {
        directionDegrees: rotationDegrees,
        colors: stops.map(s => ({ color: s.c, pos: s.p })),
    };
}

export default {
    animateFromTo,
    construct,
};
