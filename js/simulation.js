function handleSidebar() {
    const sidebar = document.querySelector('#sidebar')
    const iconClose = document.querySelector('.icon-close')
    const iconHumburger = document.querySelector('.humburger_svg')

    sidebar.classList.toggle('close-sidebar')

    if (iconClose.classList.contains('show')) {
        iconClose.classList.remove('show')
        iconClose.classList.add('hide')

        iconHumburger.classList.remove('hide')
        iconHumburger.classList.add('show')
    } else {
        iconClose.classList.remove('hide')
        iconClose.classList.add('show')

        iconHumburger.classList.remove('show')
        iconHumburger.classList.add('hide')
    }

}