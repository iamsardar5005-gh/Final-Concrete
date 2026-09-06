(function(){
  var form = document.getElementById('ac-demo-form');
  var success = document.getElementById('ac-success');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    success.classList.add('show');
  });
})();
