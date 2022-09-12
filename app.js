let doodler
let board = document.querySelector('.board')
let leftPosition
let startingPoint
let bottomPosition
let doodlerWidth = 20
let doodlerHeight = 40

let boardWidth = 300
let boardHeight = 600
let platWidth = 60
let platHeight = 20
let platNum = 10
let platArray = []


let upTimerId
let downTimerId
let leftTimerId
let rightTimerId
let movePlatformsId

let isjumping = false
let moveDirection =''


let gameOver = false



function createDoodler() {
    doodler = document.createElement('div')
    doodler.classList.add('doodler')
    board.appendChild(doodler)
    leftPosition = platArray[0].left
    doodler.style.left = leftPosition + (platWidth-doodlerWidth)/2 + 'px'
    bottomPosition = 20
    doodler.style.bottom = bottomPosition + 'px'

    let img = document.createElement('img')
    img.src = './images/doodle.png'
    img.classList.add('doodleImage')
    doodler.appendChild(img)
}

function createPlatform() {
    for (let i = platArray.length; i < platNum; i++) {
        let platbottom = boardHeight/platNum*i
        let platform = new Platform(platbottom)
        platArray.push(platform)
        console.log(platArray)
    }
    
}

function movePlatforms(){
    if(bottomPosition > 20){
        platArray.forEach(platform => {
            platform.bottom-=5
            platform.visual.style.bottom = platform.bottom + 'px'

            if(platform.bottom < 0){
                platform.visual.remove()
                platArray.shift()

                let newPlatform = new Platform(boardHeight)
                platArray.push(newPlatform)
            }
        });


    } else {
        gameOver = true
        console.log('game over')
        clearInterval(movePlatformsId)
    }
}

class Platform{
    constructor(platbottom){
        this.left = Math.random()*(boardWidth-platWidth)
        this.bottom = platbottom
        this.visual = document.createElement('div')

        let visual = this.visual
        visual.classList.add('platform')
        board.appendChild(visual)
        visual.style.left = this.left + 'px'
        visual.style.bottom = this.bottom + 'px'
    }
}

function controls(e){
    if(e.key === 'ArrowUp'){
        //move up
        if(!isjumping){
            jump()
            movePlatformsId = setInterval(movePlatforms,30)
            console.log('up')
        } else{
            //move straight
            clearInterval(rightTimerId)
            clearInterval(leftTimerId)
        }

    } else if(e.key === 'ArrowLeft'){
        //move left
        if(moveDirection != 'left' && !gameOver){
            clearInterval(rightTimerId)
            clearInterval(leftTimerId)
            moveLeft()
        }
    }else if(e.key === 'ArrowRight'){
        //move right
        if(moveDirection != 'right' && !gameOver){
            clearInterval(leftTimerId)
            clearInterval(rightTimerId)
            moveRight()
        }

    }
}

function jump(){
    if(isjumping == false){
        isjumping = true
        clearInterval(downTimerId)
        startingPoint = bottomPosition
        upTimerId = setInterval(() => {
            bottomPosition += 10
            doodler.style.bottom = bottomPosition + 'px'
    
            if(
                (bottomPosition>startingPoint + 300) ||
                (bottomPosition + doodlerHeight) > boardHeight
                ){
                fall()
            }
            
        },30);
    }
}

function fall(){
    isjumping = false
    clearInterval(upTimerId)
    downTimerId = setInterval(() => {
        bottomPosition -=10
        doodler.style.bottom = bottomPosition + 'px'

        platArray.forEach(platform =>{
            if(
                (bottomPosition >= platform.bottom) && 
                (bottomPosition <= platform.bottom+platHeight) &&
                ((leftPosition + doodlerWidth) >= platform.left) && 
                (leftPosition <= (platform.left + platWidth)) &&
                !isjumping
                
                ){
                jump()
            }
        })

        if(bottomPosition<0){
            clearInterval(downTimerId)
            clearInterval(rightTimerId)
            clearInterval(leftTimerId)
            endGame()
        }
    },30)
}

function moveLeft(){
    if(moveDirection != 'left' && !gameOver){
        moveDirection = 'left'
        clearInterval(rightTimerId)
        leftTimerId = setInterval(()=>{
            clearInterval(rightTimerId)
            leftPosition -=5
            doodler.style.left = leftPosition + 'px'
            console.log('left')
            if(leftPosition<=0){
                clearInterval(leftTimerId)
                moveRight()
            }
        },30)
    }
}

function moveRight(){
    if(moveDirection != 'right' && !gameOver){
        moveDirection = 'right'
        clearInterval(leftTimerId)
        rightTimerId = setInterval(()=>{
            clearInterval(leftTimerId)
            leftPosition +=5
            doodler.style.left = leftPosition + 'px'
            console.log('right')
            if(leftPosition>=boardWidth-doodlerWidth){
                clearInterval(rightTimerId)
                moveLeft()
            }
        },30)
    }
}








// start game

function startGame(){
    if(gameOver == false){
        createPlatform()
        createDoodler()
        document.addEventListener('keydown',controls)
    } 
    else {
        
    }
}

function endGame(){
    gameOver = true
    clearInterval(downTimerId)
    console.log('game over!')

}

startGame()