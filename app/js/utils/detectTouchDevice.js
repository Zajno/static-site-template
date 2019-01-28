export default function isTouchable() {
    const touchDevice = window.matchMedia('(any-pointer: coarse)').matches;
    const mouseDevice = window.matchMedia('(any-hover: hover)').matches;

    if (touchDevice && mouseDevice) {
        return false;
    }

    return touchDevice;
}
