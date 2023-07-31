self.addEventListener('message', (e) => {
    if (!e.data) return
    const { type, payload } = e.data

    if (type === 'notificationCreate') {
        const { title, options } = payload
        self.registration.showNotification(title, options)
    }
})