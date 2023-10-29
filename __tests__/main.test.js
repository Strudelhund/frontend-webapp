const { JSDOM } = require("jsdom");

/ Load the HTML containing the form (replace with your HTML file's path)
const html = fs.readFileSync(path.resolve(__test__, "../js/main.js"), "utf8");

// Create a JSDOM environment
const dom = new jsdom.JSDOM(html);
global.document = dom.window.document;

// Import your JavaScript file with the form logic
const yourFormScript = require("../js/main.js");

// Mock the localStorage object
const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("Form Validation", () => {
  let form;
  let textInput;
  let numberInput;
  let passwordInput;
  let emailInput;
  let textError;
  let numberError;
  let passwordError;
  let emailError;

  beforeEach(() => {
    // Create a new JSDOM for each test
    const dom = new JSDOM(`
      <html>
        <body>
          <form id="myForm">
            <input type="text" name="text" id="text" placeholder="Enter text" required>
            <span id="textError" class="error"></span>

            <input type="number" name="number" id="number" placeholder="Enter number" required>
            <span id="numberError" class="error"></span>

            <input type="password" name="password" id="password" placeholder="Enter password" required>
            <span id="passwordError" class="error"></span>

            <input type="email" name="email" id="email" placeholder="Enter email" required>
            <span id="emailError" class="error"></span>

            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `);

    // Set up the global document and form elements
    global.document = dom.window.document;
    form = document.getElementById("myForm");
    textInput = document.getElementById("text");
    numberInput = document.getElementById("number");
    passwordInput = document.getElementById("password");
    emailInput = document.getElementById("email");
    textError = document.getElementById("textError");
    numberError = document.getElementById("numberError");
    passwordError = document.getElementById("passwordError");
    emailError = document.getElementById("emailError");
  });

  afterEach(() => {
    // Reset the global document after each test
    delete global.document;
  });

  it("should validate form inputs and store valid data in localStorage", () => {
    // Simulate valid form input values
    textInput.value = "ValidText";
    numberInput.value = "123";
    passwordInput.value = "ValidPassword1";
    emailInput.value = "valid@email.com";

    // Trigger form submission
    form.dispatchEvent(new Event("submit"));

    // Validate that errors are cleared
    expect(textError.textContent).toBe("");
    expect(numberError.textContent).toBe("");
    expect(passwordError.textContent).toBe("");
    expect(emailError.textContent).toBe("");

    // Validate that error classes are removed
    expect(textError.classList.contains("error")).toBe(false);
    expect(numberError.classList.contains("error")).toBe(false);
    expect(passwordError.classList.contains("error")).toBe(false);
    expect(emailError.classList.contains("error")).toBe(false);

    // Validate that data is stored in localStorage
    const formData = JSON.parse(localStorage.getItem("formData"));
    expect(formData.text).toBe("ValidText");
    expect(formData.number).toBe("123");
    expect(formData.password).toBe("ValidPassword1");
    expect(formData.email).toBe("valid@email.com");
  });

  it("should show errors for invalid form input values", () => {
    // Simulate invalid form input values
    textInput.value = "123"; // Text is required
    numberInput.value = "-123"; // Negative number
    passwordInput.value = "pass"; // Password too short
    emailInput.value = "invalid-email"; // Invalid email format

    // Trigger form submission
    form.dispatchEvent(new Event("submit"));

    // Validate errors and error classes
    expect(textError.textContent).toBe("Text is required.");
    expect(numberError.textContent).toBe("Number must be between 0 and 9999.");
    expect(passwordError.textContent).toBe("Password must be at least 12 characters with one capital letter and one number.");
    expect(emailError.textContent).toBe("Invalid email format.");
    expect(textError.classList.contains("error")).toBe(true);
    expect(numberError.classList.contains("error")).toBe(true);
    expect(passwordError.classList.contains("error")).toBe(true);
    expect(emailError.classList.contains("error")).toBe(true);
  });

  it("should show an error for a duplicate email in localStorage", () => {
    // Store data with a duplicate email in localStorage
    const formData = {
      text: "OtherText",
      number: "999",
      password: "OtherPassword1",
      email: "duplicate@email.com",
    };
    localStorage.setItem("formData", JSON.stringify(formData));

    // Simulate a form input with the same email
    textInput.value = "ValidText";
    numberInput.value = "123";
    passwordInput.value = "ValidPassword1";
    emailInput.value = "duplicate@email.com";

    // Trigger form submission
    form.dispatchEvent(new Event("submit"));

    // Validate that an error is displayed for the duplicate email
    expect(emailError.textContent).toBe("Email is already in use.");
    expect(emailError.classList.contains("error")).toBe(true);
  });
});
