(function(){
  var form = document.getElementById('cs-demo-form');
  var success = document.getElementById('cs-success');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    success.classList.add('show');
  });
})();
