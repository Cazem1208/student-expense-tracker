const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const categoryFilter = document.getElementById("category-filter");
const noExpensesMessage = document.getElementById("no-expenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

displayExpenses();
updateTotal();

expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("expense-name").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;
    const date = document.getElementById("expense-date").value;

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
    updateTotal();

    expenseForm.reset();
});

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function displayExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        noExpensesMessage.style.display = "block";
        return;
    }

    noExpensesMessage.style.display = "none";

    expenses.forEach(function (expense) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.name}</td>
            <td>RM ${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        `;

        expenseList.appendChild(row);
    });
}

function updateTotal() {
    let total = 0;

    expenses.forEach(function (expense) {
        total += expense.amount;
    });

    totalAmount.textContent = `RM ${total.toFixed(2)}`;
}

function deleteExpense(id) {
    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    saveExpenses();
    displayExpenses();
    updateTotal();
}

categoryFilter.addEventListener("change", function () {
    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "All") {
        displayExpenses();
        return;
    }

    const filteredExpenses = expenses.filter(function (expense) {
        return expense.category === selectedCategory;
    });

    displayFilteredExpenses(filteredExpenses);
});

function displayFilteredExpenses(filteredExpenses) {
    expenseList.innerHTML = "";

    if (filteredExpenses.length === 0) {
        noExpensesMessage.style.display = "block";
        return;
    }

    noExpensesMessage.style.display = "none";

    filteredExpenses.forEach(function (expense) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.name}</td>
            <td>RM ${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        `;

        expenseList.appendChild(row);
    });
}