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

function handleTopicDropdown(dropdown_arrow_selector, topic_list_selector) {
    // Use the passed selectors to query the elements
    const dropdown_arrow = document.querySelector(dropdown_arrow_selector);
    const topic_list = document.querySelector(topic_list_selector);
    
    // Select all dropdown arrows and topic lists
    const all_dropdown_arrows = document.querySelectorAll(".dropdown-arrow");
    const all_topic_lists = document.querySelectorAll(".topic-list");

    if (!dropdown_arrow || !topic_list) {
        console.error('Dropdown arrow or topic list element not found!');
        return;
    }

    // Toggle the arrow's open class
    if (!dropdown_arrow.classList.contains('dropdown-arrow-open')) {
        // Close all other dropdowns
        all_dropdown_arrows.forEach(arrow => arrow.classList.remove("dropdown-arrow-open"));
        all_topic_lists.forEach(list => (list.style.display = "none"));


        dropdown_arrow.classList.add('dropdown-arrow-open');
        topic_list.style.display = 'block'; // Show the topic list
    } else {
        dropdown_arrow.classList.remove('dropdown-arrow-open');
        topic_list.style.display = 'none'; // Hide the topic list
    }


}