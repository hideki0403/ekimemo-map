type StoreItem = {
    [key: string]: {
        default: any
        value?: any
    }
}

type ItemKeys<T extends StoreItem, V> = {
    [K in keyof T]: V
}

type StateStore<T extends StoreItem> = {
    [K in keyof T]: T[K]['default']
}

class Store<T extends StoreItem> {
    private key: string
    private store: T
    private state: StateStore<T>
    private watchers: ItemKeys<T, Function[]>

    constructor(key: string, store: T) {
        const rawStorage = localStorage.getItem(`store::${key}`)
        const storage: StateStore<T> = rawStorage ? JSON.parse(rawStorage) : {}

        this.key = key
        this.store = store
        this.state = storage
        this.watchers = {} as ItemKeys<T, Function[]>
    }

    public get<K extends keyof T>(key: K): T[K]['default'] {
        return this.state[key] ?? this.store[key].default
    }

    public set<K extends keyof T>(key: K, value: T[K]['default']) {
        this.state[key] = value
        if (this.watchers[key]) this.watchers[key].forEach((callback) => callback(value))
        this.save()
    }

    public toModel<K extends keyof T>(key: K) {
        return {
            get: () => this.get(key),
            set: (v: T[K]['default']) => this.set(key, v)
        }
    }

    public watch<K extends keyof T>(key: K | K[], callback: (value: T[K]['default']) => void) {
        if (Array.isArray(key)) {
            key.forEach((k) => this.watch(k, callback))
            return
        }
        
        if (!this.watchers[key]) this.watchers[key] = []
        this.watchers[key].push(callback)
    }

    public save() {
        localStorage.setItem(`store::${this.key}`, JSON.stringify(this.state))
    }
}

export const settingsStore = new Store('settings', {
    useDarkMode: {
        default: true
    },
    darkTheme: {
        default: 'NordDark'
    },
    lightTheme: {
        default: 'Apricot'
    },
    stationResultCount: {
        default: 18
    },
    stationResultSort: {
        default: 'game' as 'game' | 'real' // TODO
    },
    cooldownSeconds: {
        default: 320
    },
    enableStationReminder: {
        default: true
    }
})

export const stateStore = new Store('state', {
    lastCheck: {
        default: new Date('2023-07-01').toISOString()
    },
    currentVersion: {
        default: ''
    },
})