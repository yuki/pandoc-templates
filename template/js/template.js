(() => {

    sidebarMenu = document.querySelector('#navbar-toc')

    links = sidebarMenu.getElementsByTagName('a')
    for(let i = 0;i < links.length; i++){
        links[i].setAttribute('class','nav-link')
    }

    // PARTS
    var part = 0
    for (const element of document.getElementsByClassName('part')) {
        part = part + 1
        element.setAttribute('id','part-'+part)
    }

    // TABLES
    for (const element of document.getElementsByTagName('table')) {
        element.setAttribute('class','table table-striped table-hover table-bordered ')
    }

    for (const element of document.getElementsByTagName('thead')) {
        element.setAttribute('class','table-primary')
    }

    for (const element of document.getElementsByTagName('tbody')) {
        element.setAttribute('class','table-group-divider')
    }

    // CUSTOM BOXES
    const boxes = [['infobox','Información'], ['warnbox','¡Atención!'], ['errorbox','¡Cuidado!'], ['questionbox','Pregunta'], ['exercisebox','Ejercicio']]
    for (let index = 0; index < boxes.length; index++) {
        // for every custom boxes, we add the header with its title
        for (const element of document.getElementsByClassName(boxes[index][0])) {
            const p = document.createElement("p")
            p.setAttribute('class',boxes[index][0]+'-header')
            p.innerHTML = boxes[index][1]
            element.prepend(p)
            element.getElementsByTagName('p')[1].setAttribute('class','d-flex align-items-center')
        }
    }

})()