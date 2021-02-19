

export function loadScript(src: string) {

    return new Promise<void>((resolve, reject) => {
        const script = window.document.createElement('script') as HTMLScriptElement;

        script.src = src;
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();

        window.document.body.appendChild(script);
    });

}

export function runScript(content: string) {

    const script = window.document.createElement('script') as HTMLScriptElement;

    script.type = 'text/javascript';
    script.innerHTML = content;

    window.document.body.appendChild(script);
}

