(function ($) {

  'use strict';

  var monochromeDarkMode = monochromeDarkMode || {};

  Backdrop.behaviors.monochromeDarkMode = {
    attach: function (context, settings) {

      var strings = {
        buttonTextLight: Backdrop.t('Dark mode'),
        titleTextLight: Backdrop.t('Switch to dark mode'),
        buttonTextDark: Backdrop.t('Light mode'),
        titleTextDark: Backdrop.t('Switch to light mode')
      };

      var dmButton = '<input id="darkmode-toggle" type="button" title="" value="">';
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
        var mode = 'light';
        dmValue = localStorage.getItem('monochromeDarkMode');
        if (dmValue === null) {
          localStorage.setItem('monochromeDarkMode', '1');
          mode = 'dark';
        }
        else {
          localStorage.removeItem('monochromeDarkMode');
        }
        monochromeDarkMode.updateMode(mode, strings);
      });

      // It takes some time until CKEditor initializes, so we do some polling.
      // That's not 100% reliable, too, but better than adding a huge timeout.
      if (dmValue === '1') {
        // Skip polling if we clearly have no CKEditor on that page.
        if (typeof settings.filter != 'undefined') {
          monochromeDarkMode.waitForCke();
        }
      }
    }
  };

  monochromeDarkMode.updateMode = function(mode, strings) {
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
    $('body').css('visibility','hidden');
    $('body').css('visibility','visible');
  };

  monochromeDarkMode.waitForCke = function () {
    var run = 1;
    // The initial timeout is longer, CKE won't be initializing that fast.
    var timeout = 800;

    // Self-calling polling function.
    (function checkCke(run, timeout) {
      window.setTimeout(function () {
        timeout = 150;
        var ckeBody = $('iframe.cke_wysiwyg_frame').contents().find('body.cke_editable');
        if (ckeBody.length > 0) {
          ckeBody.addClass('dark-mode');
        }
        else if (run < 6) {
          run += 1;
          checkCke(run, timeout);
        }
      }, timeout);
    })(run, timeout);
  };

})(jQuery);
