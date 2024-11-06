const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/fromPage');
});

app.get('/fromPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'mainPage.html'));
});

app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'result.html'));
});

let w, h, s;

app.post('/mazePage', (req, res) => {

    let {width, height, shape} = req.body;

    w=width;

    h=height;

    s=shape;

    let imgW;

    if(shape === "S"){
        if(width>100){
            width=100;
        }
        if(height>100){
            height=100;
        }

        grid = square(width,height);

        if(width > height){
            imgW=Math.floor(600/width);
        }else{  
            imgW=Math.floor(600/height);
        }

        let imgS = [];

        Bheight = `${imgW*Number(height)}px`;
        Bwidth = `${imgW*Number(width)}px`;

        for (let row = 0; row < grid.length; row++) {
            imgS[row] = []; 
            for (let col = 0; col < grid[row].length; col++) {
                let i = grid[row][col];
                imgS[row].push(`public/shapesS/${i}.png`); 
            }
        }


        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Maze</title>
                <style>
                    body{
                         background-color: rgb(255, 249, 242);
                    }
                    #maze {
                        width: ${(Bwidth)};
                        height: ${(Bheight)};
                        position: fixed;
                        margin: auto;
                        font-size: 0;
                    }
                    .maze img {
                        display: block;
                        float: left;
                        width: ${imgW}px;
                        height: ${imgW}px;
                    }
                    #box{
                        top: 10%;
                        left: 35%;
                        position: fixed;
                        text-align: center;
                        font-family: sans-serif;
                        font-size: 1.2em;
                    }
                    input:not([type="submit"]) {
                        display: none;
                    }
                    #getback{
                        position: fixed;
                        padding: 15px;
                        border: none;
                        background-color: rgb(255, 244, 230);
                        text-align: center;
                        font-family: sans-serif;
                        font-size: 1.2em;
                        width: 150px;
                        height: 80px;
                        z-index: 3;
                        transition: all 0.5s;
                        border-radius: 10px;
                        top: 85%;
                        left: 40%;
                    }

                    #refresh{
                        position: absolute;
                        padding: 15px;
                        border: none;
                        background-color: rgb(255, 244, 230);
                        text-align: center;
                        font-family: sans-serif;
                        font-size: 1em;
                        width: 150px;
                        height: 80px;
                        z-index: 3;
                        transition: all 0.5s;
                        border-radius: 10px;
                        top: 85%;
                        right: 40%;
                    }

                    #getback:hover{
                        box-shadow:5px 5px 12px rgba(0,0,0,0.05), 10px 10px 10px white;
                        background-color: rgb(255, 247, 236);
                    }

                    #getback:active{
                        box-shadow: 12px 12px 12px rgba(0,0,0,0.1) inset, 10px 10px 10px white inset;
                        background-color: rgb(255, 239, 216);
                    }

                    #refresh:hover{
                        box-shadow:5px 5px 12px rgba(0,0,0,0.05), 10px 10px 10px white;
                        background-color: rgb(255, 247, 236);
                    }

                    #refresh:active{
                        box-shadow: 12px 12px 12px rgba(0,0,0,0.1) inset, 10px 10px 10px white inset;
                        background-color: rgb(255, 239, 216);
                    }
                </style>
            </head>
            <body>
                <div id="box">
                    <div class="maze" id="maze">
                        ${imgS.flat().map(img => `<img src="${img}">`).join('')}
                    </div>
                </div>
                <form  action="/mazePage" method="post" >
                    <input type="submit"  id="refresh" class="knop"value="Generate again"><br>
                    <input type="number" name="width" value="${w}"><br>
                    <input type="number" name="height" value="${h}"><br>
                    <input type="text" name="shape" value="S">
                </form>
                <form action="/fromPage" method="get" >
                    <input type="submit" id="getback" class="knop"value="Back"><br>
                </form>
            </body>
            </html>
        `);

    }else{
        if(width>40){
            width=40;
        }
        if(height>40){
            height=40;
        }

        
        grid = hexagon(Number(width),Number(height));

        let leyerRC = -1;
        let leyerCC = -1;

        let imgS = [];

        if(height<width){
            imgW=Math.floor(800/width);
        }else{  
            imgW=Math.floor(800/height);
        }


        Bheight = `${imgW*Number(height)*2}px`;
        Bwidth = `${imgW*Number(width)*2}px`;

        for (let row = 0; row < grid.length; row++) {
            leyerRC++;
            imgS[row] = []; 
            for (let col = 0; col < grid[row].length; col++) {
                imgS[row][col] = []; 
                leyerCC++;
                let i = grid[row][col];
                imgS[row][col].push(`public/shapesH/${i}.png`);
                imgS[row][col].push(`${leyerCC*imgW*0.38}px`);
                if(leyerCC%2===0){
                    imgS[row][col].push(`${leyerRC*1.475*imgW+Math.floor(imgW/4*2.95)}px`);
                }else{
                    imgS[row][col].push(`${leyerRC*1.475*imgW}px`);
                }
            }
            leyerCC=-1;
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Maze</title>
                <style>                    
                    body{
                         background-color: rgb(255, 249, 242);
                    }
                    #maze {
                        width: ${Bwidth};
                        height: ${Bheight};
                        position: fixed;
                        margin: auto;
                        font-size: 0;
                    }
                    .maze img {
                        position: absolute;
                        width: ${imgW}px;
                        height: ${imgW}px;
                    }
                    #box{
                        top: 10%;
                        left: 35%;
                        position: fixed;
                        width: 20%;
                        height: 30%;
                        text-align: center;
                    }
                    input:not([type="submit"]) {
                        display: none;
                    }

                    #getback{
                        position: absolute;
                        padding: 15px;
                        border: none;
                        background-color: rgb(255, 244, 230);
                        text-align: center;
                        font-family: sans-serif;
                        font-size: 1.2em;
                        width: 150px;
                        height: 80px;
                        z-index: 3;
                        transition: all 0.5s;
                        border-radius: 10px;
                        top: 85%;
                        left: 40%;
                    }

                    #refresh{
                        position: absolute;
                        padding: 15px;
                        border: none;
                        background-color: rgb(255, 244, 230);
                        text-align: center;
                        font-family: sans-serif;
                        font-size: 1em;
                        width: 150px;
                        height: 80px;
                        z-index: 3;
                        transition: all 0.5s;
                        border-radius: 10px;
                        top: 85%;
                        right: 40%;
                    }
                        
                    #getback:hover{
                        box-shadow:5px 5px 12px rgba(0,0,0,0.05), 10px 10px 10px white;
                        background-color: rgb(255, 247, 236);
                    }

                    #getback:active{
                        box-shadow: 12px 12px 12px rgba(0,0,0,0.1) inset, 10px 10px 10px white inset;
                        background-color: rgb(255, 239, 216);
                    }

                    #refresh:hover{
                        box-shadow:5px 5px 12px rgba(0,0,0,0.05), 10px 10px 10px white;
                        background-color: rgb(255, 247, 236);
                    }

                    #refresh:active{
                        box-shadow: 12px 12px 12px rgba(0,0,0,0.1) inset, 10px 10px 10px white inset;
                        background-color: rgb(255, 239, 216);
                    }
                </style>
            </head>
            <body>
                <div id="box">
                    <div class="maze" id="maze">
                        ${imgS.map(row => row.map(img => `<img src="${img[0]}" style="left: ${img[1]}; top: ${img[2]};">`).join('')).join('')}
                    </div>
                </div>
                 <form  action="/mazePage" method="post" >
                    <input type="submit"  id="refresh" class="knop"value="Generate again"><br>
                    <input type="number" name="width" value="${w}"><br>
                    <input type="number" name="height" value="${h}"><br>
                    <input type="radio" name="shape" value="H">
                </form>
                <form action="/fromPage" method="get" >
                    <input type="submit" id="getback" class="knop"value="Back"><br>
                </form>
            </body>
            </html>
        `);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


