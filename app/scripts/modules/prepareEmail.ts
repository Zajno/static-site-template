
export function prepareEmail(to: string, subject: string, bodyText: string) {
    const form = document.createElement('form');

    // Set the form attributes
    form.setAttribute('method', 'post');
    form.setAttribute('enctype', 'text/plain');
    form.setAttribute('action', 'mailto:' + escape(to) + '?Subject=' + escape(subject) + '&Body=' + escape(bodyText ? bodyText : ' ') );
    form.setAttribute('style', 'display:none');

    // Append the form to the body
    document.body.appendChild(form);

    // Submit the form
    form.submit();

    // Clean up
    document.body.removeChild(form);
}

export function setupMailTo() {
    const mailTos = document.querySelectorAll('.mailto-link');
    mailTos.forEach(mailto => {
        const to = 'hello@zajno.com';
        const subject = 'Subject';
        const bodyText = 'Your message goes here';
        mailto.addEventListener('click', e => {
            e.preventDefault();
            prepareEmail(to, subject, bodyText);
        });
    });
}
