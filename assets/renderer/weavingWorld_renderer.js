function linkEventHandlers() {
    let modal      = document.getElementById("weavingWorldModal")
    let modalClose = document.getElementById("modalClose")
    let modalCloseBtn = document.getElementById("modalCloseBtn")
    let mapEmbed      = document.getElementById("mapEmbed")
    let alkebulanBtn    = document.getElementById("Alkebulan")
    let turtleIslandBtn = document.getElementById("TurtleIsland")
    let abyaYalaBtn     = document.getElementById("AbyaYala")

    //Open Modal on Start
    modal.style.display = "block"
    modal.classList.add("show")

    modalClose.addEventListener('click', () => {
        modal.style.display = "none"
        modal.classList.add("hidden")
    })

    modalCloseBtn.addEventListener('click', () => {
        modal.style.display = "none"
        modal.classList.add("hidden")
    })

    alkebulanBtn.addEventListener('click', () => {
        console.log("changed src for embed")
        mapEmbed.src = './assets/svg/Alkebulan.svg'
    })

    turtleIslandBtn.addEventListener('click', () => {
        mapEmbed.src = './assets/svg/TurtleIsland.svg'
    })

    abyaYalaBtn.addEventListener('click', () => {
        mapEmbed.src = './assets/svg/AbyaYala.svg'
    })
}

linkEventHandlers()