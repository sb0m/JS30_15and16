// Local Storage & Event delegation
var items = JSON.parse(localStorage.getItem('items')) || [];

function addItem(e, itemsList) {
    // default: sending data to somewhere by default
    e.preventDefault();
    const text = e.target.querySelector('[name=item]').value;
    const item = {
        name: text,
        done: false
    }

    items.push(item);
    populateList(items, itemsList);
    // local storage is a key - value - store - JSON.parse puts it back -> on page load
    localStorage.setItem('items', JSON.stringify(items));
    e.target.reset();
}

// default parameter value
// EVERY TIME YOU ARE CREATING AN ITEM IT POPULATES THE WHOLE LIST 
// -> react usw  have nice approaches to find out which item should be processed
// THEY wpould not render the whole thing again
function populateList(items = [], itemsList) {
    itemsList.innerHTML = items.map((item, i) => {
        // checked nur setzten wenn done true ist im object item
        // IMPORTANT: for und dann ID
        return `
            <li>
                <input type="checkbox" data-index=${i} id="item${i}" ${item.done ? 'checked' : ''} />
                <label for="item${i}">${item.name}</label>
            </li>`;
    }).join('');
}

window.onload = function () {
    const addItems = document.querySelector('.add-items');
    const itemsList = document.querySelector('.items-list');
    const deleteButton = document.querySelector('button[type="delete"]');
    const resetButton = document.querySelector('button[type="reset"]');
    const shadowDiv = document.querySelector('.shadowDiv');
    // don't listen on click, but on submit event whoich covers more events    
    addItems.addEventListener('submit', function (e) { addItem(e, itemsList); });
    itemsList.addEventListener('click', function (e) { toggleDone(e, itemsList); });
    deleteButton.addEventListener('click', function (e) { deleteAllItems(e, itemsList); });
    resetButton.addEventListener('click', function (e) { resetAllItems(e, itemsList); });
    shadowDiv.addEventListener('mousemove', shadow);
    // man hat local storage in browser
    populateList(items, itemsList);
}

function shadow(e) {
    const h1 = document.querySelector('h1');
    const walk = 100;
    const width = this.offsetWidth;
    const height = this.offsetHeight;

    //shpuld be where the cursor is
    let offsetX = e.layerX;
    let offsetY = e.layerY;

    const xWalk = ((offsetX / width * walk) - (walk / 2));
    const yWalk = ((offsetY / height * walk) - (walk / 2));

    h1.style.textShadow = `${xWalk}px ${yWalk}px 1px var(--color-highlight2_dark-60)`;
}

function deleteAllItems(e, itemsList) {
    if (confirm("Delete all items?") === true) {
        localStorage.clear();
        items = [];
        populateList(items, itemsList);
    }
}

function resetAllItems(e, itemsList) {
    if (confirm("Reset state of all items?") === true) {
        localStorage.clear();
        items.forEach(i => {
            i.done = false;
        });
        populateList(items, itemsList);
    }
}

function toggleDone(e, itemsList) {
    //oder: !e.target.matches('input'))
    if (e.target.type !== "checkbox") return;
    const index = e.target.dataset.index;
    items[index].done = !items[index].done;
    localStorage.setItem('items', JSON.stringify(items));
    populateList(items, itemsList);
}