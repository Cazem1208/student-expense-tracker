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

        row.innerHTML = `
            <td>${expense.name}</td>
            <td>RM ${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
<td>
    <button onclick="editExpense(${expense.id})">
        Edit
    </button>

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
    displayExpenses();
});

function editExpense(id) {
    const expense = expenses.find(function (expense) {
        return expense.id === id;
    });

    if (!expense) {
        return;
    }

    const newName = prompt("Enter the expense name:", expense.name);

    if (newName === null) {
        return;
    }

    const newAmount = prompt("Enter the amount (RM):", expense.amount);

    if (newAmount === null) {
        return;
    }

    const newCategory = prompt(
        "Enter the category:",
        expense.category
    );

    if (newCategory === null) {
        return;
    }

    const newDate = prompt("Enter the date:", expense.date);

    if (newDate === null) {
        return;
    }

    expense.name = newName;
    expense.amount = parseFloat(newAmount);
    expense.category = newCategory;
    expense.date = newDate;

    saveExpenses();
    displayExpenses();
    updateTotal();
}