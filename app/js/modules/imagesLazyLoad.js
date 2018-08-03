import logger from 'logger';

const classes = {
    show: 'lazyLoaded',
};

let loaded;

/**
 * @callback GroupItemLoadedCallback
 */

/** @typedef {{priority:number, itemLoaded:GroupItemLoadedCallback, leftToLoad:number, targets:HTMLElement[]}} Group */


/** @type {Object.<number, Group>} */
const groups = {

};

/** @type {number[]} */
const priorities = [];
let currentPriorityIndex = -1;

/** @param {Group} group */
function processGroup(group) {

    group.leftToLoad = group.targets.length;

    logger.log('[ImagesLazy] Loading group with prio =', group.priority, ', targets count =', group.leftToLoad);
    logger.log(group.targets)
    group.targets.forEach(target => {
        // processing
        if (!target.dataset.src && target.complete) {
            group.itemLoaded(target);

            return;
        }

        target.onload = () => {
            group.itemLoaded(target);
        };

        if (target.dataset.src) {
            target.src = target.dataset.src;
        }
    });
}

function loadNextGroup() {
    ++currentPriorityIndex;

    if (currentPriorityIndex >= priorities.length) {
        // we're done!
        return;
    }

    const prio = priorities[currentPriorityIndex];
    const group = groups[prio];

    processGroup(group);
}

function doLoad() {
    if (loaded) {
        return;
    }

    loaded = true;

    const lazyImages = document.querySelectorAll('img.lazy');

    // sort images by priority

    lazyImages.forEach(/** @param {HTMLImageElement} e */ e => {
        // logger.log('[ImagesLazy] Target dataset:', e.dataset, e);
        const prio = (+e.dataset.loadPriority) || 0;
        /** @type {Group} */
        let group = groups[prio];
        if (!group) {
            group = {
                priority: prio,
                targets: [],
                leftToLoad: null,
                /** @param {HTMLElement} target */
                itemLoaded(target) {

                    target.classList.add(classes.show);

                    if (target.dataset.loadAddClass) {
                        const customClasses = (target.dataset.loadAddClass || '').split(',')
                            .map(s => s.trim())
                            .filter(s => s);
                        target.classList.add(...customClasses);
                    }

                    if (this.leftToLoad <= 0) {
                        return;
                    }

                    this.leftToLoad--;

                    if (this.leftToLoad <= 0) {
                        logger.log('[ImagesLazy] Group loading finished, prio =', this.priority, ', targets count =', this.targets.length);
                        loadNextGroup();
                    }
                },
            };
            groups[prio] = group;
            priorities.push(prio);
        }

        group.targets.push(e);
    });

    priorities.sort();

    loadNextGroup();
}

export default {
    doLoad,
};
