import logger from 'app/logger';
import Component, { ComponentConfig } from 'app/core/component';

const classes = {
    show: 'lazyLoaded',
    mainLoadedTemplate: priority => `lazy-loaded-priority-${priority}`,
};

const LOG_ENABLED = false;

function log(...args) {
    if (LOG_ENABLED) {
        logger.log(...args);
    }
}

let mainElement: HTMLElement;

class LoadGroup  {

    private priority: number;
    private leftToLoad: number;

    static current = {};

    static priorities: number[] = [];

    static currentPriorityIndex = -1;

    static loadingStarted = false;
    targets: any;
    _isLoading: boolean;

    constructor(priority: number) {
        this.priority = priority;
        this.leftToLoad = null;
        /** @type {LazyLoadComponent[]} */
        this.targets = [];

        this._isLoading = false;
    }

    /** @param {LazyLoadComponent} comp */
    _itemLoaded(comp) {
        if (this.leftToLoad <= 0) {
            return;
        }

        this.leftToLoad--;
        log('[LazyLoadGroup] this.leftToLoad =', this.leftToLoad, comp._el);

        if (this.leftToLoad <= 0) {
            log('[LazyLoadGroup] Group loading finished, prio =', this.priority, ', targets count =', this.targets.length);
            LoadGroup._loadNext();

            if (mainElement) {
                mainElement.classList.add(classes.mainLoadedTemplate(this.priority));
            }
        }
    }

    /** @param {LazyLoadComponent} comp */
    add(comp) {
        this.targets.push(comp);

        if (LoadGroup.loadingStarted && LoadGroup.currentPriorityIndex >= 0) {
            const currentLoadingPrio = LoadGroup.priorities[LoadGroup.currentPriorityIndex] || Number.MAX_VALUE;
            if (this.priority <= currentLoadingPrio) {
                this.leftToLoad++;
                log('[LazyLoadGroup] extra added', this.leftToLoad, comp._el);
                comp._beginLoading();
            }
        }
    }

    begin() {
        this.leftToLoad = this.targets.length;
        log('[LazyLoadGroup] Loading group with prio =', this.priority, ', targets count =', this.leftToLoad);

        this.targets.forEach(target => {
            target._beginLoading();
        });
    }
    protected doSetup(config: any): void | Promise<void> {
        throw new Error('Method not implemented.');
    }
    /**
     * @param {LazyLoadComponent} comp
     * @returns {LoadGroup}
     */
    static register(comp) {
        const { priority } = comp;

        let group = LoadGroup.current[priority];
        if (!group) {
            group = new LoadGroup(priority);
            LoadGroup.current[priority] = group;
            LoadGroup.priorities.push(priority);
        }

        group.add(comp);

        return group;
    }

    static beginLoading() {
        if (LoadGroup.loadingStarted) {
            return;
        }

        LoadGroup.loadingStarted = true;

        LoadGroup.priorities.sort();

        LoadGroup._loadNext();
    }

    static _loadNext() {
        ++LoadGroup.currentPriorityIndex;

        if (LoadGroup.currentPriorityIndex >= LoadGroup.priorities.length) {
            // we're done!
            return;
        }

        const prio = LoadGroup.priorities[LoadGroup.currentPriorityIndex];
        const group = LoadGroup.current[prio];

        group.begin();
    }
}
export interface LazyLoadConfig extends ComponentConfig {
    register: Boolean;
}

export default class LazyLoadComponent<TConfig extends LazyLoadConfig = LazyLoadConfig> extends Component<TConfig> {
    private loaded: boolean;
    private loading: boolean;
    private _priority: number;
    private _loadClasses: string[];
    private _group: any;

    protected async doSetup(): Promise<void> {

        this.loaded = false;
        this.loading = false;
        console.log('setup lazy load')
        this._priority = +this.element.dataset.loadPriority;

        this._loadClasses = [classes.show];
        this.populateAdditionalClasses();

        if (this._config.register) {
            this.register();
        }
    }

    get priority() {
        return this.priority || 0;
    }

    register() {
        if (this._group) {
            return;
        }

        this._group = LoadGroup.register(this);
    }

    populateAdditionalClasses() {

        this._doLoading()
            .then(this._finishLoading.bind(this));
    }

    _doLoading(): Promise<void> {

        logger.warn('[LazyLoadComponent] Component lazy loading is not implemented', this);
        return Promise.resolve();

    }

    _finishLoading() {
        this.loading = false;

        this._loadClasses.forEach(lc => this.element.classList.add(lc));
        // this._el.classList.add(...this._loadClasses);

        this._group._itemLoaded(this);

        this.loaded = true;
    }
}

export function BeginLoading() {
    LoadGroup.beginLoading();
}

export function SetMainElememt(el: HTMLElement) {
    mainElement = el;
}
type a = {};
type b = [];