function hexagon(w, h){
    const TR = 1, R = 2, BR = 4, BL = 8, L = 16, TL = 32;
    const DX = { [TR]: 1, [R]: 2, [BR]: 1, [BL]: -1 , [L]: -2, [TL]: -1};
    const DY = { [TR]: -1, [R]: 0, [BR]: 1, [BL]: 1, [L]: 0, [TL]: -1};
    const OPPOSITE = { [TR]: BL, [R]: L, [BR]: TL, [BL]: TR, [L]: R, [TL]: BR };

    const width = w;
    const height = Math.floor(h/2);
    
    let imgW;

    if(height*2<width){
        imgW=Math.floor(700/width);
    }else{  
        imgW=Math.floor(700/(height*2));
    }


    return maze = generateHMaze(width*2+1, height);

    function walkH(grid, width, height, x, y) {
        const directions = [TR, R, BR, BL, L, TL];
        directions.sort(() => Math.random() - 0.5);
    
        for (const dir of directions) {
            let nx = x + DX[dir];
            let ny = y + DY[dir];

            if(DY[dir]===1 && x%2===1){
                ny = y;
            }

            if(DY[dir]===-1 && x%2===0){
                ny = y;
            }
    
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny][nx] === 0) {
                grid[y][x] |= dir;
                grid[ny][nx] |= OPPOSITE[dir];
                return [nx, ny];
            }
        }
        return [null, null];
    }
    

    function huntH(grid, width, height) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y][x] === 0) {
                    const neighbors = [];
                    
                    if(x > 1 && grid[y][x-2] !== 0) neighbors.push(L);

                    if(x + 2 < width && grid[y][x+2] !== 0) neighbors.push(R);

                    if((y>0 && x%2===1 && grid[y-1][x-1]!==0) || (x%2===0 && x>0 && grid[y][x-1]!==0)) neighbors.push(TL);

                    if((y>0 && x%2===1 && grid[y-1][x+1]!==0) || (x%2===0 && x+1<width && grid[y][x+1]!==0)) neighbors.push(TR);

                    if((y+1<height && x%2===0 && x>0 && grid[y+1][x-1]!==0) || (x%2===1 && grid[y][x-1]!==0)) neighbors.push(BL);

                    if((y+1<height && x%2===0 && x+1<width && grid[y+1][x+1]!==0) || (x%2===1 && grid[y][x+1]!==0)) neighbors.push(BR);
    
                    if (neighbors.length > 0) {
                        const direction = neighbors[Math.floor(Math.random() * neighbors.length)];

                        let nx = x + DX[direction]
                        let ny = y + DY[direction];

                        if(DY[direction]===1 && x%2===1){
                            ny = y;
                        }

                        if(DY[direction]===-1 && x%2===0){
                            ny = y;
                        }
    
                        grid[y][x] |= direction;
                        grid[ny][nx] |= OPPOSITE[direction];
                        return [x, y];
                    }
                }
            }
        }
        return [null, null];
    }
    
    function generateHMaze(width, height) {
        const grid = Array.from({ length: height }, () => Array(width).fill(0));
        let [x, y] = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    
        while (true) {
            [x, y] = walkH(grid, width, height, x, y);
            if (x === null) {
                [x, y] = huntH(grid, width, height);
                if (x === null) break;
            }
        }
    
        return grid.map(row => [...row]);
    }

}



