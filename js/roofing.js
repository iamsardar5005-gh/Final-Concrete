document.querySelectorAll('.roof-check button[data-answer]').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.roof-check button[data-answer]').forEach(function(b){b.style.borderColor='';});
    btn.style.borderColor = '#c1652f';
    var result = document.getElementById('check-result');
    if(result){ result.textContent = btn.getAttribute('data-answer'); }
    var progress = document.querySelectorAll('.roof-check .progress span');
    if(progress[1]){ progress[0].classList.remove('active'); progress[1].classList.add('active'); }
  });
});

var demoForm = document.getElementById('demo-form');
if(demoForm){
  demoForm.addEventListener('submit', function(e){
    e.preventDefault();
    var success = document.getElementById('success');
    if(success){ success.style.display = 'block'; }
  });
}

var menuBtn = document.querySelector('.menu');
var navlinks = document.querySelector('.navlinks');
if(menuBtn && navlinks){
  menuBtn.addEventListener('click', function(){
    navlinks.style.display = navlinks.style.display === 'flex' ? 'none' : 'flex';
    navlinks.style.flexDirection = 'column';
    navlinks.style.position = 'absolute';
    navlinks.style.top = '76px';
    navlinks.style.left = '0';
    navlinks.style.right = '0';
    navlinks.style.background = '#fff';
    navlinks.style.padding = '16px 21px';
    navlinks.style.boxShadow = '0 8px 16px #0002';
  });
}
