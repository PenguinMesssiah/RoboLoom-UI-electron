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

            cardLinkA.innerText = "Asante Kente Cloth | History & Examples"
            cardLinkA.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/asante-kente-cloth/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Asante Adinkra Cloth | History & Examples"
            cardLinkB.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/asante-adinkra-cloth/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Ewe Kente Cloth | History & Examples"
            cardLinkC.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/ewe-kente-cloths-from-ghana/"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Nigeria":
            cardBody.innerText = "Explore the Ancestral Cloth & Cultural Clothes of Nigeria!"

            cardLinkA.innerText = "Ase Oke Cloth | History & Examples"
            cardLinkA.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/nigerian-mens-weaving/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Adire Cloth | History & Examples"
            cardLinkB.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/adire-cloth-of-the-yorubas/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Yoruba, Igbo, & Nupe Cloth | History & Examples"
            cardLinkC.href      = "https://www.adireafricantextiles.com/textiles-resources-sub-saharan-africa/some-major-west-african-textile-traditions/nigerian-womens-weaving/"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Democratic Republic of Congo":
            cardBody.innerText = "Explore the Ancestral Cloth & Cultural Clothes of the Democratic Republic of Congo!"

            cardLinkA.innerText = "Kuba Cloth | History & Examples (Mature Content Warning)"
            cardLinkA.href      = "https://scholar.harvard.edu/files/tervala/files/tervala_polk_and_gould_2018_kuba_-_fabric_of_an_empire.pdf"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Kuba Textiles | History & Example"
            cardLinkB.href      = "https://www.theethnichome.com/the-kuba-textiles-from-the-drc-4/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Ethiopia":
            cardBody.innerText = "Explore the Ancestral Cloth & Cultural Clothes of Ethiopia!"

            cardLinkA.innerText = "Overview | History & Examples"
            cardLinkA.href      = "https://www.tandfonline.com/doi/full/10.1080/14759756.2021.1922971"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Dorze Weavers | History & Examples"
            cardLinkB.href      = "https://www.tandfonline.com/doi/epdf/10.2752/175303714x14023922798101?needAccess=true"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Egypt":
            cardBody.innerText = "Explore the Ancestral Cloth & Cultural Clothes of Egypt!"

            cardLinkB.innerText = "Sa'eed | History & Practice"
            cardLinkB.href      = "https://ich.unesco.org/en/USL/handmade-weaving-in-upper-egypt-sa-eed-01605"
            cardLinkB.target    = "__top"

            cardLinkA.innerText = "Overview | Examples"
            cardLinkA.href      = "https://csa-living.org/oasis-blog/egypts-woven-heritage-stories-of-culture-and-identity-told-through-traditional-textile"
            cardLinkA.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Hunan" :
            cardBody.innerText = "Explore the Cultural Clothes of Hunan!"

            cardLinkA.innerText = "Cultural Overview | Dong Brocade"
            cardLinkA.href      = "https://whhlyt.hunan.gov.cn/whhlyt/english/Culture/IntangibleCulturalHeritage/202205/t20220526_24654027.html#:~:text=The%20Dong%20brocade%20weaving%2C%20mainly%20found%20among,Hunan%20Province%2C%20can%20date%20back%20to%20more"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Review | Tujia Brocade"
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

            cardLinkA.innerText = "Modern Overview | Bamboo Weaving"
            cardLinkA.href      = "https://www.globaltimes.cn/page/202306/1293215.shtml"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Guide | Bamboo Weaving"
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
    
                cardLinkA.innerText = "Historical Review | Xiabu Cloth"
                cardLinkA.href      = "https://www.sciencehistory.org/collections/blog/weaving-history/"
                cardLinkA.target    = "__top"
    
                cardLinkB.innerText = "Modern Review | Xiabu Cloth"
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
    
                cardLinkA.innerText = "Cultural Overview | Band Weaving"
                cardLinkA.href      = "https://www.thetextileatlas.com/craft-stories/band-weaving-hong-kong"
                cardLinkA.target    = "__top"
    
                cardLinkB.innerText = "Modern Review | Guancao-Weave"
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

            cardLinkA.innerText = "Modern Overview | Shantung Weave"
            cardLinkA.href      = "https://sewport.com/fabrics-directory/shantung-fabric"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Review | Willow Weave"
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

            cardLinkA.innerText = " History & Modern Review | Varanasi Brocade"
            cardLinkA.href      = "https://pdfs.semanticscholar.org/321f/4be3606249970e74dbb4161c9547ac55e8c1.pdf"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Overview & Marketplace | Banarasi Silk"
            cardLinkB.href      = "https://festival-marketplace.si.edu/madhu-agrawal-r15-a8155/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;    
        case "Gujarat":
            cardBody.innerText = "Explore the Cultural Clothes of Gujarat!"

            cardLinkA.innerText = "Cultural Overview | Bandhani"
            cardLinkA.href      = "https://exhibitions-khamir.org/bandhani/history"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Overview | Bandhani"
            cardLinkB.href      = "https://craftatlas.co/crafts/bandhani"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Historical Overview | Patola"
            cardLinkC.href      = "https://www.peepultree.world/livehistoryindia/story/living-culture/ikat-connecting-india-and-indonesia"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Madhya Pradesh":
            cardBody.innerText = "Explore the Cultural Clothes of Madhya Pradesh!"

            cardLinkA.innerText = "Historical Overview | Chanderi"
            cardLinkA.href      = "https://aims.vmis.in/exhibition/exhibition/5761/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Review | Chanderi - Examples"
            cardLinkB.href      = "https://gaatha.org/Craft-of-India/detail-study-chanderi-craft/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Jammu and Kashmir": 
            cardBody.innerText = "Explore the Cultural Clothes of Jammu and Kashmir!"

            cardLinkA.innerText = "Historical Overview | Kashmir Shawl"
            cardLinkA.href      = "https://thezay.org/from-buta-to-paisley-tracing-the-journey-of-kashmir-shawls-part-1"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Review | Kashmir Shawl"
            cardLinkB.href      = "https://www.atlasobscura.com/articles/kashmiri-weaving"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Tamil Nadu":
            cardBody.innerText = "Explore the Cultural Clothes of Tamil Nadu!"

            cardLinkA.innerText = "Historical Overview | Kanjivaram"
            cardLinkA.href      = "https://singhanias.in/blogs/singhanias-saree-journal/all-you-need-to-know-about-kanjivaram-silk-saree"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Review | Kanjivaram"
            cardLinkB.href      = "https://binalpatel.in/blogs/articles/saree-tradition-kanjivaram"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "California":
            cardBody.innerText = "Explore the Cultural Clothes from the Indigenous People of California!"

            cardLinkA.innerText = "Cahuilla Basketry | History & Examples"
            cardLinkA.href      = "https://www.aguacaliente.org/documents/OurStory-8.pdf"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Pomo Basketry | Color Examples"
            cardLinkB.href      = "https://www.famsf.org/stories/carrying-baskets-the-seeds-of-pomo-life-in-california"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Wiyot Basketry | History & Examples"
            cardLinkC.href      = "https://www.clarkemuseum.org/wiyot-people-places-and-practices.html"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Texas":
            cardBody.innerText = "Explore the Cultural Clothes from the Indigenous People of Texas!"

            cardLinkA.innerText = "Alabama-Coushatta Tribe of Texas | Pine Basketry"
            cardLinkA.href      = "https://texashighways.com/culture/livingston-craftsman-turns-native-longleaf-pine-into-handmade-baskets/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = ""
            cardLinkB.href      = ""
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            //cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Florida":
            cardBody.innerText = "Explore the Cultural Clothes from the Indigenous People of Florida!"

            cardLinkA.innerText = "Seminole and Miccosukee Baskerty| History & Examples"
            cardLinkA.href      = "https://www.floridamuseum.ufl.edu/sflarch/ethnographic-collections/seminole-baskets/overview/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Full Overview | Native American Hertiage Trail (Weaving pg. 24)"
            cardLinkB.href      = "https://files.floridados.gov/media/32346/nativeamericanheritagetrail.pdf"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Italy":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Italy"

            cardLinkA.innerText = "Historical Overview | Jardinière Velvets"
            cardLinkA.href      = "https://www.metmuseum.org/essays/renaissance-velvet-textiles"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Historical Fashion Overview | Tunics & Gamurras"
            cardLinkB.href      = "https://fashionhistory.fitnyc.edu/beauty-adorns-virtue-italian-renaissance-fashion/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Belgium":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Belgium"

            cardLinkA.innerText = "Historical Overview | Brussel Tapestries"
            cardLinkA.href      = "https://www.metmuseum.org/essays/european-tapestry-production-and-patronage-1400-1600"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Review | Brussel Tapestries"
            cardLinkB.href      = "https://www.brusselstimes.com/647142/the-stitches-in-time-that-still-weave-spells"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "United Kingdom":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of the United Kingdom"

            cardLinkA.innerText = "Historical Literature | Norwich Pattern Book"
            cardLinkA.href      = "https://digitalcollections.winterthur.org/Documents/Detail/norwich-worsted-pattern-book/50105?item=50121"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Historial Overview | Tartan Cloth"
            cardLinkB.href      = "https://tartandesigner.com/designer/historyandproduction"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Design Software | Tartan Designer"
            cardLinkC.href      = "https://tartandesigner.com/"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Poland":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Poland"

            cardLinkA.innerText = "Cultural Overview | Polish Textiles"
            cardLinkA.href      = "https://culture.pl/en/article/the-history-of-polish-artistic-textiles"
            cardLinkA.target    = "__top"
            
            cardLinkB.innerText = "Modern Overview | Pasiaki, Kraciaki and Multi-patterned"
            cardLinkB.href      = "https://folklorethursday.com/folk-music/polish-folklore-textiles/"
            cardLinkB.target    = "__top"
            
            cardLinkC.innerText = "Modern Review | Bobowa Lace"
            cardLinkC.href      = "https://visitmalopolska.pl/en_GB/-/koronka-z-bobowej-piekny-przyklad-malopolskiego-folkloru"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Estonia":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Estonia!"

            cardLinkA.innerText = "Cultural History | Overview"
            cardLinkA.href      = "https://www.artun.ee/en/curricula/textile-design/history/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Estonian Virunuka | Weaving Draft Sample"
            cardLinkB.href      = "http://ladyelewys.carpevinumpdx.com/2020/12/03/estonian-virunuka/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Bolivia":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Bolivia!"

            cardLinkA.innerText = "Modern Review | Andean Textiles in Bolivia"
            cardLinkA.href      = "https://threads-of-time.carlos.emory.edu/exhibits/show/essays/rainbow"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Historical Overview | Coroma Textiles"
            cardLinkB.href      = "https://traffickingculture.org/encyclopedia/case-studies/coroma-textiles/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Peru":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Peru!"

            cardLinkA.innerText = "Cultural History | Quechua Textiles"
            cardLinkA.href      = "https://guides.loc.gov/weaving-community-narratives-andean-histories-library-collections/textiles#s-lib-ctab-29124066-0"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Modern Review | Peruvian Andes"
            cardLinkB.href      = "https://folklife.si.edu/magazine/quechua-women-weavers-peru"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = "Cultural Overview | Quechua Symbolism"
            cardLinkC.href      = "https://www.mosqoy.org/textile-symbols"
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Chile":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Chile!"

            cardLinkA.innerText = "Modern Review | Aymara Weaving Tradition"
            cardLinkA.href      = "https://cordillerana.cl/en/blogs/hechoamano/las-tejedoras-aymara-herederas-de-una-tradicion-milenaria"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Cultural Review | Inspiration Behind Aymara Weaving"
            cardLinkB.href      = "https://apnews.com/article/chile-aymara-sacred-textile-craft-e538a3a65e236cf04ce0ee30856f6bdf"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Guatemala":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Guatemala!"

            cardLinkA.innerText = "Modern & Cultural Overview | Mayan Huipil"
            cardLinkA.href      = "https://www.phalarope.org/magazine/2021/1/30/the-huipil-an-everlasting-indigenous-cultural-emblem"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Historical Review | Mayan Huipil"
            cardLinkB.href      = "https://fashionhistory.fitnyc.edu/huipilli-huipil/"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Mexico":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Mexico!"

            cardLinkA.innerText = "Modern Review | Oaxaca Textiles"
            cardLinkA.href      = "https://oaxacaculture.com/2023/02/on-the-oaxaca-coast-its-about-the-cloth-not-the-cut/"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Historical & Cultural Analysis | Oaxaca Textiles (Book)"
            cardLinkB.href      = "https://www.getty.edu/publications/resources/virtuallibrary/0892363819.pdf"
            cardLinkB.target    = "__top"

            cardLinkC.innerText = ""
            cardLinkC.href      = ""
            cardLinkC.target    = "__top"

            cardLinkA.classList.replace("disabled", "enabled")
            cardLinkB.classList.replace("disabled", "enabled")
            //cardLinkC.classList.replace("disabled", "enabled")
            break;
        case "Ecuador":
            cardBody.innerText = "Explore the Historical & Cultural Clothes of Ecuador!"

            cardLinkA.innerText = "Historical Review | Ican Textiles"
            cardLinkA.href      = "https://www.mayaincaaztec.com/maya-inca-aztec-galleries/inca-textile-museum"
            cardLinkA.target    = "__top"

            cardLinkB.innerText = "Cultural Overview | Toquilla Straw Hat"
            cardLinkB.href      = "https://ich.unesco.org/en/RL/traditional-weaving-of-the-ecuadorian-toquilla-straw-hat-00729#"
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