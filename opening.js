// global sounds
Sounds.volume('bg-audio', 0.3)
Sounds.volume('bg-music', 0.2)

// global const
const rollPrice = 15
const rollSpeed = 5
const ballsCount = 65
const rollingCaseSize = 170 //px

// rolling overlay
const selector = document.getElementById('case-selector')
const moneyDisplay = document.getElementById('money-display')


// winning overlay
const blackBG = document.getElementById('black-bg')
const openingCase = document.getElementById('opening-case')
const openingEffect = document.getElementById('opening-effect')
const openingTitle = document.getElementById('opening-title')
const closeOpening = document.getElementById('opening-close')
const sellOpened = document.getElementById('opening-sell')

moneyDisplay.innerHTML = Storage.money() + ' руб'

function closeOpeningOverlay() {
    Sounds.stopWinMusic()
    closeOpening.style.display = ''
    sellOpened.style.display = ''
    openingTitle.style.display = ''
    openingCase.style.display = ''
    blackBG.style.display = ''
    document.body.style.overflow = ''
    Storage.collectBall(sellOpened.item)
}

closeOpening.addEventListener('click', closeOpeningOverlay)
sellOpened.addEventListener('click', (e) => {
    closeOpeningOverlay()
    Storage.sellBall(sellOpened.item)
    moneyDisplay.innerHTML = Storage.money() + ' руб'
})


//////////// SOUNDS ////////////
play.addEventListener('mousedown', Sounds.press)
back.addEventListener('mousedown', Sounds.press)
closeOpening.addEventListener('mousedown', Sounds.press)
sellOpened.addEventListener('mousedown', Sounds.press)


//////////// BLINKING SERVICE ////////////
let blinking = null
let on = false

setInterval(() => {
    if (!blinking) return

    if (!on)
        blinking.style['background-color'] = 'rgb(208, 203, 85)'
    else
        blinking.style['background-color'] = ''

    on = !on
}, 50)


//////////// AWARDS ////////////
const casesVals = Object.values(cases)

for (let it = casesVals.length - 1; it >= 0; it--) {
    for (let that = 0; that < casesVals[it].contents.length; that++) {
        const cell = document.createElement('div')
        cell.className = 'inventory-cell'
        cell.style['background-image'] = 'url(img/balls/' + balls[ casesVals[it].contents[that] ].src + ')'
        cell.style['background-size'] = '90%'
        inventory.appendChild(cell)

        const img = document.createElement('div')
        img.style['background-image'] = 'url(img/cases/' + casesVals[it].open + ')'
        img.className = 'inventory-glass'
        cell.appendChild(img)
    }
}



//////////// ROLL PRESSED ////////////
play.addEventListener('click', (e) => {
    if (Storage.money() < rollPrice) {
        alert('You don\'t have enough money(')
        return
    }

    play.disabled = true
    roll()
})


function roll() {
    Storage.spend(rollPrice)
    moneyDisplay.innerHTML = Storage.money() + ' руб'

    // easier to use
    const casesNames = Object.keys(cases)
    const casesElems = []

    // remove all but selector
    while (way.firstChild)
        way.removeChild(way.firstChild)
    way.appendChild(selector)

    // start offset (makes rolling end look unique)
    const d = Math.random() * rollingCaseSize

    // create $ballsCount case entries
    for (let it = 0; it < ballsCount; it++) {
        const caseElem = document.createElement('div')
        caseElem.className = 'rolling-case'

        let skin = null

        // check chance of skin selection according
        // to rarity
        for (let that in casesNames) {
            // 1..rarity
            const chance = Math.floor(Math.random() * cases[ casesNames[that] ].rarity) + 1

            if (chance ==  cases[ casesNames[that] ].rarity) {
                skin = casesNames[that]
                break
            }
        }

        // to resolve case skin from elem
        caseElem.title = skin
        // set skin
        caseElem.style['background-image'] =
            'url(img/cases/' + cases[skin].src  + ')'
        // start position
        caseElem.style.left = (d + way.offsetWidth + rollingCaseSize * it) + 'px'
        way.appendChild(caseElem)
        casesElems.push(caseElem)
    }

    // start service for moving them
    let oldTime = new Date().getTime()
    let speed = rollSpeed
    let total = -d

    const inter = setInterval(() => {
        let newTime = new Date().getTime()

        const dl = speed * (newTime - oldTime)
        total += dl

        if (total >= rollingCaseSize) {
            new Audio("sounds/tic.ogg").play()
            total = 0
        }

        for (let it in casesElems)
            casesElems[it].style.left = casesElems[it].offsetLeft - dl

        oldTime = newTime
        speed *= 0.99 // for smooth stop

        if (speed <= 0.01) speed = 0

        if (speed <= 0) {
            summary(casesElems)
            clearInterval(inter)
        }
    }, 20)
}


function summary(elems) {
    const target = selector.offsetLeft - selector.offsetWidth / 2
    let minElem = elems[0]
    let min = Math.abs(minElem.offsetLeft - target)

    // find nearest to selector
    for (let it in elems) {
        let dl = Math.abs(elems[it].offsetLeft - target)

        if (dl < min) {
            min = dl
            minElem = elems[it]
        }
    }

    // share with blinking service
    blinking = minElem
    openCase(minElem)
    play.disabled = false
}


function openCase(c) {
    blackBG.style.display = 'block'

    // otherwise you can simply scroll down
    // the black-bg
    document.body.style.overflow = 'hidden'
    document.body.scrollTop = 0

    openingCase.style['background-image'] = c.style['background-image']
    openingCase.style['z-index'] = '3'
    openingCase.style.display = 'block'

    // growing animation
    openingCase.style.width = rollingCaseSize + 'px'
    openingCase.style.height = rollingCaseSize + 'px'

    // delay
    setTimeout(() => {
        openingEffect.src = 'img/blow.gif'
        openingEffect.style.display = 'block'
        Sounds.startWinMusic()

        // hide effect after delay
        setTimeout(() => {
            openingEffect.style.display = ''
        }, 300)

        // selecting the ball
        const cont = cases[c.title].contents
        const index = Math.floor(Math.random() * cont.length)

        openingCase.style['background-image'] = 'url(img/balls/' + balls[cont[index]].src + ')'

        openingTitle.innerHTML = 'You got ' + cont[index] + '!'
        openingTitle.style.display = 'block'

        closeOpening.style.display = 'block'

        sellOpened.value = 'Sell for ' + balls[cont[index]].price + ' руб'
        sellOpened.price = balls[cont[index]].price
        sellOpened.style.display = 'block'
        sellOpened.item = cont[index]
    }, 600)
}
