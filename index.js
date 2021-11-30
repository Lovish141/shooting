const canvas=document.querySelector('canvas');
const context=canvas.getContext('2d');
canvas.height=innerHeight;
canvas.width=innerWidth;
const scoreEl=document.getElementById('scoreEl');
const startbtn=document.getElementById('startbtn');
const mlo=document.getElementById('mlo');
const bigscore=document.getElementById('bigscore');
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
let player=new Player(x,y,15,'white');
let projectiles=[];
let enemies=[];
let particles=[];
function init(){
    player=new Player(x,y,15,'white');
    projectiles=[];
    enemies=[];
    particles=[];
    score=0;
    scoreEl.innerHTML=score;
    bigscore.innerHTML=score;
}

addEventListener('click',(event)=>
{
    const angle = Math.atan2(event.clientY-y,event.clientX-x);
    const velocity={
       x: 4*Math.cos(angle),
       y:4*Math.sin(angle)
    }
    
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
      //endgame
      if(dist-player.radius-enemy.radius<1){
          cancelAnimationFrame(animationid);
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
                score+=250;
                scoreEl.innerHTML=score;  
                enemies.splice(index,1);
                projectiles.splice(projectileIndex,1);
            },0)
           }
        //    setTimeout(()=>{
        //        enemies.splice(index,1);
        //        projectiles.splice(projectileIndex,1);
        //    },0)
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
           x: Math.cos(angle),
           y:Math.sin(angle)
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

