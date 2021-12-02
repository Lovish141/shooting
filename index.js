const shootingsound=new Audio("./sounds/music_shoooting.mp3");
const killEnemySound = new Audio("./sounds/music_killEnemy.mp3");
const gameOverSound = new Audio("./sounds/music_gameOver.mp3");
const hugeWeaponSound = new Audio("./sounds/music_hugeWeapon.mp3");

const canvas=document.querySelector('canvas');
const context=canvas.getContext('2d');
canvas.height=innerHeight;
canvas.width=innerWidth;
const scoreEl=document.getElementById('scoreEl');
const startbtn=document.getElementById('startbtn');
const mlo=document.getElementById('mlo');
const bigscore=document.getElementById('bigscore');
function gettingDifficulty(){
    return document.getElementById('difficulty').value;
}
let difficultyLevel=gettingDifficulty();
let difficulty=1;
if(difficultyLevel=="Easy"){
    difficulty=1;
}else if(difficultyLevel=="Medium"){
    difficulty=2;
}else{
    difficulty=4;
}

class Player{
    constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle=this.color;
        context.fill();
    }
}
const x=canvas.width/2;
const y=canvas.height/2;
class Projectile{
    constructor(x,y,radius,color,v){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.v=v;
    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle=this.color;
        context.fill();
    }
    update(){
        this.draw();
        this.x=this.x + this.v.x;
        this.y=this.y + this.v.y;
    }
}
class Enemy{
    constructor(x,y,radius,color,v){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.v=v;
    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle=this.color;
        context.fill();
    }
    update(){
        this.draw();
        this.x=this.x + this.v.x;
        this.y=this.y + this.v.y;
    }
}
const fiction=0.97;
class Particle{
    constructor(x,y,radius,color,v){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.v=v;
        this.alpha=1 
    }
    draw(){
        context.save();
        context.globalAlpha=this.alpha;
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle=this.color;
        context.fill();
        context.restore();
    }
    update(){
        this.draw();
        this.v.x*=fiction;
        this.v.y*=fiction;
        this.x=this.x + this.v.x;
        this.y=this.y + this.v.y;
        this.alpha=this.alpha-0.01;
    }
}
class HugeWeapon {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = "rgba(255,0,133,1)";
    }
  
    draw() {
      context.beginPath();
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, 200, canvas.height);
    }
  
    update() {
      this.draw();
      this.x += 20;
    }
  }

let player=new Player(x,y,15,'white');
let projectiles=[];
let enemies=[];
let particles=[];
let hugeWeapon=[];

function init(){
    player=new Player(x,y,15,'white');
    projectiles=[];
    enemies=[];
    particles=[];
    hugeWeapon=[];
    score=0;
    scoreEl.innerHTML=score;
    bigscore.innerHTML=score;
    difficultyLevel=gettingDifficulty();
    if(difficultyLevel=="Easy"){
        difficulty=1;
    }else if(difficultyLevel=="Medium"){
        difficulty=2;
    }else{
        difficulty=4;
    }
}

