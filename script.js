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


