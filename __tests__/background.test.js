// Import the fetchMock library
const fetchMock = require('fetch-mock');
// Import jsdom to create a virtual DOM environment
const { JSDOM } = require('jsdom');

// Include your main.js file for testing
const { setRandomDogImageAsBackground } = require('../js/background.js');

// Mock the fetch request and provide a sample response
fetchMock.mock('https://dog.ceo/api/breeds/image/random', {
  status: 'success',
  message: 'https://images.dog.ceo/breeds/airedale/n02096051_4153.jpg',
});

// Create a virtual DOM environment
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');

// Assign the window object to the global object
global.window = window;
global.document = window.document;
global.body = window.document.body;

// Define a test case
test('setRandomDogImageAsBackground sets the background image', async () => {
  // Call the function to be tested
  await setRandomDogImageAsBackground();

  // Verify that the background image and styles are set as expected
  const body = document.body;
  expect(body.style.backgroundImage).toBe('url(https://images.dog.ceo/breeds/airedale/n02096051_4153.jpg)');
  expect(body.style.backgroundSize).toBe('cover');
  expect(body.style.backgroundRepeat).toBe('no-repeat');
});

// Clean up the fetch mock after the test
afterEach(() => {
  fetchMock.reset();
});

// Clear the fetch mock after all tests
afterAll(() => {
  fetchMock.restore();
});
