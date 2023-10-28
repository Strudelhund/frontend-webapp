document.addEventListener("DOMContentLoaded", function () {
    const contentContainer = document.getElementById("content");
    const favoritesList = document.getElementById("favorites-list");

    // Function to fetch and render dog images
    function fetchAndRenderImages() {
        contentContainer.innerHTML = ""; // Clear previous images

        // Fetch data from an API: 3 dog images
        fetch("https://dog.ceo/api/breeds/image/random/3")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    const images = data.message;

                    // Set a fixed width and height for the images
                    const imageWidth = "400px";
                    const imageHeight = "400px";

                    // Render API data in the content section
                    images.forEach(imageUrl => {
                        const img = document.createElement("img");
                        img.src = imageUrl;
                        img.style.width = imageWidth;
                        img.style.height = imageHeight;
                        contentContainer.appendChild(img);

                        // Add the image to favorites when clicked
                        img.addEventListener("click", () => {
                            const favoriteItem = document.createElement("img");
                            favoriteItem.src = imageUrl;
                            favoriteItem.style.width = imageWidth;
                            favoriteItem.style.height = imageHeight;
                            favoritesList.appendChild(favoriteItem);

                            // Add a click event listener to remove the favorite when clicked
                            favoriteItem.addEventListener("click", () => {
                                favoritesList.removeChild(favoriteItem);
                            });
                        });

                        // Add an error handler to replace the image if it fails to load
                        img.onerror = function() {
                            fetchAndReplaceImage(img);
                        };
                    });
                }
            })
            .catch(error => console.error("Error fetching dog images:", error));
    }

    function fetchAndReplaceImage(image) {
        // Fetch a new dog image and replace the failed image
        fetch("https://dog.ceo/api/breeds/image/random/1")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success" && data.message.length > 0) {
                    const newImageUrl = data.message[0];
                    image.src = newImageUrl;
                    img = document.createElement("img");
                        img.src = newImageUrl;
                        img.style.width = imageWidth;
                        img.style.height = imageHeight;
                        contentContainer.appendChild(img);
                }
            })
            .catch(error => console.error("Error fetching replacement image:", error));
    }

    // Initial fetch and render
    fetchAndRenderImages();

    // Button click event to refresh images
    const refreshButton = document.getElementById("refresh-button");
    refreshButton.addEventListener("click", fetchAndRenderImages);
});
