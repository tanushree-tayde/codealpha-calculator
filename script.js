let formulaString = "";
let clearOnNextInput = false;
const mainDisplay = document.getElementById("main-display");
const previewDisplay = document.getElementById("expression-preview");
const visualOperators = { '*': 'x', '/': '÷', '+': '+', '-': '-' };
function refreshUI() {
    let formatted = formulaString;
    Object.keys(visualOperators).forEach(key => {
        formatted = formatted.split(key).join(` ${visualOperators[key]} `);
    });
    
    mainDisplay.innerText = formatted || "0";
}
function pushToken(token) {
    if (clearOnNextInput && !['+', '-', '*', '/', '%'].includes(token)) {
        formulaString = "";
    }
    clearOnNextInput = false;
    if (token === '%') {
        let match = formulaString.match(/(\d+(\.\d+)?)$/);
        if (match) {
            let lastNum = match[0];
            let percentValue = parseFloat(lastNum) / 100;
            percentValue = parseFloat(percentValue.toFixed(10));
            formulaString = formulaString.slice(0, -lastNum.length) + percentValue;
        }
        refreshUI();
        return;
    }
    if (['+', '-', '*', '/'].includes(token) && ['+', '-', '*', '/'].includes(formulaString.slice(-1))) {
        formulaString = formulaString.slice(0, -1);
    }
    if (formulaString === "" && token === "0") return;
    formulaString += token;
    refreshUI();
}
function wipeScreen() {
    formulaString = "";
    previewDisplay.innerText = "";
    refreshUI();
}
function dropLastCharacter() {
    formulaString = formulaString.toString().slice(0, -1);
    refreshUI();
}
function runEvaluation() {
    if (!formulaString) return;
    try {
        let computedResult = Function(`"use strict"; return (${formulaString})`)();
        if (computedResult === Infinity || isNaN(computedResult)) {
            throw new Error();
        }
        if (computedResult % 1 !== 0) {
            computedResult = parseFloat(computedResult.toFixed(8));
        }
        previewDisplay.innerText = mainDisplay.innerText + " =";
        formulaString = computedResult.toString();
        clearOnNextInput = true;
        refreshUI();
    } catch (err) {
        mainDisplay.innerText = "Error";
        formulaString = "";
    }
}
window.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") pushToken(e.key);
    if (e.key === ".") pushToken(".");
    if (e.key === "%") pushToken("%"); // Added keyboard support for percentage key
    if (e.key === "Backspace") dropLastCharacter();
    if (e.key === "Escape") wipeScreen();
    if (e.key === "Enter" || e.key === "=") runEvaluation();
    if (["+", "-", "*", "/"].includes(e.key)) pushToken(e.key);
});
