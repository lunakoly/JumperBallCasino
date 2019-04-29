let Storage = null;

(function() {
    let currentData = 'test'


    function def(value, def) {
        if (typeof value == typeof def)
            return value
        return def
    }


    Storage = {
        save() {
            localStorage.setItem('savedata', JSON.stringify(currentData))
        },

        load() {
            currentData = JSON.parse(localStorage.getItem('savedata'))
            // bug
            if (!currentData)
                currentData = {}
            Storage.invalidateCurrentData()
        },

        invalidateCurrentData() {
            currentData = def(currentData, {})
            currentData.money = def(currentData.money, 100)
            currentData.ballsCollection = def(currentData.ballsCollection, {})
        },

        reset() {
            currentData = {}
            Storage.invalidateCurrentData()
            localStorage.clear()
            Storage.save()
            console.log('Storage reset')
        },

        money(amount) {
            if (amount != undefined) {
                currentData.money += amount
                Storage.save()
            }

            return currentData.money
        },

        spend(amount) {
            currentData.money = Math.max(currentData.money - amount,  0)
            Storage.save()
        },

        getBallsCollection() {
            return currentData.ballsCollection
        },

        getBallsAmount(ball) {
            if (currentData.ballsCollection[ball] != undefined)
                return currentData.ballsCollection[ball]
            return 0
        },

        collectBall(ball) {
            if (currentData.ballsCollection[ball] != undefined)
                currentData.ballsCollection[ball]++
            else
                currentData.ballsCollection[ball] = 1
            Storage.save()
        },

        sellBall(ball) {
            currentData.money += balls[ball].price
            currentData.ballsCollection[ball]--

            if (currentData.ballsCollection[ball] == 0)
                delete currentData.ballsCollection[ball]
            Storage.save()
        }
    }


    // INIT
    Storage.load()
})()

console.log('Storage initialized')
