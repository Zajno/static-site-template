import 'styles/base.sass';
import 'styles/common/ieStyles.sass';

// if ie.html contains images, require them here
import '../../assets/img/iechrome.png';
import '../../assets/img/iefirefox.png';
import '../../assets/img/ieopera.png';

import html from '!raw-loader!../../html/common/ie.html';

export default html;
