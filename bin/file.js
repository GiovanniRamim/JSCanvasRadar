
var bgLayer;
var radarColor = "436d46";
window.onload = function load(){
    bgLayer = getCanvas("radarBG");
    airplaneLayer = getCanvas("LR-AVIOES-IMAGENS");
    pathLayer = getCanvas("LR-AVIOES-CAMINHO");
    setBGColor(bgLayer, "000000");
    Line(bgLayer, bgLayer.canvas.width / 2, bgLayer.canvas.width / 2, 0, bgLayer.canvas.height, radarColor, 5);
    Line(bgLayer, bgLayer.canvas.width, 0, 0, bgLayer.canvas.height, radarColor, 5);
    Line(bgLayer, 0, bgLayer.canvas.width, 0, bgLayer.canvas.height, radarColor, 5);
    Line(bgLayer, 0, bgLayer.canvas.width, bgLayer.canvas.height / 2, bgLayer.canvas.height / 2, radarColor, 5);
    var r = 250;
    for(var i = 0; i < 4; i++){
            Circle(bgLayer, bgLayer.canvas.width / 2, bgLayer.canvas.height / 2, r, radarColor);
            r -= 50;
        }
    airplane1 = createAirplane(airplaneLayer, 10, 10);
    moveAirplane(airplane1, airplaneLayer, 200, 30, 1);
}

function getCanvas(name){
    var canvas = document.getElementById(name);
    var context = canvas.getContext("2d");
    var imageData = context.createImageData(canvas.width, canvas.height);
    
    return {
        canvas: canvas,
        context: context,
        imageData: imageData
    }
}

function createAirplane(layer, x, y){
    var image = drawAirplane(layer, x, y);
    return {image: image,
           x: x,
           y: y
           }
}

function convertfromHexa(hex){
        let r = parseInt("0x" + hex[0] + hex[1]);
        let g = parseInt("0x" + hex[2] + hex[3]);
        let b = parseInt("0x" + hex[4] + hex[5]);
        return {r, g, b};
}

// Sleep function got from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveAirplane(airplane, layer, x1, y1, v){
    var x0 = airplane.x;
    var y0 = airplane.y; 
    //calculos
    var dx = x1 - x0;
    var sx = x1 < x0 ? -1 * v : 1 * v;
    var dy = y1 - y0;
    var sy = y1 < y0 ? -1 * v : 1 * v;
    //
    if(Math.abs(dy) < Math.abs(dx)){
        let slope = dy / dx;
        let pitch = y0 - slope * x0;
        while(airplane.x != x1) {
            var y = Math.round(slope*airplane.x + pitch);
            var airplaneCenter = {
                x: Math.round(airplane.x + (airplane.image.width/2)),
                y: Math.round(y + airplane.image.height / 2)
            }
            await sleep(100);
            eraseAirplane(layer, airplane, airplane.x, y, v);
            drawAirplane(layer, airplane.x, y);
            pathLayer.context.putImageData(drawPixel(pathLayer, airplaneCenter.x, airplaneCenter.y, "b600ff"), 0, 0);
            airplane.x += sx;
        }
    } else {
        let slope = dx / dy;
        let pitch = x0 - slope * y0;
        while(airplane.y != y1) {
            var x = Math.round(slope*airplane.y + pitch);
            var airplaneCenter = {
                x: Math.round(x + (airplane.image.width/2)),
                y: Math.round(airplane.y + airplane.image.height / 2)
            }
            await sleep(100);
            eraseAirplane(layer, airplane, x, airplane.y, v);
            drawAirplane(layer, x, airplane.y);
            pathLayer.context.putImageData(drawPixel(pathLayer, airplaneCenter.x, airplaneCenter.y, "b600ff"), 0, 0);
            airplane.y += sy;
        }
    }
}

function eraseAirplane(layer, airplane, x, y, v){
    layer.context.clearRect(x - v,  y - v, x + airplane.image.width + v,  y + airplane.image.height + v);
}

function drawAirplane(layer, x, y){
        var img = new Image();
        img.src = "./assets/airplane.png";
        img.onload = function(){
            layer.context.drawImage(img, x, y);
        }
        return img;
    }

function setBGColor(layer, color){
    for(let x = 0; x < layer.canvas.width; x++){
            for(let y = 0; y < layer.canvas.height; y++){
            drawPixel(layer, x, y, color)
            }
        }
    return layer.context.putImageData(layer.imageData, 0, 0)
} // this should paint the layer background

function drawPixel(layer, X, Y, color){
        let index = X + (Y * layer.canvas.width);
        let RGBA = convertfromHexa(color);
        layer.imageData.data[(index * 4) + 0] = RGBA.r;
        layer.imageData.data[(index * 4) + 1] = RGBA.g;
        layer.imageData.data[(index * 4) + 2] = RGBA.b;
        layer.imageData.data[(index * 4) + 3] = 255;
        return layer.imageData;
    } //this should draw a pixel on a layer

function Line(layer, x0, x1, y0, y1, color, dotSpacing){
        if(x0 == x1 && y0 == y1){
            return layer.context.putImageData(drawPixel(layer, x0, y0, color), 0, 0)
        }
        let dx = x1 - x0;
        let sx = dx < 0 ? -1 : 1;
        let dy = y1 - y0;
        let sy = dy < 0 ? -1 : 1;

        if(Math.abs(dy) < Math.abs(dx)){
            let slope = dy / dx;
            let pitch = y0 - slope * x0;
            let draw = true;
            while(x0 != x1){
                if(draw == true){
                    drawPixel(layer, x0, Math.round(slope*x0 + pitch), color);
                }
                if(x0 % dotSpacing == 0){
                    draw = !draw;
                }
                x0 += sx;
            }
        } else {
            let slope = dx / dy;
            let pitch = x0 - slope * y0;
            let draw = true;
            while(y0 != y1){
                if(draw == true){
                    drawPixel(layer, Math.round(slope*y0 + pitch), y0, color);
                }
                if(y0 % dotSpacing == 0){
                    draw = !draw;
                }
                y0 += sy;
            }
        }
        drawPixel(layer, x1, y1, color);
        return layer.context.putImageData(layer.imageData, 0, 0)
    } //this should draw a line on a layer

function Circle(layer, xc, yc, r, color){
        function drawCircle(c, xc, yc, x, y){
        drawPixel(layer, xc+x, yc+y, color);
        drawPixel(layer, xc-x, yc+y, color);
        drawPixel(layer, xc+x, yc-y, color);
        drawPixel(layer, xc-x, yc-y, color);
        drawPixel(layer, xc+y, yc+x, color);
        drawPixel(layer, xc+y, yc-x, color);
        drawPixel(layer, xc-y, yc+x, color);
        drawPixel(layer, xc-y, yc-x, color);
        }
        let x = 0;
        let y = r;
        let d = 3 - 2 * r;
        drawCircle(layer, xc, yc, x, y);
        while(y >= x){
            x++;
            if(d > 0){
                y--;
                d = d + 6 * (x - y);
            }
            else {
                d = d + 6 * x;
            }
            drawCircle(layer, xc, yc, x, y);
        }
        return layer.context.putImageData(layer.imageData, 0, 0)
    } //this should draw a circle on a layer