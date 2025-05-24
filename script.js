class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
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
            case '-':
                computation = prev - current;
                break;
            case 'x':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        if (number === '') return '';
        const stringNumber = number.toString();
        const [integerPart, decimalPart] = stringNumber.split('.');
        
        let integerDisplay;
        if (integerPart === '') {
            integerDisplay = '0';
        } else {
            const integerNumber = parseFloat(integerPart);
            integerDisplay = isNaN(integerNumber) ? '' : integerNumber.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalPart != null) {
            return `${integerDisplay}.${decimalPart}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
                this.updateDisplay();
            });
            
            // Touch event for mobile
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.appendNumber(button.innerText);
                this.updateDisplay();
            });
        });

        // Operation buttons
        document.querySelectorAll('[data-operation]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.innerText);
                this.updateDisplay();
            });
            
            // Touch event for mobile
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.chooseOperation(button.innerText);
                this.updateDisplay();
            });
        });

        // Equals button
        document.querySelector('[data-equals]').addEventListener('click', () => {
            this.compute();
            this.updateDisplay();
        });
        
        document.querySelector('[data-equals]').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.compute();
            this.updateDisplay();
        });

        // All clear button
        document.querySelector('[data-all-clear]').addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });
        
        document.querySelector('[data-all-clear]').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.clear();
            this.updateDisplay();
        });

        // Delete button
        document.querySelector('[data-delete]').addEventListener('click', () => {
            this.delete();
            this.updateDisplay();
        });
        
        document.querySelector('[data-delete]').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.delete();
            this.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= 0 && e.key <= 9) this.appendNumber(e.key);
            if (e.key === '.') this.appendNumber('.');
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                const op = e.key === '*' ? 'x' : e.key === '/' ? '÷' : e.key;
                this.chooseOperation(op);
            }
            if (e.key === 'Enter' || e.key === '=') this.compute();
            if (e.key === 'Backspace') this.delete();
            if (e.key === 'Escape') this.clear();
            this.updateDisplay();
        });
    }
}

// Initialize calculator
const calculator = new Calculator(
    document.querySelector('[data-previous-operand]'),
    document.querySelector('[data-current-operand]')
);
