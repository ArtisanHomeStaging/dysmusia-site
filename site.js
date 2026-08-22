// The Dysmusia Project — shared site behavior

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector('.mobile-toggle');
  var navlinks = document.querySelector('.navlinks');
  if (toggle && navlinks) {
    toggle.addEventListener('click', function () {
      navlinks.classList.toggle('open');
    });
    // On mobile, tapping a dropdown label expands it in place instead of hovering
    document.querySelectorAll('.navgroup > button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.innerWidth > 900) return; // desktop uses hover
        btn.parentElement.classList.toggle('open');
      });
    });
  }

  // ---- Accordion (activities.html) ----
  document.querySelectorAll('.acc-item > button').forEach(function (btn) {
    var item = btn.parentElement;
    var panel = item.querySelector('.acc-panel');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close others for a single-open accordion feel
      document.querySelectorAll('.acc-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.acc-panel').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  // ---- Capture forms → Formspree (AJAX, no page reload) ----
  document.querySelectorAll('.capture-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action');

      // If the form hasn't been pointed at a real Formspree endpoint yet,
      // just show the success state so the mockup still feels complete.
      if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
        form.classList.add('submitted');
        return;
      }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.classList.add('submitted');
          } else {
            response.json().then(function (data) {
              console.error('Form submission error:', data);
              alert('Something went wrong sending that — please try again.');
            });
          }
        })
        .catch(function (err) {
          console.error('Form submission error:', err);
          alert('Something went wrong sending that — please try again.');
        });
    });
  });

});
