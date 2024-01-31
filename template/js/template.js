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
  

(() => {

    sidebarMenu = document.querySelector('#navbar-toc')

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

    // ANCHOR LINKS in HEADINGS
    for (const element of document.getElementsByTagName('section')) {
        const link = document.createElement("a")
        const header = element.querySelector('.header-section-number')
        link.href = "#"+element.id
        link.setAttribute('class','anchor-link')
        icon = document.createElement("i")
        icon.setAttribute('class', 'fa-solid fa-link')
        link.appendChild(icon)
        header.prepend(link)
        header.parentElement.onmouseover = function(){link.style.visibility="visible"}
        header.parentElement.onmouseout = function(){link.style.visibility="hidden"}
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

        // insert part into TOC
        console.log (part_id + " " + part_title + " " + roman_num)
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
            a = document.getElementById('toc-' + header_id)
            a.parentNode.parentNode.insertBefore(part_li,a.parentNode)
        } else if (grandfather.tagName == "SECTION"){
            // others parts, that can be inside HeaderX
            el = grandfather
            while(!el.classList.contains('level1')){
                el = el.parentNode
            }
            el = el.nextElementSibling
            header_id = el.id
            a = document.getElementById('toc-' + header_id)
            a.parentNode.parentNode.insertBefore(part_li,a.parentNode)
        }
    }

    // TABLES
    for (const element of document.getElementsByTagName('table')) {
        element.setAttribute('class','table table-striped table-hover table-bordered ')
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


})()
