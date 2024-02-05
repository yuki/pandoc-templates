/*!
* Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
* Copyright 2011-2022 The Bootstrap Authors
* Licensed under the Creative Commons Attribution 3.0 Unported License.
* 
* Ruben: There are few modifications because my HTML template is different.
*/

(() => {
    'use strict'
    
    const storedTheme = localStorage.getItem('theme')
    
    const getPreferredTheme = () => {
        if (storedTheme) {
            return storedTheme
        }
    
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const setTheme = function (theme) {
        var source_theme = theme
        if (theme == 'light' || theme == 'auto'){
            source_theme = 'highlight'
        }

        if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark')
            source_theme = 'dark'
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
        //change code
        for (const element of document.querySelectorAll('[class=sourceCode]')) {
            element.firstElementChild.className = ''
            element.firstElementChild.setAttribute('class',source_theme)
        }
    }
    
    setTheme(getPreferredTheme())
    
    const showActiveTheme = theme => {
        const activeThemeIcon = document.querySelector('.theme-icon-active')
        //this line doesn't work for me, so I changed a bit
        //const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
        const btnToActive = document.querySelector('[data-bs-theme-value="'+theme+'"]')
        const svgOfActiveBtn = btnToActive.getAttribute('href')
    
        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active')
        })
    
        btnToActive.classList.add('active')
        activeThemeIcon.innerHTML=""
        activeThemeIcon.setAttribute('href', svgOfActiveBtn)
        const i = document.createElement("i")
        i.setAttribute('class','fa-solid opacity-50 theme-icon '+svgOfActiveBtn)
        activeThemeIcon.append(i)
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (storedTheme !== 'light' || storedTheme !== 'dark') {
            setTheme(getPreferredTheme())
        }
    })
    
    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme())
    
        document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
            toggle.addEventListener('click', () => {
                const theme = toggle.getAttribute('data-bs-theme-value')
                localStorage.setItem('theme', theme)
                setTheme(theme)
                showActiveTheme(theme)
            })
        })
    })
})()