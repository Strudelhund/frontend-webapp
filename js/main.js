document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const textInput = document.getElementById("text");
    const numberInput = document.getElementById("number");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");

    const textError = document.getElementById("textError");
    const numberError = document.getElementById("numberError");
    const passwordError = document.getElementById("passwordError");
    const emailError = document.getElementById("emailError");

    textError.textContent = "";
    numberError.textContent = "";
    passwordError.textContent = "";
    emailError.textContent = "";

    let isValid = true;

    if (textInput.value.trim() === "") {
        textError.textContent = "Text is required.";
        textError.classList.add("error");
        isValid = false;
    } else if (!/^[a-zA-Z]*$/.test(textInput.value)) {
        textError.textContent = "Text must contain only letters (uppercase or lowercase).";
        textError.classList.add("error");
        isValid = false;
    } else {
        textError.classList.remove("error");
    }

    const numberValue = parseFloat(numberInput.value);
    if (isNaN(numberValue) || numberValue < 0 || numberValue > 9999) {
        numberError.textContent = "Number must be between 0 and 9999.";
        numberInput.classList.add("error");
        isValid = false;
    } else {
        numberInput.classList.remove("error");
    }

    if (passwordInput.value.length < 12 ||
        !/[A-Z]/.test(passwordInput.value) ||
        !/\d/.test(passwordInput.value)) {
        passwordError.textContent = "Password must be at least 12 characters with one capital letter and one number.";
        passwordInput.classList.add("error");
        isValid = false;
    } else {
        passwordInput.classList.remove("error");
    }

    // Check if the email is already stored in local storage
    const storedData = JSON.parse(localStorage.getItem('formData'));
    if (storedData && storedData.email === emailInput.value) {
        emailError.textContent = "Email is already in use.";
        emailInput.classList.add("error");
        isValid = false;
    } else {
        emailInput.classList.remove("error");
    }

    if (isValid) {
        // Form is valid, proceed to save data for future use...
        alert("Form submitted successfully!");

        // Save the data to localStorage
        const formData = {
            text: textInput.value,
            number: numberInput.value,
            password: passwordInput.value,
            email: emailInput.value,
        };

        // Convert the formData object to a JSON string and store it in localStorage
        localStorage.setItem('formData', JSON.stringify(formData));
    }
});
