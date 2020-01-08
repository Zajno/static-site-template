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

interface ILazyLoadable extends Component {
    readonly priority: number;
    beginLoading(): void;
}

let mainElement: HTMLElement;

class LoadGroup {

    private leftToLoad: number = null;
    private _isLoading: boolean = false;
    private targets: ILazyLoadable[] = [];

    static current: { [priority: number]: LoadGroup } = {};

    static priorities: number[] = [];

    static currentPriorityIndex = -1;

    static loadingStarted = false;

    constructor(private priority: number) {
    }

    _itemLoaded(comp: ILazyLoadable) {
        if (this.leftToLoad <= 0) {
            return;
        }

        this.leftToLoad--;
        log('[LazyLoadGroup] this.leftToLoad =', this.leftToLoad, comp.element);

        if (this.leftToLoad <= 0) {
            log('[LazyLoadGroup] Group loading finished, prio =', this.priority, ', targets count =', this.targets.length);
            LoadGroup._loadNext();

            if (mainElement) {
                mainElement.classList.add(classes.mainLoadedTemplate(this.priority));
            }
        }
    }

    add(comp: ILazyLoadable) {
        this.targets.push(comp);

        if (LoadGroup.loadingStarted && LoadGroup.currentPriorityIndex >= 0) {
            const currentLoadingPrio = LoadGroup.priorities[LoadGroup.currentPriorityIndex] || Number.MAX_VALUE;
            if (this.priority <= currentLoadingPrio) {
                this.leftToLoad++;
                log('[LazyLoadGroup] extra added', this.leftToLoad, comp.element);
                comp.beginLoading();
            }
        }
    }

    begin() {
        this.leftToLoad = this.targets.length;
        log('[LazyLoadGroup] Loading group with prio =', this.priority, ', targets count =', this.leftToLoad);

        this.targets.forEach(target => {
            target.beginLoading();
        });
    }

    static register(comp: ILazyLoadable) {
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
    register?: boolean;
}

export default abstract class LazyLoadComponent<TConfig extends LazyLoadConfig = LazyLoadConfig>
    extends Component<TConfig> implements ILazyLoadable {

    protected loaded: boolean;
    protected loading: boolean;
    protected _priority: number;
    private _loadClasses: string[];
    private _group: LoadGroup;

    protected async doSetup(): Promise<void> {
        this.loaded = false;
        this.loading = false;
        this._priority = +this.element.dataset.loadPriority || 0;

        this._loadClasses = [classes.show];
        this.populateAdditionalClasses();

        if (this._config.register) {
            this.register();
        }
    }

    get priority() {
        return this._priority || 0;
    }

    protected register() {
        if (this._group) {
            return;
        }

        this._group = LoadGroup.register(this);
    }

    protected populateAdditionalClasses() {
        const items = this.element.dataset.loadAddClass;

        if (items) {
            const customClasses = (items || '').split(',')
                .map(s => s.trim())
                .filter(s => s);

            this._loadClasses.push(...customClasses);
        }
    }

    beginLoading() {
        if (this.loading || this.loaded) {
            return;
        }

        this.loading = true;

        this._doLoading()
            .then(this._finishLoading);
    }

    protected abstract _doLoading(): Promise<void>;

    private _finishLoading = () => {
        this.loading = false;
        log(this._group, 'group of image ');
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
