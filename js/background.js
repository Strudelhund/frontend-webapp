document.addEventListener("DOMContentLoaded", function () {
    // Function to set a random dog image as the background
    function setRandomDogImageAsBackground() {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    const imageUrl = data.message;
                    document.body.style.backgroundImage = `url(${imageUrl})`;
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundRepeat = "no-repeat";
                }
            })
            .catch(error => console.error("Error fetching dog image:", error));
    }

    // Call the function to set the background image when the page is loaded
    setRandomDogImageAsBackground();

    // Add an error handler to replace the background image if it fails to load
    document.body.onerror = function () {
        setRandomDogImageAsBackground();
    };
});
