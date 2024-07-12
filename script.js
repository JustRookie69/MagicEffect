document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let frames = [];
    let img = new Image();

    const fetchFrames = async () => {
        try {
            const response = await fetch('frameExtractor/files/frames_info.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched JSON data:', data); // Log the entire JSON data
    
            if (Array.isArray(data) && data.length > 0) {
                frames = data.map(frame => frame.frame_path.replace(/\\/g, '/')); // Ensure forward slashes
                console.log('Processed frames:', frames);
                preloadImages();
            } else {
                console.error('No or empty array found in JSON:', data);
            }
        } catch (error) {
            console.error('Error fetching or parsing the JSON file:', error);
        }
    };
    
    

    const currentFrame = index => frames[index];

    const updateImage = index => {
        const src = currentFrame(index);
        console.log('Updating image with src:', src);
        if (src) {
            img.src = src;
            img.onload = () => {
                console.log(`Loaded image: ${img.src}`);
                context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.onerror = (err) => {
                console.error(`Error loading image: ${img.src}`, err);
            };
        } else {
            console.error('No src for index:', index);
        }
    };

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(
            frames.length - 1,
            Math.floor(scrollFraction * frames.length)
        );
        requestAnimationFrame(() => updateImage(frameIndex));
    });

    const preloadImages = () => {
        for (let i = 0; i < frames.length; i++) {
            const preImg = new Image();
            preImg.src = currentFrame(i);
            preImg.onload = () => console.log(`Preloaded image: ${preImg.src}`);
            preImg.onerror = (err) => console.error(`Error preloading image: ${preImg.src}`, err);
        }
    };

    fetchFrames();

    // Resize the canvas to fill the browser window dynamically
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize
});



// document.addEventListener('DOMContentLoaded', () => {
//     const displayImage = document.getElementById('display-image');
//     let imageData = [];

//     // Fetch the image data from JSON
//     fetch('frameExtractor/files/frames_info.json')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             imageData = data.frames.map(item => item.frame_path.replace(/\\/g, '/'));
//             updateImage();
//         })
//         .catch(error => {
//             console.error('Error fetching the JSON file:', error);
//         });

//     // Function to update the image based on scroll position
//     function updateImage() {
//         const scrollPosition = window.scrollY;
//         const index = Math.min(Math.floor(scrollPosition / window.innerHeight), imageData.length - 1);
//         displayImage.src = imageData[index];
//     }

//     // Scroll event listener
//     window.addEventListener('scroll', () => {
//         updateImage();
//     });

//     // Initial call to display the first image
//     updateImage();
// });




// document.addEventListener('DOMContentLoaded', () => {
//     const imageContainer = document.getElementById('image-container');
//     const imagesPerScroll = 5; // Number of images to display per scroll
//     let imageData = [];
//     let currentIndex = 0;

//     // Fetch the image data from JSON
//     fetch('frames_info.json')
//         .then(response => response.json())
//         .then(data => {
//             imageData = data.images;
//             displayImages();
//         });

//     // Function to display a set of images
//     function displayImages() {
//         imageContainer.innerHTML = '';
//         for (let i = currentIndex; i < currentIndex + imagesPerScroll && i < imageData.length; i++) {
//             const imgElement = document.createElement('img');
//             imgElement.src = imageData[i];
//             imageContainer.appendChild(imgElement);
//         }
//     }

//     // Scroll event listener
//     window.addEventListener('scroll', () => {
//         const scrollPosition = window.scrollY + window.innerHeight;
//         const containerHeight = document.body.scrollHeight;

//         if (scrollPosition >= containerHeight - 100) { // Load more images when close to the bottom
//             currentIndex += imagesPerScroll;
//             if (currentIndex < imageData.length) {
//                 displayImages();
//             }
//         }
//     });
// });
