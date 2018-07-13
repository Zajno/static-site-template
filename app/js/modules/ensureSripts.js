
async function gsapAsync() {
    return import(/* webpackMode: "lazy" */ 'gsap');
}

// async function jqueryAsync() {
//     return import(/* webpackMode: "lazy" */ 'jquery');
// }

export default {
    gsapAsync,
    // jqueryAsync,
};
