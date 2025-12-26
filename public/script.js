document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const clearBtn = document.getElementById('clearBtn');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Resize canvas to fit the container
    function resizeCanvas() {
        // Save current drawing
        const savedData = canvas.toDataURL();

        // Resize
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        // Restore drawing if it exists
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedData;

        // Reset context properties after resize
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;
    }

    // Load saved drawing from localStorage on startup
    function loadDrawing() {
        const savedDrawing = localStorage.getItem('canvasFlow_drawing');
        if (savedDrawing) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedDrawing;
        }
    }

    function saveDrawing() {
        localStorage.setItem('canvasFlow_drawing', canvas.toDataURL());
    }

    // Call resize once on load, then load persistent data
    // We need to wait a tick for layout
    setTimeout(() => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        loadDrawing();
    }, 100);

    window.addEventListener('resize', resizeCanvas);

    // Drawing functions
    function draw(e) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        // Handle touch and mouse events
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];

        // Also draw a dot if just clicking
        draw(e);
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        saveDrawing();
    });
    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        saveDrawing();
    });

    // Color and Size change
    colorPicker.addEventListener('change', () => {
        ctx.strokeStyle = colorPicker.value;
    });

    brushSize.addEventListener('input', () => {
        ctx.lineWidth = brushSize.value;
    });

    // Clear
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem('canvasFlow_drawing');
    });
});
