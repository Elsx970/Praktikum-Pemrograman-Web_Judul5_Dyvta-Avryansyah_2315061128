var currentValue = '0';
var previousValue = null;
var operator = '';
var waitingForNewValue = false;
var memory = 0;
var calculationHistory = [];

var display = document.getElementById('display');
var expressionDisplay = document.getElementById('expression');
var memoryDisplay = document.getElementById('memoryDisplay');
var memoryValue = document.getElementById('memoryValue');
var historyList = document.getElementById('historyList');

function updateDisplay() {
    display.textContent = currentValue;
    if (previousValue !== null && operator !== '') {
        expressionDisplay.textContent = previousValue + ' ' + operator;
    } else {
        expressionDisplay.textContent = '';
    }
}

function appendNumber(number) {
    if (waitingForNewValue) {
        currentValue = number;
        waitingForNewValue = false;
    } else {
        if (currentValue === '0') {
            currentValue = number;
        } else {
            currentValue = currentValue + number;
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (waitingForNewValue) {
        currentValue = '0.';
        waitingForNewValue = false;
    } else {
        if (currentValue.indexOf('.') === -1) {
            currentValue = currentValue + '.';
        }
    }
    updateDisplay();
}

function handleOperator(op) {
    var inputValue = parseFloat(currentValue);

    if (operator !== '' && previousValue !== null) {
        var result = performCalculation();
        previousValue = result;
        currentValue = String(result);
        updateDisplay();
    } else {
        if (!isNaN(inputValue)) {
            previousValue = inputValue;
        }
    }

    operator = op;
    waitingForNewValue = true;
    updateDisplay();
}

function performCalculation() {
    var prev;
    if (typeof previousValue === 'number') {
        prev = previousValue;
    } else {
        prev = parseFloat(previousValue);
    }
    var current = parseFloat(currentValue);

    if (isNaN(prev) || isNaN(current)) {
        return current;
    }

    var result;
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert('Error: Pembagian dengan nol tidak diperbolehkan!');
                clearAll();
                return 0;
            }
            result = prev / current;
            break;
        default:
            return current;
    }

    result = Math.round(result * 100000000) / 100000000;
    return result;
}

function calculate() {
    if (operator === '') {
        return;
    }
    
    if (previousValue === null) {
        var inputValue = parseFloat(currentValue);
        if (isNaN(inputValue)) {
            return;
        }
        previousValue = inputValue;
    }
    
    var result = performCalculation();
    var prevStr = String(previousValue);
    var currStr = String(currentValue);
    var expression = prevStr + ' ' + operator + ' ' + currStr + ' =';
    addToHistory(expression, result);
    
    currentValue = String(result);
    previousValue = null;
    operator = '';
    waitingForNewValue = true;
    updateDisplay();
}

function clearAll() {
    currentValue = '0';
    previousValue = null;
    operator = '';
    waitingForNewValue = false;
    updateDisplay();
}

function clearEntry() {
    currentValue = '0';
    updateDisplay();
}

function memoryAdd() {
    var value = parseFloat(currentValue);
    if (!isNaN(value)) {
        memory = memory + value;
        memory = Math.round(memory * 100000000) / 100000000;
        updateMemoryDisplay();
    }
}

function memorySubtract() {
    var value = parseFloat(currentValue);
    if (!isNaN(value)) {
        memory = memory - value;
        memory = Math.round(memory * 100000000) / 100000000;
        updateMemoryDisplay();
    }
}

function memoryRecall() {
    if (memory !== 0) {
        currentValue = String(memory);
        waitingForNewValue = true;
        updateDisplay();
    }
}

function memoryClear() {
    memory = 0;
    updateMemoryDisplay();
}

function updateMemoryDisplay() {
    if (memory !== 0) {
        memoryDisplay.style.display = 'block';
        memoryValue.textContent = String(memory);
    } else {
        memoryDisplay.style.display = 'none';
    }
}

function addToHistory(expression, result) {
    calculationHistory.unshift({ expression: expression, result: result });
    if (calculationHistory.length > 5) {
        calculationHistory.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<div class="text-muted text-center">Belum ada history</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < calculationHistory.length; i++) {
        html = html + '<div class="card mb-2">';
        html = html + '<div class="card-body p-2">';
        html = html + '<div class="text-muted small">' + calculationHistory[i].expression + '</div>';
        html = html + '<div class="fw-bold">' + calculationHistory[i].result + '</div>';
        html = html + '</div>';
        html = html + '</div>';
    }
    historyList.innerHTML = html;
}

document.addEventListener('keydown', function(event) {
    var key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    else if (key === '.' || key === ',') {
        appendDecimal();
    }
    else if (key === '+') {
        handleOperator('+');
    }
    else if (key === '-') {
        handleOperator('-');
    }
    else if (key === '*') {
        handleOperator('×');
    }
    else if (key === '/') {
        event.preventDefault();
        handleOperator('÷');
    }
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    }
    else if (key === 'Delete' || key === 'Backspace') {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
        updateDisplay();
    }
});

updateDisplay();

