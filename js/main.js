+function ($) {
  'use strict';

  var navbarHandle = $('.navbar-mobile-handle');
  var is_mobile = navbarHandle.css('display') == 'none' ? false : true;

  $('.mobile-handle').click(function (e) {
    var links = $('header.primary nav.primary .links')
    if(links.hasClass('visible')) {
      links.removeClass('visible').hide(200);
    } else {
      links.addClass('visible').show(200);
    }
  })
  navbarHandle.click(function (e) {
    var sidebar = $('nav.sidebar')
    if($('html').hasClass('docsMenuVisible')) {
      $('html').removeClass('docsMenuVisible');
      navbarHandle.text('Docs Menu');
    } else {
      $('html').addClass('docsMenuVisible');
      navbarHandle.text('Close');
    }
  })
  $('nav.sidebar a').click(function (e) {
    $('html').removeClass('docsMenuVisible');
    navbarHandle.text('Docs Menu');
    mobileScrollOffset()
  })

  function mobileScrollOffset() {
    setTimeout(function() {
      var y = $(window).scrollTop()
      $(window).scrollTop(y-120)
    }, 0)
  }

  if(is_mobile){ mobileScrollOffset(); }


  $('section.hero img[src*="arrow-down.svg"]').click(function (e) {
    $("html, body").animate({ scrollTop: $('section.points').offset().top - 100 }, 800);
  })

  var steps = [
     '<span class="na">$</span> curl -i http://localhost:8000/endpoint<br /> \
      <span class="k">HTTP</span><span class="o">/</span><span class="m">1.1</span> <span class="m">200</span> <span class="ne">OK</span><br /> \
      <span class="na">Content-Type</span><span class="p">:</span> <span class="s">text/plain</span><br /> \
      <span class="na">Content-Length</span><span class="p">:</span> <span class="s">22</span><br /> \
      <span class="na">Grip-Hold</span><span class="p">:</span> <span class="s">stream</span><br /> \
      <span class="na">Grip-Channel</span><span class="p">:</span> <span class="s">test</span><br /> \
      <br /> \
      welcome to the stream<br /> \
      <br /> \
      <span class="na">$</span>',
     ' curl -i http://localhost:7999/endpoint<br />',
     '<span class="k">HTTP</span><span class="o">/</span><span class="m">1.1</span> <span class="m">200</span> <span class="ne">OK</span><br /> \
      <span class="na">Content-Type</span><span class="p">:</span> <span class="s">text/plain</span><br /> \
      <span class="na">Transfer-Encoding</span><span class="p">:</span> <span class="s">chunked</span><br /> \
      <span class="na">Connection</span><span class="p">:</span> <span class="s">Transfer-Encoding</span><br /> \
      <br /> \
      welcome to the stream<br />',
     'hello world<br />',
     'hello world<br />',
     'hello world<br />',
     'hello world<br />',
     'hello world'
    ]

  var step = 0

  animatePanel()

  function animatePanel() {
    if(step > steps.length) {
      step = 0
      setTimeout(function() { 
        $('section.quickstart aside.console code').text('');
        animatePanel() 
      }, 5000)
    } else {
      if(step < steps.length && steps[step].includes('hello world')) {
        $('section.quickstart aside.steps code.trigger').toggleClass('pulse');
        setTimeout(function() { $('section.quickstart aside.steps code.trigger').toggleClass('pulse'); }, 500)
      }
      setTimeout(function() { 
        $('section.quickstart aside.console code').append(steps[step]); 
        step++
        setTimeout(function() { animatePanel() }, 1700)
      }, 300)
    }
  }

  

}(jQuery);
