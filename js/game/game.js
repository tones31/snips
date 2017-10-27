'use strict';

////////////////////////////////////////////
// Utilities
////////////////////////////////////////////

class ConsoleLogger{
    constructor(name, enabled = true){
        this.name = name;
        this.enabled = enabled;
        return this;
    }

    _log(type, message){
        let msg = this.name + ': ' + message;
        switch(type){
            case 'log':
                console.log(msg);
                break;
            case 'debug':
                console.info(msg);
                break;
            case 'warn':
                console.warn(msg);
                break;
            case 'error':
                console.error(msg);
                break;
        }
    }
    
    log(message){
        this._log('log', message);
    }

    debug(message){
        this._log('debug', message);
    }

    warn(message){
        this._log('warn', message);
    }

    error(message){
        this._log('error', message);
    }
}

class Interval {

    constructor(interval, onTick){
        this.interval = interval;
        this.onTick = onTick || function(){};
        this.timer = false;
        this.ticks = 0;
        this.startTime = 0;
        this.currentTime = 0;
        this.elapsedTime = 0;
        return this;
    }

    run(){
        this.currentTime = performance.now();
        if(!this.startTime){
            this.startTime = this.currentTime;
        }

        this.onTick();

        let nextTick = this.interval - (this.currentTime - (this.startTime + (this.ticks * this.interval)));
        //console.log(nextTick);
        this.ticks++;

        let self = this;
        this.timer = setTimeout(function(){
            self.run();
        }, nextTick);

        return this;
    }

    start(){
        this.run();
        return this;
    }

    stop(){
        clearTimeout(this.timer);
        return this;
    }
}

class Clock extends Interval {

    constructor(callback = function(){}){
        super(1000, callback);
        let self = this;
        this.time = 0;
        this.onTick = function(){
            self.time = Date.now();
        };
    }
}

class Grid {

    constructor(rows, cols){
        this.table = [];
        this.rows = rows;
        this.cols = cols;
        this.build();
        return this;
    }
    
    build(){
        for (let x = 0; x < this.cols; x++) {
            let row = [];
            for (let y = 0; y < this.cols; y++) {
                row.push(0);
            }
            this.table.push(row);
        }
        return this;
    } 
    
    isTouching(x1, y1, x2, y2) {
        let deltaX = x1 - x2;
        let deltaY = y1 - y2;      
        return ((deltaX === 0 || deltaX === 1 || deltaX === -1) && (deltaY === 0 || deltaY === 1 || deltaY === -1));
      }
      
}

class HexGrid extends Grid {

    constructor(rows, cols){
        super(rows, cols);

        return this
    }

    isTouchingHex(x1, y1, x2, y2) {
        let deltaX = x1 - x2;
        let deltaY = y1 - y2;
    
        // check same x
        if (deltaX === 0) {
            switch (deltaY) {
                // check bottom right
                case -1:
                // check bottom
                case -2:
                // check top right
                case 1:
                // check above
                case 2:
                    return true;
                    break;
            }
        } 
        else if (deltaX === 1) {
            switch (deltaY) {
                // check bottom left
                case -1:
                // check top left
                case 1:
                    return true;
                    break;
            }
        }
    
        return false;
    }
}

console.log(new Grid(10, 9).table)

////////////////////////////////////////////
// Players
////////////////////////////////////////////

class Player {
    constructor(){
        this.name = "Player";
        return this;
    }
}

class HumanPlayer extends Player{
    constructor(){
        super();
        return this;
    }
}

class BotPlayer extends Player {
    constructor(){
        super();
        this.name = "Bot";
        return this;
    }
}

////////////////////////////////////////////
// Game
////////////////////////////////////////////

class Vector3 {
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getZ(){
        return this.z;
    }
}

class FpsMeter {

    constructor(){
    }

    _fpsIntervalCallback(){

    }
    
    increaseFpsFrame(){
        this.frames++;
        return this;
    }

    getFps(){
        return Math.round(this.fps);
    }

    start(){
        this.fpsInterval.start();
        return this;
    }

    stop(){
        this.fpsInterval.stop();
        return this;
    }
}

class GameRenderer {

    constructor(canvas){
        let self = this;
        
        let _canvas = typeof(canvas) === 'string' ? document.getElementById(canvas) : canvas;
        if(!_canvas || !_canvas.getContext){
            throw new Error('GameRenderer.constructor: incompatible browser - cannot use canvas element');
        }

        this.canvas = {
            element : _canvas,
            ctx2d : _canvas.getContext('2d'),
            ctx3d : _canvas.getContext('3d'),
            height : _canvas.clientHeight,
            width : _canvas.clientWidth
        };


        this.loop = null;
        this.frame = 0;
        this.drawDelay = 1000 / this.maxFps;

        // fps
        this.maxfps = 60;
        this.averageFps = 0;
        this.fps = 0;
        this.fpsFrame = 0;
        this.fpsInterval = new Interval(1000, function(){
            self.fps = self.fpsFrame;
            self.fpsFrame = 0;
        });
        
        this.view = {
            bottomleft :  new Vector3(0, 0, 0),
            bottomright :  new Vector3(this.canvas.width, 0, 0),
            topright :  new Vector3(this.canvas.width, this.canvas.height, 0),
            topleft :  new Vector3(0, this.canvas.height, 0)
        };

        this.log = new ConsoleLogger('GameRenderer');
        this.setFont('32px serif');

        return this;
    }

    // render

    render(){
        //this.log.debug('render');
        this.canvas.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frame++;
        this.fpsFrame++;
        this.renderDebug();
        return this;
    }

    renderDebug(){
        this.canvas.ctx2d.fillText(this.getAverageFps(), 20, 20);
        this.canvas.ctx2d.fillText(this.fps, 100, 20);
        this.canvas.ctx2d.fillText(this.frame, 180, 20);
        this.canvas.ctx2d.fillText(this.getElapsedMs(), 300, 20);
        return this;
    }

    getElapsedMs(){
        return performance.now();
    }

    // fps

    getAverageFps(){
        return this.averageFps = Math.round(this.frame / (this.getElapsedMs() / 1000));
    }

    // control

    start(){
        let self = this;
        this.loop = setInterval(this.render.bind(this), this.drawDelay);
        this.fpsInterval.start();
        return this;
    }

    stop(){
        clearInterval(this.loop);
        this.fpsInterval.stop();
        return this;
    }

    pause(){
        clearInterval(this.loop);
        this.fpsInterval.stop();
        return this;
    }

    // stats

    toggleFps(state){
        if(state){
            
        }
        else {
            
        }
    }

    setFont(font){
        this.canvas.ctx2d.font = font;
    }

}

class GameObject {
    constructor(){
        this.name = "GameObject";
        this.speed = 0;
        this.position = new Vector3();
        this.velocity = new Vector3();
        return this;
    }
}

class Game {
    constructor(canvas){
        this.renderer = new GameRenderer(canvas);
        this.clock = new Clock().start();
        this.name = "Game";
        this.turn = 0;
        this.maxTurns = 0;
        this.players = {};
        this.humans = {};
        this.bots = {};
        return this;
    }

    createHumanPlayer(options){
        let human = new HumanPlayer(options);
        this.humans[options.name] = human;
        return this;
    }

    createBotPlayer(options){
        let bot = new BotPlayer(options);
        this.bots[options.name] = bot;
        return this;
    }
}

let game = new Game('gameCanvas');
game.renderer.start();