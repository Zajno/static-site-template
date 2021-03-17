import 'styles/common/ie-styles.sass';

// if ie.html contains images, require them here
import '../../assets/img/iechrome.png';
import '../../assets/img/iefirefox.png';
import '../../assets/img/ieopera.png';

/* global require */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const html = require('../../html/common/ie.html?inline');

export default html;
