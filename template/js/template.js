sidebarMenu = document.querySelector('#navbar-toc')

links = sidebarMenu.getElementsByTagName('a')
for(let i = 0;i < links.length; i++){
    links[i].setAttribute('class','nav-link')
}

(() => {
    // TABLES
    for (const element of document.getElementsByTagName('table')) {
        element.setAttribute('class','table table-striped table-hover')
    }

    for (const element of document.getElementsByTagName('thead')) {
        element.setAttribute('class','table-dark')
    }

    // CUSTOM BOXES
    for (const element of document.getElementsByClassName('infobox')) {
        element.getElementsByTagName('p')[0].setAttribute('class','d-flex align-items-center')
    }

    for (const element of document.getElementsByClassName('warnbox')) {
        element.getElementsByTagName('p')[0].setAttribute('class','d-flex align-items-center')
    }

    for (const element of document.getElementsByClassName('errorbox')) {
        element.getElementsByTagName('p')[0].setAttribute('class','d-flex align-items-center')
    }

    for (const element of document.getElementsByClassName('questionbox')) {
        element.getElementsByTagName('p')[0].setAttribute('class','d-flex align-items-center')
    }

    for (const element of document.getElementsByClassName('exercisebox')) {
        element.getElementsByTagName('p')[0].setAttribute('class','d-flex align-items-center')
    }

})()