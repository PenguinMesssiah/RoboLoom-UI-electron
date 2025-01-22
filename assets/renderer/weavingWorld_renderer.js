function linkEventHandlers() {
    let modal           = document.getElementById("weavingWorldModal")
    let modalClose      = document.getElementById("modalClose")
    let modalCloseBtn   = document.getElementById("modalCloseBtn")
    let mapEmbed        = document.getElementById("mapEmbed")
    let alkebulanBtn    = document.getElementById("Alkebulan")
    let northAmericaBtn = document.getElementById("NorthAmerica")
    let latinAmericaBtn = document.getElementById("LatinAmerica")
    let chinaBtn        = document.getElementById("China")
    let europeBtn       = document.getElementById("Europe")
    let indiaBtn        = document.getElementById("India")

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

    mapEmbed.addEventListener("load", (e) => {
        let activeMap = e.target.contentDocument

        activeMap.addEventListener('click', (e)=> {
            let srcElement = e.srcElement
            let srcName    = srcElement.id

            console.log("source element, ", srcName)
            updateInfoCard(srcName)
        })
    })

    alkebulanBtn.addEventListener('click', () => {
        updateMap(0);
    })
    
    northAmericaBtn.addEventListener('click', () => {
        updateMap(1);
    })

    latinAmericaBtn.addEventListener('click', () => {
        updateMap(2);
    })

    chinaBtn.addEventListener('click', () => {
        updateMap(3);
    })

    europeBtn.addEventListener('click', () => {
        updateMap(4)
    })

    indiaBtn.addEventListener('click', () => {
        updateMap(5);
    })
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
        case "Hunan" :
            cardBody.innerText = "Explore the Cultural Clothes of Hunan!"

            cardLinkA.innerText = "Dong Brocade"
            cardLinkA.href      = "https://whhlyt.hunan.gov.cn/whhlyt/english/Culture/IntangibleCulturalHeritage/202205/t20220526_24654027.html#:~:text=The%20Dong%20brocade%20weaving%2C%20mainly%20found%20among,Hunan%20Province%2C%20can%20date%20back%20to%20more"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Tujia Brocade"
            cardLinkB.href      = "https://www.metalocus.es/en/news/flower-tujia-china-tujia-brocade-art-museum-yimu-design-office"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Zhejiang":
            cardBody.innerText = "Explore the Cultural Clothes of Zhejiang!"

            cardLinkA.innerText = "Bamboo Weaving | Legacy"
            cardLinkA.href      = "https://www.globaltimes.cn/page/202306/1293215.shtml"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Bamboo Weaving | Guide"
            cardLinkB.href      = "https://articles.unesco.org/sites/default/files/medias/fichiers/2024/04/1.2b%20final%20bamboo%20leaflet%20EN.pdf#page=10"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break; 
        case "Chongqing":
                cardBody.innerText = "Explore the Cultural Clothes of Chongqing!"
    
                cardLinkA.innerText = "Xiabu Cloth | Legacy"
                cardLinkA.href      = "https://www.sciencehistory.org/collections/blog/weaving-history/"
                cardLinkA.target    = "__top"
    
                cardLinkB.innerText = "Xiabu Cloth | Modern"
                cardLinkB.href      = "https://www.chinadaily.com.cn/a/202206/14/WS62a7bf6da310fd2b29e62725.html"
                cardLinkB.target    = "__top"
    
                cardLinkC.innerText = ""
                cardLinkC.href      = ""
                cardLinkC.target    = "__top"
    
                cardLinkA.classList.replace("disabled", "enabled")
                cardLinkB.classList.replace("disabled", "enabled")
                //cardLinkC.classList.replace("disabled", "enabled")
                break;     
        case "Guangdong":
                cardBody.innerText = "Explore the Cultural Clothes of Guangdong!"
    
                cardLinkA.innerText = "Band Weaving"
                cardLinkA.href      = "https://www.thetextileatlas.com/craft-stories/band-weaving-hong-kong"
                cardLinkA.target    = "__top"
    
                cardLinkB.innerText = "Guancao-Weave"
                cardLinkB.href      = "https://www.womenofchina.cn/womenofchina/html1/culture/heritage/2409/1898-1.htm"
                cardLinkB.target    = "__top"
    
                cardLinkC.innerText = ""
                cardLinkC.href      = ""
                cardLinkC.target    = "__top"
    
                cardLinkA.classList.replace("disabled", "enabled")
                cardLinkB.classList.replace("disabled", "enabled")
                //cardLinkC.classList.replace("disabled", "enabled")
                break;  
        case "Shandong":
            cardBody.innerText = "Explore the Cultural Clothes of Guangdong!"

            cardLinkA.innerText = "Shantung Weave"
            cardLinkA.href      = "https://sewport.com/fabrics-directory/shantung-fabric"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Willow Weave"
            cardLinkB.href      = "https://www.xindb.com/static/content/SDZB/2023-12-18/1186454921173024768.html"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Uttar Pradesh":
            cardBody.innerText = "Explore the Cultural Clothes of Uttar Pradesh!"

            cardLinkA.innerText = "Varanasi Brocade"
            cardLinkA.href      = "https://pdfs.semanticscholar.org/321f/4be3606249970e74dbb4161c9547ac55e8c1.pdf"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Banarasi Silk"
            cardLinkB.href      = "https://festival-marketplace.si.edu/madhu-agrawal-r15-a8155/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
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

function updateRegionTitle(pRegionName) {
    let regionTitle = document.getElementById("selected-region")
    regionTitle.innerText = "Selected Region | " + pRegionName;
}

function updateMap(pSelectedRegion) {
    switch(pSelectedRegion) {
        case 0:
            mapEmbed.data = './assets/svg/Alkebulan.svg'
            updateRegionTitle("Africa (Alkebulan)")
            break;
        case 1:
            mapEmbed.data = './assets/svg/northAmerica.svg'
            updateRegionTitle("North America (Turtle Island)")
            break;
        case 2:
            mapEmbed.data = './assets/svg/latinAmerica.svg'
            updateRegionTitle("Latin America (Abya Yala)")
            break;
        case 3:
            mapEmbed.data = './assets/svg/China.svg'
            updateRegionTitle("China (Zhōngguó)")
            break;
        case 4:
            mapEmbed.data = './assets/svg/europe.svg'
            updateRegionTitle("Europe (Europa)")
            break;
        case 5:
            mapEmbed.data = './assets/svg/india.svg'
            updateRegionTitle("India (Bharata)")
            break;
        default:
            break;
    }
}


linkEventHandlers()