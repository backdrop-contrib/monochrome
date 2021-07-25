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

    // It takes some time until CKEditor initializes, so we do some polling.
    // That's not 100% reliable, too, but better than adding a huge timeout.
    if (dmValue == true) {
      let textareas = $('textarea');
      // We can not know if CKEditor is active on that page, but at least we can
      // skip polling if there's not even a textarea;
      if (textareas.length > 0) {
        $(window).monochromeWaitForCke();
      }
    }

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
  };

  $.fn.monochromeWaitForCke = function () {
    var run = 1;
    // The initial timeout is longer.
    var timeout = 800;

    // Self-calling polling function.
    (function checkCke(run, timeout) {
      window.setTimeout(function () {
        timeout = 150;
        ckeBody = $('iframe.cke_wysiwyg_frame').contents().find('body.cke_editable');
        if (ckeBody.length > 0) {
          ckeBody.addClass('dark-mode');
        }
        else if (run < 5) {
          run += 1;
          checkCke(run, timeout);
        }
      }, timeout);
    })(run, timeout);
  };

})(jQuery);