addEventListener('click',(event)=>
{
    const angle = Math.atan2(event.clientY-y,event.clientX-x);
    const velocity={
       x: 4*Math.cos(angle),
       y:4*Math.sin(angle)
    }
    shootingsound.play();
    projectiles.push(
        
        new Projectile(x,y,5,'white',velocity)
    )
})
let animationid;
let score=0;
function animate(){
    animationid = requestAnimationFrame(animate);
    context.fillStyle='rgba(0,0,0,0.1)';
    context.fillRect(0,0,canvas.width,canvas.height);
    player.draw();
    particles.forEach((particle,index)=>{
        //removing particles when its alpha value decreases to 0
        if(particle.alpha<=0){
            setTimeout(()=>{
                particles.splice(index,1);
            }
            ,0)}else{
            particle.update();
            }
        // particle.update();
         
    })
    hugeWeapon.forEach((hugeweapon, hugeweaponIndex) => {
        if (hugeWeapon.x > canvas.width) {
          hugeWeapon.splice(hugeweaponIndex, 1);
        } else {
          hugeweapon.update();
        }
    });
   projectiles.forEach((projectile,projectileIndex)=>
   {
   projectile.update();
   //Removing projectiles from off screen
   if(projectile.x + projectile.radius < 0 ||projectile.x -projectile.radius >canvas.width || projectile.y + projectile.radius <0 || projectile.y - projectile.radius > canvas.height){
       projectiles.splice(projectileIndex,1);
   }
   });
   
   enemies.forEach((enemy,index)=>{
      enemy.update();   
      const dist=Math.hypot(player.x-enemy.x,player.y-enemy.y);
    //   finding he enemy and hugeweapon collision and killing them
      hugeWeapon.forEach((hugeweapon)=>{
        const disthe=hugeweapon.x-enemy.x;
        if(disthe>=-200 && disthe<=200){
            score+=100;
            setTimeout(()=>{
                enemies.splice(index,1);
            },0)
            scoreEl.innerHTML=score;
        }
    })
      //endgame
      if(dist-player.radius-enemy.radius<1){
          cancelAnimationFrame(animationid);
          gameOverSound.play();
          hugeWeaponSound.pause();
          shootingsound.pause();
          killEnemySound.pause();
          mlo.style.display='block';
          bigscore.innerHTML=score;
      }
      projectiles.forEach((projectile,projectileIndex)=>
   {
       const dist=Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y);
       //projectile when it hits the enmies
       if(dist-projectile.radius-enemy.radius < 1){
           for(let i=0;i<enemy.radius*2;i++){

           particles.push((new Particle(projectile.x,projectile.y,Math.random()*2,enemy.color,{
               x:Math.random()-0.5*(Math.random()*7),y:Math.random()-0.5*(Math.random()*7)
           })))}
           if(enemy.radius -10 > 10){
               score+=100;
               scoreEl.innerHTML=score;
               enemy.radius-=10;
               setTimeout(()=>{
                projectiles.splice(projectileIndex,1);
            },0)
           }
           else{
            setTimeout(()=>{
                killEnemySound.play();
                score+=250;
                scoreEl.innerHTML=score;  
                enemies.splice(index,1);
                projectiles.splice(projectileIndex,1);
            },0)
           }
        
       
       }
   })    
   }
   )
   
}


function spawnEnemies(){
    setInterval(()=>
    { 
        const radius =(Math.random() * 25) +10;
        let x;
        let y;
        if(Math.random()<0.5){
            x= Math.random() <0.5 ? 0-radius :canvas.width + radius ;
            y=Math.random() *canvas.height ; 
        }else{

            x= Math.random()*canvas.width;
            y=Math.random()<0.5? 0-radius :canvas.height +radius; 
        }

        // const x=Math.random() *canvas.width;
        // const y=Math.random()*canvas.height;
        // const radius=30;
        const color=`hsl(${Math.random()*360},50%,50%)`;
        const angle = Math.atan2((canvas.height/2)-y,(canvas.width/2)-x);
        const velocity={
           x: difficulty*Math.cos(angle),
           y: difficulty*Math.sin(angle)
        }
        enemies.push(
            new Enemy(x,y,radius,color,velocity)
        )
    },1000)
}
startbtn.addEventListener('click',()=>
{
    init();
    animate();
    spawnEnemies(); 
    mlo.style.display ='none';  
    
})


addEventListener('keypress',(e)=>{
    if(e.key==" "){
        console.log("spacebar Pressed");
        if (score < 400) {return;}
        else{

        // Decreasing Player Score for using Huge Weapon
        score -= 400;
        // Updating Player Score in Score board in html
        scoreEl.innerHTML = score;
        hugeWeaponSound.play();
        hugeWeapon.push(new HugeWeapon(0, 0));
    }
    }
})

