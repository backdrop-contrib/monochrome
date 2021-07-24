(function ($) {
  $(document).ready(function() {
    const strings = {
      buttonTextLight: Backdrop.t('Dark mode'),
      titleTextLight: Backdrop.t('Switch to dark mode'),
      buttonTextDark: Backdrop.t('Light mode'),
      titleTextDark: Backdrop.t('Switch to light mode')
    };

    const dmButton = '<input id="darkmode-toggle" type="button" title="" value="">';
    $('body').append(dmButton);

    var dmValue = localStorage.getItem('monochromeDarkMode');
    if (dmValue === '1') {
      $('body').addClass('dark-mode');
      $('#darkmode-toggle').attr('title', strings.titleTextDark);
      $('#darkmode-toggle').attr('value', strings.buttonTextDark);
    }
    else {
      $('#darkmode-toggle').attr('title', strings.titleTextLight);
      $('#darkmode-toggle').attr('value', strings.buttonTextLight);
    }

    // It takes some time until CKEditor initializes, so we add a short delay.
    // This is sort of unreliable, though. And a bit ugly because of the
    // delayed switch.
    if (dmValue == true) {
      window.setTimeout(function () {
        $('iframe.cke_wysiwyg_frame').contents().find('body').addClass('dark-mode');
      }, 1000);
    }

    $('#darkmode-toggle').on('click', function() {
      dmValue = localStorage.getItem('monochromeDarkMode');
      if (dmValue === null) {
        localStorage.setItem('monochromeDarkMode', '1');
        mode = 'dark';
      }
      else {
        localStorage.removeItem('monochromeDarkMode');
        mode = 'light';
      }
      $(window).monochromeUpdateMode(mode, strings);
    });
  });

  $.fn.monochromeUpdateMode = function(mode, strings) {
    if (mode === 'dark') {
      $('body').addClass('dark-mode');
      $('#darkmode-toggle').attr('title', strings.titleTextDark);
      $('#darkmode-toggle').attr('value', strings.buttonTextDark);
      $('iframe.cke_wysiwyg_frame').contents().find('body').addClass('dark-mode');
    }
    else {
      $('body').removeClass('dark-mode');
      $('#darkmode-toggle').attr('title', strings.titleTextLight);
      $('#darkmode-toggle').attr('value', strings.buttonTextLight);
      $('iframe.cke_wysiwyg_frame').contents().find('body').removeClass('dark-mode');
    }
    // Force the browser to rerender without reloading anything.
    // @todo Get rid of inline style when not needed?
    $('body').css('visibility','hidden');
    $('body').css('visibility','visible');
  }
})(jQuery);
