// global sounds
Sounds.volume('bg-audio', 0.3)
Sounds.volume('bg-music', 0.2)

// ui
const moneyDisplay = document.getElementById('money-display')
const header = document.getElementById("inventory-header")
const reset = document.getElementById("reset-inventory")
const play = document.getElementById("play")

// controls
play.addEventListener('mousedown', Sounds.press)
moneyDisplay.innerText = Storage.money() + ' руб'

reset.addEventListener('mousedown', () => {
    Storage.reset()
    moneyDisplay.innerText = Storage.money() + ' руб'
    loadBallsCollection()
})


function loadBallsCollection() {
    const collection = Storage.getBallsCollection()
    const ballsNames = Object.keys(collection)

    while (inventory.firstChild)
        inventory.removeChild(inventory.firstChild)
    inventory.appendChild(header)

    if (ballsNames.length == 0) inventory.style.display = 'none'

    for (let it in ballsNames) {
        const cell = document.createElement('div')
        cell.className = 'inventory-cell'
        cell.style['background-image'] = 'url(img/balls/' + balls[ ballsNames[it] ].src + ')'
        cell.style['background-size'] = '90%'
        inventory.appendChild(cell)

        const amount = document.createElement('div')
        amount.className = 'inventory-item-amount'
        amount.innerText = collection[ ballsNames[it] ]
        cell.appendChild(amount)

        const sell = document.createElement('input')
        sell.type = 'button'
        sell.value = 'SELL (' + balls[ ballsNames[it] ].price + 'руб)'

        sell.className = 'inventory-sell-item-button'
        sell.innerText = collection[ ballsNames[it] ]
        cell.appendChild(sell)

        sell.addEventListener('click', () => {
            Storage.sellBall(ballsNames[it])
            const count = Storage.getBallsAmount(ballsNames[it])
            moneyDisplay.innerText = Storage.money() + ' руб'

            if (count == 0) {
                inventory.removeChild(cell);
                loadBallsCollection()
            } else {
                amount.innerText = count
            }
        })
    }
}

loadBallsCollection()
