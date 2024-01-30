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
    }

    // PARTS
    var count = 0
    for (const element of document.getElementsByClassName('part')) {
        count = count + 1
        element.setAttribute('id','part-'+count)
        const num = document.createElement("span")
        num.innerHTML=convertToRoman(count)
        num.setAttribute('class','roman-number')
        element.parentElement.prepend(num)
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
