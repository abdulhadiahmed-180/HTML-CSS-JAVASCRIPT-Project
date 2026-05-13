
let expression = "";
let cursorPos = 0;
let lastAnswer = 0;
let isDegrees = false;

const displayEl = document.getElementById('display');
const historyEl = document.getElementById('history');
const radBtn = document.getElementById('radBtn');
const degBtn = document.getElementById('degBtn');

function updateDisplay() {
    const before = expression.slice(0, cursorPos);
    const after = expression.slice(cursorPos);
    displayEl.innerHTML = before + '<span class="cursor">|</span>' + after;
    if (expression === "") displayEl.innerHTML = '0<span class="cursor">|</span>';
    displayEl.scrollLeft = displayEl.scrollWidth;
}

function handleInput(text) {
    expression = expression.slice(0, cursorPos) + text + expression.slice(cursorPos);
    cursorPos += text.length;
    updateDisplay();
}

function backspace() {
    if (cursorPos === 0) return;
    expression = expression.slice(0, cursorPos - 1) + expression.slice(cursorPos);
    cursorPos--;
    updateDisplay();
}

function clearAll() {
    expression = "";
    cursorPos = 0;
    historyEl.textContent = "";
    updateDisplay();
}

function toggleMode(degMode) {
    isDegrees = degMode;
    radBtn.classList.toggle('mode-active', !degMode);
    degBtn.classList.toggle('mode-active', degMode);
}

function degToRad(x) { return x * Math.PI / 180; }
function deg_sin(x){ return Math.sin(degToRad(x)); }
function deg_cos(x){ return Math.cos(degToRad(x)); }
function deg_tan(x){ return Math.tan(degToRad(x)); }

function prepareExpression(expr) {
    expr = expr.replace(/π/g, 'Math.PI');
    expr = expr.replace(/ANS/g, lastAnswer);
    expr = expr.replace(/e/g, 'Math.E');
    expr = expr.replace(/\^\(([^)]+)\)/g, '**($1)');

    expr = expr.replace(/ln\(/g, 'Math.log(');
    expr = expr.replace(/log10\(/g, 'Math.log10(');
    expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');

    if (isDegrees) {
        expr = expr.replace(/sin\(/g, 'deg_sin(');
        expr = expr.replace(/cos\(/g, 'deg_cos(');
        expr = expr.replace(/tan\(/g, 'deg_tan(');
    } else {
        expr = expr.replace(/sin\(/g, 'Math.sin(');
        expr = expr.replace(/cos\(/g, 'Math.cos(');
        expr = expr.replace(/tan\(/g, 'Math.tan(');
    }

    return expr;
}

function calculate() {
    if (!expression.trim()) return;
    historyEl.textContent = expression + " =";

    try {
        const safe = prepareExpression(expression);
        let result = Function(`"use strict"; return ${safe}`)();
        if (isNaN(result) || !isFinite(result)) throw new Error("Invalid");
        result = parseFloat(result.toFixed(10));
        lastAnswer = result;

        expression = result.toString();
        cursorPos = expression.length;
        historyEl.textContent += " " + result;
        updateDisplay();

    } catch (err) {
        historyEl.textContent = "Syntax Error";
        historyEl.classList.add('error');
        setTimeout(() => {
            historyEl.textContent = "";
            historyEl.classList.remove('error');
        }, 1600);
    }
}

document.addEventListener('DOMContentLoaded', updateDisplay);

// DARK MODE TOGGLE //
const themeToggleBtn = document.getElementById("themeToggle");

themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    // switch icon //
    const darkOn = document.documentElement.classList.contains("dark");
    themeToggleBtn.textContent = darkOn ? "☀️" : "🌙";
});

