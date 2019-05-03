
var bg;
var radarColor = "436d46";
window.onload = function load(){
    bg = new background(500, 500, "radar");
}

class background{
    
    constructor(width, height, name){
        this.name = name;
        document.getElementById("workspace").innerHTML = "<canvas id='" + name + "' width='" + width + "' height='" + height + "' style='border: 1px solid black'></canvas>";
        this.canvas = document.getElementById(name);
        this.context = this.canvas.getContext("2d");
        this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
        this.setBGColor("000000");
        
        Draw.Line(this, this.canvas.width / 2, this.canvas.width / 2, 0, this.canvas.height, radarColor, 5);
        Draw.Line(this, this.canvas.width, 0, 0, this.canvas.height, radarColor, 5);
        Draw.Line(this, 0, this.canvas.width, 0, this.canvas.height, radarColor, 5);
        Draw.Line(this, 0, this.canvas.width, this.canvas.height / 2, this.canvas.height / 2, radarColor, 5);
        let r = 250;
        for(let i = 0; i < 4; i++){
            Draw.Circle(this, this.canvas.width / 2, this.canvas.height / 2, r, radarColor);
            r -= 50;
        }
    }
    
    drawPixel(X, Y, color){
        let index = X + (Y * this.canvas.width);
        let RGBA = Convert.fromHexa(color);
        this.imageData.data[(index * 4) + 0] = RGBA.r;
        this.imageData.data[(index * 4) + 1] = RGBA.g;
        this.imageData.data[(index * 4) + 2] = RGBA.b;
        this.imageData.data[(index * 4) + 3] = 255;
        return this.imageData;
    }
    
    setBGColor(color){
        for(let x = 0; x < this.canvas.width; x++){
            for(let y = 0; y < this.canvas.height; y++){
            this.drawPixel(x, y, color);
            }
        }
    }
}

class Convert{
    static fromHexa(hex){
        let r = parseInt("0x" + hex[0] + hex[1]);
        let g = parseInt("0x" + hex[2] + hex[3]);
        let b = parseInt("0x" + hex[4] + hex[5]);
        return {r, g, b};
    }
}

class Draw{
    static Line(canvas, x0, x1, y0, y1, color, dotSpacing){
        if(x0 == x1 && y0 == y1){
            return canvas.context.putImageData(this.drawPixel(x0, y0, color), 0, 0)
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
                    canvas.drawPixel(x0, Math.round(slope*x0 + pitch), color);
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
                    canvas.drawPixel(Math.round(slope*y0 + pitch), y0, color);
                }
                if(y0 % dotSpacing == 0){
                    draw = !draw;
                }
                y0 += sy;
            }
        }
        canvas.drawPixel(x1, y1, color);
        return canvas.context.putImageData(canvas.imageData, 0, 0)
    }
    
    static Circle(canvas, xc, yc, r, color){
        function drawCircle(c, xc, yc, x, y){
        c.drawPixel(xc+x, yc+y, color);
        c.drawPixel(xc-x, yc+y, color);
        c.drawPixel(xc+x, yc-y, color);
        c.drawPixel(xc-x, yc-y, color);
        c.drawPixel(xc+y, yc+x, color);
        c.drawPixel(xc+y, yc-x, color);
        c.drawPixel(xc-y, yc+x, color);
        c.drawPixel(xc-y, yc-x, color);
        }
        let x = 0;
        let y = r;
        let d = 3 - 2 * r;
        drawCircle(canvas, xc, yc, x, y);
        while(y >= x){
            x++;
            if(d > 0){
                y--;
                d = d + 6 * (x - y);
            }
            else {
                d = d + 6 * x;
            }
            drawCircle(canvas, xc, yc, x, y);
        }
        return canvas.context.putImageData(canvas.imageData, 0, 0)
    }
}