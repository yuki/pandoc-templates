// copied from https://www.codehim.com/text-input/roman-numeral-converter-using-javascript/
function convertToRoman(num) {
    let decimalValue = [10, 9, 5, 4, 1];
    let romanNumeral = ["X","IX","V","IV","I"];

    let romanized = "";

    for (let index = 0; index < decimalValue.length; index++) {
        while (decimalValue[index] <= num) {
        romanized += romanNumeral[index];
        num -= decimalValue[index];
        }
    }

    if (typeof num === "number") {
        return (romanized);
    }
}

function addAnchorLink(element,href) {
    const link = document.createElement("a")
    link.href = "#"+href
    link.setAttribute('class','anchor-link')
    icon = document.createElement("i")
    icon.setAttribute('class', 'fa-solid fa-link')
    link.appendChild(icon)
    element.prepend(link)
    element.onmouseover = function(){link.style.visibility="visible"}
    element.onmouseout = function(){link.style.visibility="hidden"}
}


(() => {
    // add PDF link
    document.getElementById('pdf-link').href = window.location.pathname.replace('/my-books/','').replace('.html','.pdf')

    // change TOC to improve navigation
    sidebarMenu = document.querySelector('#toc')

    // sidebars links 
    if (sidebarMenu) {
        links = sidebarMenu.getElementsByTagName('a')
        for(let i = 0;i < links.length; i++){
            links[i].setAttribute('class','nav-link')
        }

        links = sidebarMenu.getElementsByTagName('ul')
        for(let i = 0;i < links.length; i++){
            links[i].setAttribute('class','nav')
        }
    }

    // PARTS
    var count = 0
    for (const element of document.getElementsByClassName('part')) {
        count = count + 1
        part_id = 'part-'+count
        part_title = element.innerText
        element.setAttribute('id',part_id)
        // add roman number
        const num = document.createElement("span")
        roman_num = convertToRoman(count)
        num.innerHTML=roman_num
        num.setAttribute('class','roman-number')
        element.parentElement.prepend(num)
        addAnchorLink(element.parentElement,element.id)

        // insert part into TOC
        grandfather = element.parentElement.parentElement
        const part_li = document.createElement("LI")
        part_li.id = "toc-" + part_id
        part_li.setAttribute('class','toc_part')
        const link = document.createElement("a")
        link.href = "#" + part_id
        link.innerHTML = roman_num + '.  ' + part_title
        part_li.appendChild(link)

        if (grandfather.tagName == "DIV"){
            // first part
            header_id = element.parentElement.nextElementSibling.id
        } else if (grandfather.tagName == "SECTION"){
            // others parts, that can be inside HeaderX
            el = grandfather
            while(!el.classList.contains('level1')){
                el = el.parentNode
            }
            el = el.nextElementSibling
            header_id = el.id
        }
        a = document.getElementById('toc-' + header_id)
        a.parentNode.parentNode.insertBefore(part_li,a.parentNode)
    }

    // HEADERS NUMBERS RESET
    count = 0
    new_num = 0
    // we use the navbar UL's LIs, it's easier than the sections
    for (element of document.getElementById('toc').querySelectorAll("ul > li")) {
        if (element.classList.contains('toc_part')){
            // the LI is a PART; we reset the count
            count = 0
        } else {
            link = element.firstElementChild.id.replace(/^toc-/g, "")
            section = document.getElementById(link)
            if (section.classList.contains('level1')){
                count = count + 1
                new_num = count
            } else {
                if (section.getAttribute("data-number")){
                    num = section.getAttribute("data-number")
                    new_num = num.replace(/^[0-9]+\./,count + ".")
                }
            }
            // we update the LI and the headers in the "sections"
            if (element.firstElementChild.firstElementChild){
                element.firstElementChild.firstElementChild.innerText = new_num
                section.setAttribute("data-number",new_num)
                section.firstElementChild.setAttribute("data-number",new_num)
                section.firstElementChild.firstElementChild.innerHTML=new_num
            }
            }
    }

    // ANCHOR LINKS in HEADINGS
    for (const element of document.getElementsByTagName('section')) {
        if (element.querySelector('.header-section-number')){
            const header = element.querySelector('.header-section-number')
            addAnchorLink(header.parentElement,element.id)
        }
        
    }

    // TABLES
    for (const element of document.getElementsByTagName('table')) {
        element.setAttribute('class','table table-striped table-responsive table-hover table-bordered border-secondary-subtle')
    }

    for (const element of document.getElementsByTagName('tbody')) {
        element.setAttribute('class','table-group-divider')
    }

    // IMAGES
    for (const element of document.getElementsByClassName('float-left')) {
        var width = element.style.width;
        if (element.parentElement.tagName == "FIGURE"){
            element.parentElement.style.width=width;
            element.style.width="100%";
        }
    }
    for (const element of document.getElementsByClassName('float-right')) {
        var width = element.style.width;
        if (element.parentElement.tagName == "FIGURE"){
            element.parentElement.style.width=width;
            element.style.width="100%";
        }
    }

    const modal = new bootstrap.Modal(document.getElementById('imgModal'))
    for (const img of document.getElementsByTagName('img')) {
        img.onclick = function(){
            // alert(this.alt)
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("modalCaption");
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            modal.show()
        }
    }

})()
