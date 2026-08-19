
const menu=document.querySelector('.menu'), nav=document.querySelector('.navlinks');
menu?.addEventListener('click',()=>nav?.classList.toggle('open'));
document.querySelectorAll('.slab-check button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.getElementById('check-result').textContent=btn.dataset.answer;
    document.querySelectorAll('.slab-check button').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});
document.getElementById('demo-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('success').style.display='block';
});
