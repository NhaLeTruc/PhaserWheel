// the game itself
let game;

let gameOptions = {

    // slices configuration
    slices: [
        {
            degrees: 40,
            startColor: 0xff0000,
            endColor: 0xff8800,
            rings: 3,
            iconFrame: 1,
            iconScale: 0.4,
            text: "BANANA",
            enabled: true
        },
        {
            degrees: 40,
            startColor: 0x00ff00,
            endColor: 0x004400,
            rings: 200,
            iconFrame: 0,
            iconScale: 0.4,
            text: "PEAR",
            enabled: true
        },
        {
            degrees: 120,
            startColor: 0xff00ff,
            endColor: 0x0000ff,
            rings: 10,
            text: "BLUE TEXT, WHITE STROKE",
            sliceText: "YOU'LL NEVER\nWIN THIS",
            sliceTextStyle: {
                fontFamily: "Arial Black",
                fontSize: 36,
                color: "#000077",
                align: "center"
            },
            sliceTextStroke: 8,
            sliceTextStrokeColor: "#ffffff",
            enabled: false
        },
        {
            degrees: 40,
            startColor: 0x666666,
            endColor: 0x999999,
            rings: 200,
            iconFrame: 3,
            iconScale: 0.4,
            text: "STRAWBERRY",
            enabled: true
        },
        {
            degrees: 120,
            startColor: 0x000000,
            endColor: 0xffff00,
            rings: 1,
            text: "POO :(",
            sliceText: "💩",
            sliceTextStyle: {
                fontFamily: "Arial Black",
                fontSize: 72
            },
            enabled: false
        }
    ],

    // wheel rotation duration range, in milliseconds
    rotationTimeRange: {
        min: 3000,
        max: 4500
    },

    // wheel rounds before it stops
    wheelRounds: {
        min: 2,
        max: 11
    },

    // degrees the wheel will rotate in the opposite direction before it stops
    backSpin: {
        min: 1,
        max: 4
    },

    // wheel radius, in pixels
    wheelRadius: 240,

    // color of stroke lines
    strokeColor: 0xffffff,

    // width of stroke lines
    strokeWidth: 5
}

// once the window loads...
window.onload = function() {

    // game configuration object
    let gameConfig = {

        // resolution and scale mode
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 600,
            height: 600
        },

       // game background color
       backgroundColor: 0x000000,

       // scenes used by the game
       scene: [playGame]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame
    window.focus()
}

// PlayGame scene
class playGame extends Phaser.Scene{

