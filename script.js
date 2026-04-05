let spending = { Food: 400, Rent: 1200, Fun: 300, Other: 200 };
let history = [
    { n: 'Salary Credited', a: 1200, c: 'Income', t: 'pos' },
    { n: 'Supermarket', a: 150, c: 'Food', t: 'neg' },
    { n: 'Monthly Rent', a: 1200, c: 'Rent', t: 'neg' },
    { n: 'Freelance Pay', a: 800, c: 'Income', t: 'pos' }
];

const chart = document.getElementById('mainChart');
const tooltip = document.getElementById('chart-tooltip');
function updateUI() {
    const total = spending.Food + spending.Rent + spending.Fun + spending.Other;

    const p1 = (spending.Food / total) * 100;
    const p2 = p1 + (spending.Rent / total) * 100;
    const p3 = p2 + (spending.Fun / total) * 100;

    document.documentElement.style.setProperty('--p1', p1 + '%');
    document.documentElement.style.setProperty('--p2', p2 + '%');
    document.documentElement.style.setProperty('--p3', p3 + '%');

    document.getElementById('total-exp-display').innerText = `$${total.toLocaleString()}`;

    const container = document.getElementById('txn-container');
    container.innerHTML = history.map(item => `
                <div class="txn-item">
                    <div><b>${item.n}</b><br><small style="color:#64748b">${item.c}</small></div>
                    <div class="amt ${item.t}">${item.t === 'pos' ? '+' : '-'}$${item.a}</div>
                </div>
            `).join('');
}

chart.addEventListener('mousemove', (e) => {
    const rect = chart.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));

    if (distance < 55 || distance > 100) {
        tooltip.style.display = 'none';
        chart.style.cursor = 'default';
        return;
    }

    chart.style.cursor = 'crosshair'; 

    let angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const total = spending.Food + spending.Rent + spending.Fun + spending.Other;
    const s1 = (spending.Food / total) * 360;
    const s2 = s1 + (spending.Rent / total) * 360;
    const s3 = s2 + (spending.Fun / total) * 360;

    let label = "", val = 0;
    if (angle <= s1) { label = "Food"; val = spending.Food; }
    else if (angle <= s2) { label = "Rent"; val = spending.Rent; }
    else if (angle <= s3) { label = "Fun"; val = spending.Fun; }
    else { label = "Other"; val = spending.Other; }

    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
    tooltip.innerHTML = `<b>${label}</b>: $${val.toLocaleString()}`;
});

chart.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    chart.style.cursor = 'default';
});

function addNew() {
    const n = document.getElementById('name').value;
    const a = parseFloat(document.getElementById('amt').value);
    const c = document.getElementById('cat').value;
    if (!n || isNaN(a)) return;
    history.unshift({ n, a, c, t: 'neg' });
    spending[c] += a;
    updateUI();
    document.getElementById('name').value = '';
    document.getElementById('amt').value = '';
}

document.querySelectorAll('#nav li').forEach(li => {
    li.onclick = () => {
        document.querySelectorAll('#nav li').forEach(i => i.classList.remove('active'));
        li.classList.add('active');
        document.getElementById(li.dataset.section).scrollIntoView({ behavior: 'smooth' });
    };
});
function calculateBudget() {
    const goal = parseFloat(document.getElementById('budget-goal').value);
    
    const expenseText = document.getElementById('total-exp-display').innerText;
    const currentExpenses = parseFloat(expenseText.replace(/[$,]/g, ''));

    if (!goal || goal <= 0) {
        alert("Please enter a valid budget goal.");
        return;
    }
    const percentage = Math.min((currentExpenses / goal) * 100, 100).toFixed(1);
    
    const progressBar = document.getElementById('budget-bar');
    const percentText = document.getElementById('budget-percent');
    const warningText = document.getElementById('budget-warning');

    percentText.innerText = percentage + "%";
    progressBar.style.width = percentage + "%";

    if (percentage >= 90) {
        progressBar.style.background = "#ef4444"; // Red
        warningText.innerText = "Warning: You've used almost your entire budget!";
    } else if (percentage >= 70) {
        progressBar.style.background = "#fbbf24"; // Yellow
        warningText.innerText = "Careful, you're approaching your limit.";
    } else {
        progressBar.style.background = "#38bdf8"; // Blue
        warningText.innerText = "You are well within your budget.";
    }
}
window.onload = updateUI;
