(function(){
  "use strict";

  // Care tabs
  var tabs = document.querySelectorAll('.care-tab');
  var panels = {
    'tab-first': document.getElementById('panel-first'),
    'tab-checkup': document.getElementById('panel-checkup'),
    'tab-treatment': document.getElementById('panel-treatment'),
    'tab-emergency': document.getElementById('panel-emergency')
  };

  function activateTab(tab){
    tabs.forEach(function(t){
      var selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
    });
    Object.keys(panels).forEach(function(id){
      var panel = panels[id];
      var match = id === tab.id;
      panel.hidden = !match;
      panel.classList.toggle('is-active', match);
    });
  }

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){ activateTab(tab); });
    tab.addEventListener('keydown', function(e){
      var idx = Array.prototype.indexOf.call(tabs, tab);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        e.preventDefault();
        var next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
        activateTab(tabs[next]);
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;
      btn.setAttribute('aria-expanded', String(!expanded));
      answer.style.maxHeight = expanded ? '0px' : answer.scrollHeight + 'px';
    });
  });

  // Demo appointment form — no data transmitted
  var form = document.getElementById('appointment-form');
  var success = document.getElementById('form-success');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.checkValidity()){
        form.reportValidity();
        return;
      }
      success.classList.add('is-visible');
      success.setAttribute('tabindex','-1');
      success.focus();
      form.reset();
    });
  }
})();
