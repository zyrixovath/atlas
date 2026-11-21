export function drawStars(canvas){
 const ctx=canvas.getContext("2d");let w,h,stars=[];
 function resize(){w=canvas.width=canvas.clientWidth*devicePixelRatio;h=canvas.height=canvas.clientHeight*devicePixelRatio;stars=Array.from({length:220},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+.2,a:Math.random()*.65+.2,s:Math.random()*.25+.04}));}
 function frame(){ctx.clearRect(0,0,w,h);for(const p of stars){p.y+=p.s;if(p.y>h)p.y=0;ctx.globalAlpha=p.a;ctx.fillStyle="#b9eaff";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;requestAnimationFrame(frame);}
 new ResizeObserver(resize).observe(canvas);resize();frame();
}
export function drawOrbit(canvas,selected="Earth"){
 const ctx=canvas.getContext("2d"),w=canvas.width=canvas.clientWidth*devicePixelRatio,h=canvas.height=canvas.clientHeight*devicePixelRatio;
 const cx=w/2,cy=h/2,scale=Math.min(w,h)*.43/9.5;
 ctx.clearRect(0,0,w,h);
 for(let i=1;i<=8;i++){ctx.strokeStyle="rgba(56,189,248,.16)";ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,i*scale,i*scale*.66,0,0,Math.PI*2);ctx.stroke();}
 const bodies=[["Sun",0,"#ffc66d"],["Mercury",.6,"#a8a29e"],["Venus",1.1,"#e8bd8a"],["Earth",1.5,"#38bdf8"],["Mars",2.0,"#fb8067"],["Jupiter",3.1,"#d6b18b"],["Saturn",4.1,"#e6d19b"],["Uranus",5.1,"#8ce7e9"],["Neptune",6.1,"#668dff"]];
 bodies.forEach(([name,r,color],i)=>{let a=Date.now()/90000+i*.9,x=cx+Math.cos(a)*r*scale,y=cy+Math.sin(a)*r*scale*.66;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y,i===0?8:Math.max(3,6-i*.35),0,7);ctx.fill();ctx.shadowBlur=0;if(name!=="Sun"){ctx.fillStyle="#b7c6d8";ctx.font=`${11*devicePixelRatio}px sans-serif`;ctx.fillText(name,x+9,y-8);}});
}
