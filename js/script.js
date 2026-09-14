const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const expenseCount = document.getElementById("expense-count");
const categoryFilter = document.getElementById("category-filter");
const noExpensesMessage = document.getElementById("no-expenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// =========================
// INITIAL DISPLAY
// =========================

displayExpenses();
updateSummary();


// =========================
// ADD EXPENSE
// =========================

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("expense-name").value.trim();
    const amount = parseFloat(
        document.getElementById("expense-amount").value
    );
    const category = document.getElementById("expense-category").value;
    const date = document.getElementById("expense-date").value;


    if (!name || !amount || amount <= 0 || !category || !date) {
        alert("Please enter valid expense information.");
        return;
    }


    const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };


    expenses.push(expense);

    saveExpenses();
    displayExpenses();
    updateSummary();

    expenseForm.reset();
});


// =========================
// SAVE TO LOCAL STORAGE
// =========================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}


// =========================
// DISPLAY EXPENSES
// =========================

function displayExpenses() {

    const selectedCategory = categoryFilter.value;

    let expensesToDisplay = expenses;


    if (selectedCategory !== "All") {

        expensesToDisplay = expenses.filter(function (expense) {

            return expense.category === selectedCategory;

        });
    }


    expenseList.innerHTML = "";


    if (expensesToDisplay.length === 0) {

        noExpensesMessage.style.display = "block";

        return;
    }


    noExpensesMessage.style.display = "none";


    expensesToDisplay.forEach(function (expense) {

        const row = document.createElement("tr");


        const nameCell = document.createElement("td");
        nameCell.textContent = expense.name;


        const amountCell = document.createElement("td");
        amountCell.textContent =
            `RM ${expense.amount.toFixed(2)}`;


        const categoryCell = document.createElement("td");

        const categoryBadge = document.createElement("span");

        categoryBadge.className = "category-badge";
        categoryBadge.textContent = expense.category;

        categoryCell.appendChild(categoryBadge);


        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;


        const actionCell = document.createElement("td");

        const actionContainer = document.createElement("div");
        actionContainer.className = "action-buttons";


        const editButton = document.createElement("button");

        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editExpense(expense.id);
        });


        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteExpense(expense.id);
        });


        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);

        actionCell.appendChild(actionContainer);


        row.appendChild(nameCell);
        row.appendChild(amountCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(actionCell);


        expenseList.appendChild(row);
    });
}


// =========================
// UPDATE SUMMARY
// =========================

function updateSummary() {

    let total = 0;


    expenses.forEach(function (expense) {

        total += expense.amount;

    });


    totalAmount.textContent =
        `RM ${total.toFixed(2)}`;


    expenseCount.textContent =
        expenses.length;
}


// =========================
// DELETE EXPENSE
// =========================

function deleteExpense(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this expense?"
    );


    if (!confirmed) {
        return;
    }


    expenses = expenses.filter(function (expense) {

        return expense.id !== id;

    });


    saveExpenses();
    displayExpenses();
    updateSummary();
}


// =========================
// EDIT EXPENSE
// =========================

function editExpense(id) {

    const expense = expenses.find(function (expense) {

        return expense.id === id;

    });


    if (!expense) {
        return;
    }


    const newName = prompt(
        "Enter the expense name:",
        expense.name
    );


    if (newName === null) {
        return;
    }


    const newAmount = prompt(
        "Enter the amount (RM):",
        expense.amount
    );


    if (newAmount === null) {
        return;
    }


    const parsedAmount = parseFloat(newAmount);


    if (isNaN(parsedAmount) || parsedAmount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    const newCategory = prompt(
        "Enter the category:",
        expense.category
    );


    if (newCategory === null) {
        return;
    }


    const newDate = prompt(
        "Enter the date:",
        expense.date
    );


    if (newDate === null) {
        return;
    }


    expense.name = newName.trim();
    expense.amount = parsedAmount;
    expense.category = newCategory.trim();
    expense.date = newDate;


    saveExpenses();
    displayExpenses();
    updateSummary();
}


// =========================
// FILTER
// =========================

categoryFilter.addEventListener(
    "change",
    function () {

        displayExpenses();

    }
);