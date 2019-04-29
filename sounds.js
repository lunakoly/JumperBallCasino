let Sounds = null;

(function() {
    const tic = new Audio("sounds/tic.ogg")
    const press = new Audio("sounds/press.ogg")
    const winMusic = new Audio("sounds/win.mp3")

    Sounds = {
        volume(target, value) {
            document.getElementById(target).volume = value
        },

        tic() {
            try {
                tic.play()
            } catch(e) {}
        },

        press() {
            try {
                press.play()
            } catch(e) {}
        },

        startWinMusic() {
            try {
                winMusic.play()
            } catch(e) {}
        },

        stopWinMusic() {
            winMusic.pause()
            winMusic.urrentTime = 0
        }
    }
})()

console.log('Sounds initialized')