function square(w, h){
    const N = 1, S = 2, E = 4, W = 8;
    const DX = { [E]: 1, [W]: -1, [N]: 0, [S]: 0 };
    const DY = { [E]: 0, [W]: 0, [N]: -1, [S]: 1 };
    const OPPOSITE = { [E]: W, [W]: E, [N]: S, [S]: N };

    const width = w;
    const height = h;

    const maze = generateSMaze(Number(width), Number(height));


    return maze;

    function walkS(grid, width, height, x, y) {
        const directions = [N, S, E, W];
        directions.sort(() => Math.random() - 0.5);
    
        for (const dir of directions) {
            const nx = x + DX[dir];
            const ny = y + DY[dir];
    
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny][nx] === 0) {
                grid[y][x] |= dir;
                grid[ny][nx] |= OPPOSITE[dir];
                return [nx, ny];
            }
        }
        return [null, null];
    }
    

    function huntS(grid, width, height) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y][x] === 0) {
                    const neighbors = [];
                    
                    if (y > 0 && grid[y - 1][x] !== 0) neighbors.push(N);
                    if (x > 0 && grid[y][x - 1] !== 0) neighbors.push(W);
                    if (x + 1 < width && grid[y][x + 1] !== 0) neighbors.push(E);
                    if (y + 1 < height && grid[y + 1][x] !== 0) neighbors.push(S);
    
                    if (neighbors.length > 0) {
                        const direction = neighbors[Math.floor(Math.random() * neighbors.length)];
                        const nx = x + DX[direction];
                        const ny = y + DY[direction];
                        grid[y][x] |= direction;
                        grid[ny][nx] |= OPPOSITE[direction];
                        return [x, y];
                    }
                }
            }
        }
        return [null, null];
    }
    
    function generateSMaze(width, height) {
        const grid = Array.from({ length: height }, () => Array(width).fill(0));
        let [x, y] = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    
        while (true) {
            [x, y] = walkS(grid, width, height, x, y);
            if (x === null) {
                [x, y] = huntS(grid, width, height);
                if (x === null) break;
            }
        }
        return grid.map(row => [...row]);
    }
}
