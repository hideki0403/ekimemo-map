type StoreItem = {
    [key: string]: {
        default: any
        value?: any
    }
}

type ItemKeys<T extends StoreItem, V> = {
    [K in keyof T]: V
}

class Store<T extends StoreItem> {
    private key: string
    private store: T
    private watchers: ItemKeys<T, Function[]>

    constructor(key: string, store: T) {
        const rawStorage = localStorage.getItem(`store::${key}`)
        const storage = rawStorage ? JSON.parse(rawStorage) : {}

        this.key = key
        this.store = Object.assign(storage, store)
        this.watchers = {} as ItemKeys<T, Function[]>
    }

    public get<K extends keyof T>(key: K): T[K]['default'] {
        return this.store[key].value ?? this.store[key].default
    }

    public set<K extends keyof T>(key: K, value: T[K]['default']) {
        this.store[key].value = value
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
        localStorage.setItem(`store::${this.key}`, JSON.stringify(this.store))
    }
}

export const defaultStore = new Store('settings', {
    useDarkMode: {
        default: true
    },
    darkTheme: {
        default: 'NordDark'
    },
    lightTheme: {
        default: 'Apricot'
    },
})