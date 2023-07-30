class GPS {
    private watchId: number | null
    private callbacks: Function[]
    private active: Ref<boolean>

    constructor() {
        this.watchId = null
        this.callbacks = []
        this.active = ref(false)
    }

    public get isActive() {
        return this.active
    }

    public startWatch(callback?: (position: GeolocationPosition) => void) {
        if (callback) this.callbacks.push(callback)
        if (this.watchId) return

        this.watchId = navigator.geolocation.watchPosition((position) => {
            this.callbacks.forEach((callback) => callback(position))
        })
        this.active.value = true
        console.log('start watch')
    }

    public stopWatch() {
        if (!this.watchId) return

        navigator.geolocation.clearWatch(this.watchId)
        this.watchId = null
        this.active.value = false
        this.callbacks = []
        console.log('stop watch')
    }

    public getCurrentPosition() {
        return new Promise((resolve: PositionCallback, reject: PositionErrorCallback) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
    }
}

export default new GPS()