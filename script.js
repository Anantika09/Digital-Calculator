class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = number;
            this.shouldResetScreen = false;
        } else {
            this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
    }

    formatResult(result) {
        if (result === undefined || result === null) return '0';
        
        const stringNumber = result.toString();
        
        if (stringNumber.length > 12) {
            if (Math.abs(result) > 999999999999 || Math.abs(result) < 0.000000000001) {
                return result.toExponential(6);
            }
            
            const integerDigits = Math.floor(result).toString().length;
            const decimalDigits = 12 - integerDigits;
            return decimalDigits > 0 ? result.toFixed(decimalDigits) : Math.round(result).toString();
        }
        
        return stringNumber;
    }

    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    addDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0.';
            this.shouldResetScreen = false;
            return;
        }
        
        if (this.currentOperand.includes('.')) return;
        this.currentOperand += '.';
    }

    calculatePercentage() {
        if (this.previousOperand === '' || this.operation === undefined) {
            // If no previous operation, treat as percentage of 1
            this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        } else {
            // If there's an operation, calculate percentage of previous operand
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            this.currentOperand = (prev * current / 100).toString();
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const numberButtons = document.querySelectorAll('.btn-number');
    const operatorButtons = document.querySelectorAll('.btn-operator');
    const equalsButton = document.querySelector('.btn-equals');
    const clearButton = document.querySelector('.btn-clear');

    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === '.') {
                calculator.addDecimal();
            } else {
                calculator.appendNumber(button.textContent);
            }
            calculator.updateDisplay();
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const op = button.textContent;
            
            if (op === '±') {
                calculator.toggleSign();
            } else if (op === '%') {
                calculator.calculatePercentage();
            } else {
                calculator.chooseOperation(op);
            }
            
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    document.addEventListener('keydown', event => {
        if (event.key >= '0' && event.key <= '9') {
            calculator.appendNumber(event.key);
        } else if (event.key === '.') {
            calculator.addDecimal();
        } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
            let op;
            switch (event.key) {
                case '+': op = '+'; break;
                case '-': op = '−'; break;
                case '*': op = '×'; break;
                case '/': op = '÷'; break;
            }
            calculator.chooseOperation(op);
        } else if (event.key === 'Enter' || event.key === '=') {
            calculator.compute();
        } else if (event.key === 'Escape' || event.key === 'Delete') {
            calculator.clear();
        } else if (event.key === '%') {
            calculator.calculatePercentage();
        } else if (event.key === 'Backspace') {
            calculator.delete();
        }
        calculator.updateDisplay();
    });
});