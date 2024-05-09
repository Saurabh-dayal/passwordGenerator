const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~!@#$^*()_-+={[}]|;:"<,>.?/ ';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const max = inputSlider.max;
    const min = inputSlider.min;
    inputSlider.style.backgroundSize = ((passwordLength -min )*100/ (max-min) + "% 100%")
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Corrected Math.floor usage
}

function generateRndNumber() {
    return getRndInteger(0, 9);
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 122)); // Adjusted upper limit to include 'z'
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 90)); // Adjusted upper limit to include 'Z'
}

function generateSymbols() {
    const randNum = getRndInteger(0, symbols.length - 1); // Corrected upper limit
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked; // Corrected property name from .check to .checked
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    const passwordDisplay = document.querySelector("[data-passwordDisplay]");
    const copyMsg = document.querySelector("[data-copyMsg]");

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (error) {
        console.error("Error copying text: ", error);
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

copyBtn.addEventListener("click", copyContent);


function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Corrected Math.floor usage
        const temp = array[i];
        array[i] = array[j]; // Corrected array index
        array[j] = temp; // Corrected array index
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBoxes.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyMsg.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
    if (checkCount === 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";

    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUppercase);
    if (lowercaseCheck.checked) funcArr.push(generateLowercase);
    if (numbersCheck.checked) funcArr.push(generateRndNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbols);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length - 1); // Corrected upper limit
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();
});
