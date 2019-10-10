export default function getUrlVars() {
    const vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        vars[key] = value;
        return null;
    });
    return vars;
}

export function getUrlVarsV2() {
    let match;
    const pl = /\+/g;  // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g;
    const decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
    const query  = window.location.search.substring(1);

    const urlParams = {};

    while (match = search.exec(query)) {
       urlParams[decode(match[1])] = decode(match[2]);
    }

    return urlParams;
}
