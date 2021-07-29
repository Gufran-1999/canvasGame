const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const scoreEl=document.querySelector("#scoreEl");
console.log(canvas);
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  }
}
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enimie {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const friction=0.98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha=1;
  }
  draw() {
    c.save();
    c.globalAlpha=this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x*=friction;
    this.velocity.y*=friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha-=0.01;
  }
}
const x = canvas.width / 2;
const y = canvas.height / 2;
const projectiles = [];
const enimies = [];
const particles=[];
const player = new Player(x, y, 30, "white");
let animationId;
let score=0;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle,ind)=>{
    if(particle.alpha<=0)
    {
      particles.splice(ind,1);
    }
    else
    {
     particle.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enimies.forEach((enimie, enimeIndex) => {
    enimie.update();
    const dist = Math.hypot(player.x - enimie.x, player.y - enimie.y);
    if (dist - player.radius - enimie.radius < 1) {
      cancelAnimationFrame(animationId);
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enimie.x, projectile.y - enimie.y);
      if (dist - projectile.radius - enimie.radius < 1) {
        score+=100;
        scoreEl.innerHTML=score;
        for(let i=0;i<enimie.radius*2;i++)
        {
          particles.push(new Particle(enimie.x,enimie.y,Math.random()*2,enimie.color,{
            x:(Math.random()-0.5)*6,
            y:(Math.random()-0.5)*6
          }))
        }
        if (enimie.radius > 20) {
          gsap.to(enimie,{
            radius:enimie.radius - 10,
          })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enimies.splice(enimeIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}
function spawnEnimies() {
  setInterval(() => {
    const radius = Math.random() * 25 + 5;
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y);
    enimies.push(
      new Enimie(x, y, radius, color, {
        x: Math.sin(angle),
        y: Math.cos(angle),
      })
    );
  }, 1000);
}
window.addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientX - canvas.width / 2,
    event.clientY - canvas.height / 2
  );
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", {
      x: Math.sin(angle) * 5,
      y: Math.cos(angle) * 5,
    })
  );
});
animate();
spawnEnimies();
