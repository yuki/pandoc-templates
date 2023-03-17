sidebarMenu = document.querySelector('#navbar-toc')

links = sidebarMenu.getElementsByTagName('a')
for(let i = 0;i < links.length; i++){
    links[i].setAttribute('class','nav-link')
}