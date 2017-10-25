'use strict';

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
        this.current = 0;
        this.lastDraw = 0;
        this.frame = 0;
        //this.fpsInterval = new Interval(this.drawDelay, this._fpsIntervalCallback.bind(this));
        this.ms = 0;
        //this.msInterval = new Interval(1, this._msIntervalCallback.bind(this));
    }

    _fpsIntervalCallback(){

    }

    _msIntervalCallback(){
        this.ms = this.ms === 1000 ? 0 : this.ms + 1;
    }
    
    increaseFpsFrame(){
        this.lastDraw = this.ms;
        if(this.ms === 0){
            this.frame = 1;
        }
        else {
            this.frame++;
        }
        return this;
    }

    getCurrentFps(){
        return Math.round(this.current);
    }

    start(){
        this.fpsInterval.start();
        this.msInterval.start();
        return this;
    }

    stop(){
        this.fpsInterval.stop();
        this.msInterval.stop();
        return this;
    }
}

class GameRenderer {

    constructor(canvas){
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
        this.maxfps = 60;
        this.averageFps = 0;
        this.fpsMeter = new FpsMeter();
        this.frame = 0;
        this.drawDelay = 1000 / this.maxFps;
        this.elapsedMs = 0;
       // this.elapsedMsInterval = new Interval(1);
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
        this.renderDebug();
        return this;
    }

    renderDebug(){
        this.fpsMeter.increaseFpsFrame();
        this.canvas.ctx2d.fillText(this.getAverageFps(), 20, 20);
        this.canvas.ctx2d.fillText(this.fpsMeter.getCurrentFps(), 100, 20);
        this.canvas.ctx2d.fillText(this.fpsMeter.ms, 180, 20);
        this.canvas.ctx2d.fillText(this.frame, 260, 20);
        this.canvas.ctx2d.fillText(this.elapsedMs, 320, 20);
        return this;
    }

    // fps

    getAverageFps(frame, elapsedMs){
        return Math.round(this.averageFps = this.frame / this.elapsedMs);
    }

    trackFps(state){
        if(state){
            this.fpsMeter.start();
        }
        else {
            this.fpsMeter.stop();
        }
        return this;
    }

    // control

    start(){
        let self = this;
        this.trackFps(true);
        this.loop = setInterval(this.render.bind(this), this.frames);
        this.elapsedMsInterval = setInterval(function(){
            self.elapsedMs += 1;
        }, 1);
        return this;
    }

    stop(){
        this.trackFps(false);
        clearInterval(this.loop);
        clearInterval(this.elapsedMsInterval);
        return this;
    }

    pause(){
        this.trackFps(false);
        clearInterval(this.loop);
        clearInterval(this.elapsedMsInterval);
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

class GameObject {
    constructor(){
        this.name = "GameObject";
        this.speed = 0;
        this.position = new Vector3();
        this.velocity = new Vector3();
        return this;
    }
}

let game = new Game('gameCanvas');
game.renderer.start();