function buildTable(data) {
    const tableBody = document.getElementById("tableBody");
    const fragment = document.createDocumentFragment();
    tableBody.innerHTML = "";

    const rows = data.map(person =>`<tr>
        <td>${person.thumbnailphoto == "True" ? `<img class="thumbnail" src="Photos/${person.samAccountName}.jpg" alt="${person.samAccountName}.jpg"/>` : ""}</td>
        <td>${person.officephone}</td>
        <td>${person.givenname}</td>
        <td>${person.sn}</td>
        <td>${person.title}</td>
        <td>${person.manager}</td>
        <td>${person.physicaldeliveryofficename}</td>
        <td>${person.mail}</td>
        </tr>`);
  
    fragment.innerHTML = rows.join('');

    tableBody.innerHTML += fragment.innerHTML;
}

/**
 * Sorts a html table
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column  the index of the column to sort
 * @param {*} asc Determines if the sorting will be in ascending order
 */
function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll("tr"));

    //Sort each row
    const sortedRows = rows.sort((a,b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    //Remove all existing TRs from the table
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    //Readd newly sorted rows
    tbody.append(...sortedRows);

    //Remember how the column is currently sorted
    table.querySelectorAll("th.sortable").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc", "th-active"));
    const currentTh = table.querySelector(`th:nth-child(${column + 1})`);
    currentTh.classList.toggle("th-sort-asc", asc);
    currentTh.classList.toggle("th-sort-desc", !asc);
    currentTh.classList.add("th-active"); // Add the active class
}

fetch('allUserInformation.json')
    .then(res => res.json())
    .then(data => {
        buildTable(data);

        document.querySelectorAll(".table-sortable th.sortable").forEach(headerCell => {
            headerCell.addEventListener("click", () => {
                const tableElement = headerCell.parentElement.parentElement.parentElement;
                const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
                const currentIsAscending = headerCell.classList.contains("th-sort-asc");

                sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
            });
        });

        document.addEventListener('click', (event) => {
            const isTh = event.target.matches('th');
            const isTableBody = event.target.closest('tbody');
          
            if (!isTh && isTableBody) {
              const selectTh = document.querySelectorAll('th.sortable').forEach(sortableTh => {
                sortableTh.classList.remove('th-sort-asc', 'th-sort-desc', 'th-active');
              });
            }
        });
        
        const optionMenu = document.querySelector(".select-menu"),
                selectBtn = optionMenu.querySelector(".select-btn"),
                options = optionMenu.querySelectorAll(".option"),
                sBtn_text = optionMenu.querySelector(".sBtn-text"),
                table = document.querySelector("table"),
                tableRows = table.querySelectorAll('tbody tr');

        let column = selectBtn.innerHTML,
            searchableCells = [];

        selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

        options.forEach(option => {
            option.addEventListener("click", () => {
                let selectedOption = option.querySelector(".option-text").innerHTML;
                sBtn_text.innerHTML = selectedOption;
                column = selectedOption;

                const columnIndex = Array.from(table.querySelectorAll('thead th')).map(headerCell => headerCell.innerHTML).indexOf(column);
                searchableCells = Array.from(tableRows).map(row => row.querySelectorAll("td")[columnIndex]);

                optionMenu.classList.remove("active");               
            });
        });

        const searchBar = document.getElementById("searchBar");

        searchBar.addEventListener("input", () => {
            const searchQuery = searchBar.value.toLowerCase();


            for (const tableCell of searchableCells) {
                const row = tableCell.closest("tr");
                const value = tableCell.textContent.toLowerCase().replace("-", "");
                row.style.visibility = null;

                if (value.slice(0, searchQuery.length) != searchQuery) {
                    row.style.visibility = "collapse";
                }
            }
        });
});
