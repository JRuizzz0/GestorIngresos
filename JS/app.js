// Estado inicial recuperado de localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Selectores del DOM
const balanceEl = document.getElementById('total-balance');
const incomesEl = document.getElementById('total-incomes');
const expensesEl = document.getElementById('total-expenses');
const transactionList = document.getElementById('transaction-list');
const goalsContainer = document.getElementById('goals-container');

const transactionForm = document.getElementById('transaction-form');
const goalForm = document.getElementById('goal-form');

// --- LÓGICA DE TRANSACCIONES ---
function updateDashboard() {
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, item) => acc + item.amount, 0).toFixed(2);
        
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0).toFixed(2);

    balanceEl.innerText = `${total} €`;
    incomesEl.innerText = `${income} €`;
    expensesEl.innerText = `${expense} €`;
    
    updateGoalsProgress(total);
}

function renderTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach(t => {
        const li = document.createElement('li');
        li.classList.add(t.type);
        li.innerHTML = `
            <span>${t.desc}</span>
            <span>${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)} €</span>
        `;
        transactionList.appendChild(li);
    });
}

transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = document.getElementById('desc').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (desc.trim() === '' || isNaN(amount)) return;

    transactions.push({ id: Date.now(), desc, amount, type });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    transactionForm.reset();
    init();
});

// --- LÓGICA DE METAS DE AHORRO ---
function renderGoals() {
    goalsContainer.innerHTML = '';
    const currentBalance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

    goals.forEach(goal => {
        // Calcula el porcentaje basado en el saldo actual disponible
        let percentage = (currentBalance / goal.target) * 100;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;

        const div = document.createElement('div');
        div.classList.add('goal-card');
        div.innerHTML = `
            <h4>${goal.name} (Objetivo: ${goal.target} €)</h4>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <small>${percentage.toFixed(1)}% completado con tu saldo actual</small>
        `;
        goalsContainer.appendChild(div);
    });
}

goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goal-name').value;
    const target = parseFloat(document.getElementById('goal-target').value);

    if (name.trim() === '' || isNaN(target)) return;

    goals.push({ id: Date.now(), name, target });
    localStorage.setItem('goals', JSON.stringify(goals));
    
    goalForm.reset();
    init();
});

function updateGoalsProgress(currentBalance) {
    renderGoals(); // Re-renderiza las metas para actualizar las barras
}

// Inicialización de la App
function init() {
    updateDashboard();
    renderTransactions();
    renderGoals();
}

init();