    // constructor
    constructor(){
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload(){

        // loading pin image
        this.load.image("pin", "pin.png");

        // loading icons spritesheet
        this.load.spritesheet("icons", "icons.png", {
            frameWidth: 256,
            frameHeight: 256
        });

    }

    // method to be executed once the scene has been created
    create(){

        // starting degrees
        let startDegrees = -90;

        // making a graphic object without adding it to the game
        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        // this array will contain the allowed degrees
        this.allowedDegrees = [];

        // adding a container to group wheel and icons
        this.wheelContainer = this.add.container(game.config.width / 2, game.config.height / 2);

        // array which will contain all icons
        let iconArray = [];

        // looping through each slice
        for(let i = 0; i < gameOptions.slices.length; i++){

            // if the slice is enabled, that is if the prize can be won...
            if(gameOptions.slices[i].enabled){

                // ... we insert all slice degrees into allowedDegrees array
                for(let j = 0; j < gameOptions.slices[i].degrees; j ++){
                    this.allowedDegrees.push(270 - startDegrees - j);
                }
            }

            // converting colors from 0xRRGGBB format to Color objects
            let startColor = Phaser.Display.Color.ValueToColor(gameOptions.slices[i].startColor);
            let endColor = Phaser.Display.Color.ValueToColor(gameOptions.slices[i].endColor)

            for(let j = gameOptions.slices[i].rings; j > 0; j--){

                // interpolate colors
                let ringColor = Phaser.Display.Color.Interpolate.ColorWithColor(startColor,endColor, gameOptions.slices[i].rings, j);

                // converting the interpolated color to 0xRRGGBB format
                let ringColorString = Phaser.Display.Color.RGBToString(Math.round(ringColor.r), Math.round(ringColor.g), Math.round(ringColor.b), 0, "0x");

                // setting fill style
                graphics.fillStyle(ringColorString, 1);

                // drawing the slice
                graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, j * gameOptions.wheelRadius / gameOptions.slices[i].rings, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees), false);

                // filling the slice
                graphics.fillPath();
            }

            // setting line style
            graphics.lineStyle(gameOptions.strokeWidth, gameOptions.strokeColor, 1);

            // drawing the biggest slice
            graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees), false);

            // stroking the slice
            graphics.strokePath();

            // add the icon, if any
            if(gameOptions.slices[i].iconFrame != undefined){

                // icon image
                let icon = this.add.image(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), "icons", gameOptions.slices[i].iconFrame);

                // scaling the icon according to game preferences
                icon.scaleX = gameOptions.slices[i].iconScale;
                icon.scaleY = gameOptions.slices[i].iconScale;

                // rotating the icon
                icon.angle = startDegrees + gameOptions.slices[i].degrees / 2 + 90;

                // add icon to iconArray
                iconArray.push(icon);
            }

            // add slice text, if any
            if(gameOptions.slices[i].sliceText != undefined){

                // the text
                let text = this.add.text(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.slices[i].sliceText, gameOptions.slices[i].sliceTextStyle);

                // set text origin to its center
                text.setOrigin(0.5, 0);

                // set text angle
                text.angle = startDegrees + gameOptions.slices[i].degrees / 2 + 90;

                // stroke text, if required
                if(gameOptions.slices[i].sliceTextStroke && gameOptions.slices[i].sliceTextStrokeColor){
                    text.setStroke(gameOptions.slices[i].sliceTextStrokeColor, gameOptions.slices[i].sliceTextStroke);
                }

                // add text to iconArray
                iconArray.push(text);
            }

            // updating degrees
            startDegrees += gameOptions.slices[i].degrees;

        }

        // generate a texture called "wheel" from graphics data
        graphics.generateTexture("wheel", (gameOptions.wheelRadius + gameOptions.strokeWidth) * 2, (gameOptions.wheelRadius + gameOptions.strokeWidth) * 2);

        // creating a sprite with wheel image as if it was a preloaded image
        let wheel = this.add.sprite(0, 0, "wheel");

        // adding the wheel to the container
        this.wheelContainer.add(wheel);

        // adding all iconArray items to the container
        this.wheelContainer.add(iconArray);

        // adding the pin in the middle of the canvas
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");

        // adding the text field
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 20, "Spin the wheel", {
            font: "bold 32px Arial",
            align: "center",
            color: "white"
        });

        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);
    }

    // function to spin the wheel
    spinWheel(){

        // can we spin the wheel?
        if(this.canSpin){

            // resetting text field
            this.prizeText.setText("");

            // the wheel will spin round for some times. This is just coreography
            let rounds = Phaser.Math.Between(gameOptions.wheelRounds.min, gameOptions.wheelRounds.max);

            // then will rotate by a random amount of degrees picked among the allowed degrees. This is the actual spin
            let degrees = Phaser.Utils.Array.GetRandom(this.allowedDegrees);

            // then will rotate back by a random amount of degrees
            let backDegrees = Phaser.Math.Between(gameOptions.backSpin.min, gameOptions.backSpin.max);

            // before the wheel ends spinning, we already know the prize
            let prizeDegree = 0;

            // looping through slices
            for(let i = gameOptions.slices.length - 1; i >= 0; i--){

                // adding current slice angle to prizeDegree
                prizeDegree += gameOptions.slices[i].degrees;

                // if it's greater than the random angle...
                if(prizeDegree > degrees){

                    // we found the prize
                    var prize = i;
                    break;
                }
            }

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel container to tween targets
                targets: [this.wheelContainer],

                // angle destination
                angle: 360 * rounds + degrees + backDegrees,

                // tween duration
                duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max),

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function(tween){

                    // another tween to rotate a bit in the opposite direction
                    this.tweens.add({
                        targets: [this.wheelContainer],
                        angle: this.wheelContainer.angle - backDegrees,
                        duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max) / 2,
                        ease: "Cubic.easeIn",
                        callbackScope: this,
                        onComplete: function(tween){

                            // displaying prize text
                            this.prizeText.setText(gameOptions.slices[prize].text);

                            // player can spin again
                            this.canSpin = true;
                        }
                    })
                }
            });
        }
    }
}
