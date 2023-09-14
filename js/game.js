const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const randomizeButton = document.getElementById("randomizeButton");

// grade e tamanho
const rows = 60;
const cols = 60;
const cellSize = canvas.width / cols;

let grid = createEmptyGrid();
let isRunning = false;
let animationId;

// limpa canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}



// Função para criar uma grade vazia
function createEmptyGrid() {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(false);
    }
    return grid;
}

// Função para preencher a grade com células vivas ou mortas aleatoriamente
function randomizeGrid(grid) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < 0.5; // 50% de chance de célula viva
        }
    }
}

  
// desenha a grade
function drawGrid() {
    clearCanvas();
    ctx.strokeStyle = "#ccc";
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            const x = j * cellSize;
            const y = i * cellSize;
            ctx.beginPath();
            ctx.rect(x, y, cellSize, cellSize);
            if(grid[i][j]){
                ctx.fillStyle = "black";
                ctx.fill();
            }
            ctx.stroke();
        }
    }
}

// calcula a proxima geração
function nextGeneration(grid) {
    const newGrid = createEmptyGrid();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(grid, i, j);
            if (grid[i][j]) {
                // Regra para célula viva
                if (neighbors === 2 || neighbors === 3) {
                    newGrid[i][j] = true;
                }
            } else {
                // Regra para célula morta
                if (neighbors === 3) {
                    newGrid[i][j] = true;
                }
            }
        }
    }
    return newGrid;
}

// atualiza simulação
function updateSimulation() {
    const newGrid = nextGeneration(grid);
    grid = newGrid;
    drawGrid();
    if(isRunning) {
        setTimeout(updateSimulation, 80);
    }
}


// Função para contar o número de vizinhos vivos de uma célula
function countNeighbors(grid, x, y) {
    let count = 0;
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    for (const [dx, dy] of neighbors) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && grid[newX][newY]) {
            count++;
        }
    }
    return count;
}



// Event listeners para os botões
startButton.addEventListener("click", () => {
    isRunning = true;
    updateSimulation();
});

stopButton.addEventListener("click", () => {
    isRunning = false;
    cancelAnimationFrame(animationId);
});

randomizeButton.addEventListener("click", () => {
    grid = createEmptyGrid();
    randomizeGrid(grid);
    drawGrid();
});



// Configuração inicial
randomizeGrid(grid);
drawGrid();