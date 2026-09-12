(function(){
  var form = document.getElementById('cs-demo-form');
  var success = document.getElementById('cs-success');
  if(!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;
    var fields = form.querySelectorAll('input[required]');
    fields.forEach(function(field){
      var err = form.querySelector('.err[data-for="' + field.id + '"]');
      var ok = field.checkValidity();
      if(err) err.classList.toggle('show', !ok);
      field.classList.toggle('cs-invalid', !ok);
      if(!ok) valid = false;
    });
    if(!valid){
      success.classList.remove('show');
      return;
    }
    success.classList.add('show');
    form.reset();
  });

  form.querySelectorAll('input[required]').forEach(function(field){
    field.addEventListener('input', function(){
      var err = form.querySelector('.err[data-for="' + field.id + '"]');
      if(field.checkValidity()){
        field.classList.remove('cs-invalid');
        if(err) err.classList.remove('show');
      }
    });
  });
})();
