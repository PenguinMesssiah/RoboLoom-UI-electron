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
        mapEmbed.data = './assets/svg/Alkebulan.svg'
    })

    mapEmbed.addEventListener("load", (e) => {
        let activeMap = e.target.contentDocument

        activeMap.addEventListener('click', (e)=> {
            let srcElement = e.srcElement
            let srcName    = srcElement.id

            console.log("source element, ", srcName)
            updateInfoCard(srcName)
        })
    })
    
    /*
    turtleIslandBtn.addEventListener('click', () => {
        mapEmbed.data = './assets/svg/TurtleIsland.svg'
    })

    abyaYalaBtn.addEventListener('click', () => {
        mapEmbed.data = './assets/svg/AbyaYala.svg'
    })
    */
}

function updateInfoCard(pSrcName) {
    let card       = document.getElementById("card")
    let cardTitle  = document.getElementById("card-title")
    let cardBody   = document.getElementById("card-text") 
    let cardLinkA  = document.getElementById("card-link-A")
    let cardLinkB  = document.getElementById("card-link-B")
    let cardLinkC  = document.getElementById("card-link-C")

    //Show Card
    card.style.display = "inline-block"
    card.classList.add("show")
    cardTitle.innerText = pSrcName

    switch (pSrcName) {
        case "Ghana":
            cardBody.innerText = "Explore the Ancestral Cloth & Cultural Clothes of Ghana!"

            cardLinkA.innerText = "Ancestral Asante Kente Cloth"
            cardLinkA.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/asante-kente-cloth/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Asante Adinkra Cloth"
            cardLinkB.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/asante-adinkra-cloth/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Ewe Kente Cloth"
            cardLinkC.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/ewe-kente-cloths-from-ghana/"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Nigeria":
            cardBody.innerText = "Explore the Ancestral Cloth & Cultural Clothes of Nigeria!"

            cardLinkA.innerText = "Ancestral Ase Oke Cloth"
            cardLinkA.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/nigerian-mens-weaving/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Adire Cloth"
            cardLinkB.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/adire-cloth-of-the-yorubas/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Yoruba, Igbo, & Nupe Cloth"
            cardLinkC.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/nigerian-womens-weaving/"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        default:
            cardTitle.innerText = "Select a Valid Country"
            cardBody.innerText = pSrcName + " is not yet added..."

            cardLinkA.innerText = "Link"
            cardLinkA.href      = ""
            cardLinkA.target    = ""

            cardLinkB.innerText = "Link"
            cardLinkB.href      = ""

            cardLinkC.innerText = "Link"
            cardLinkC.href      = ""

            cardLinkA.classList.replace("enabled", "disabled")
            cardLinkB.classList.replace("enabled", "disabled")
            cardLinkC.classList.replace("enabled", "disabled")
            break;
    }
}

function hideCard() {
    let card = document.getElementById("card")

    card.style.display = "none"
    card.classList.replace("show","hidden")

}

linkEventHandlers()