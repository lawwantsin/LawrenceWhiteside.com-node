define(['jquery', 'can', 'controls/app'], function($, can, App) {

  // Controller for the Contact form and the encoding of e-mail addresses to thwart harvesters.
  App.Controls.Contact = can.Control.extend({

    init :function() {
      this.obfuscate("4dC@Y5A3sdQ3U7l33.YDs", "RFK4LEmxqwZa3XoUJ0hMY2zrvfNsnTCudPGDpOi1bS8Ilk7HQAWB9eyVtj65gc", ".email", 'mailto');
      this.obfuscate("PTD-gvD-DKAz", "M985DrTKnmuNZPvABw0ekWIx4UjCdhEFGYbfc6QsLyialVJ2pzRqtH7S13OgoX", ".phone", 'tel');
    },

    // Email obfuscator script 2.1 by Tim Williams, University of Arizona
    // Random encryption key feature by Andrew Moulden, Site Engineering Ltd
    // This code is freeware provided these four comment lines remain intact
    // A wizard to generate this code is at http://www.jottings.com/obfuscator/
    obfuscate :function(coded, key, selector, linkType) {
      var shift=coded.length;
      var link="";
      for (i=0; i<coded.length; i++) {
        if (key.indexOf(coded.charAt(i))==-1) {
          ltr = coded.charAt(i)
          link += (ltr)
        }
        else {     
          ltr = (key.indexOf(coded.charAt(i))-shift+key.length) % key.length
          link += (key.charAt(ltr))
        }
      }
      $(selector).html("<a href='"+linkType+":"+link+"'>"+link+"</a>")
    },

    // On contact form submit.
    // Assigns any payment information that was stored and uses the Contact model to send the AJAX request.
    '.contactForm form submit' :function(el, ev) {
      ev.preventDefault();
      var params = el.formParams();
      params.payment = $('body').data('ccInfo');
      contact = new App.Models.Contact(params);
      contact.save(function(res) {
        console.log(res);    // TODO: Add success action
      }, 
      function(res) {
        console.log(res);    // TODO: Add error visualization
      })
    },

    // Attach a custom event to the doument object on the dom so any controller may show or hide the contact form.
    // Useful because there is more than one way to show the form, modal dialog and bottom of page and I'd like them to be synced.
    '{document} showPaymentInfo' : function() {
      this.showPaymentInfo();
    },

    '{document} hidePaymentInfo' : function() {
      this.hidePaymentInfo();
    },

    // "Fuck you, pay me" button
    '.payment click' :function(el, ev) {
      ev.preventDefault();
      this.showPaymentForm();
    },

    // Cancel payment
    '.cancel click' :function(el, ev) {
      ev.preventDefault();
      this.showContactForm();
    },

    // Add payment summary to footer of the contact form.
    showPaymentInfo :function() {
      $('.payment').hide();
      $('.amountNum').text($('body').data('ccInfo').amount);
      $('.last4Num').text($('body').data('ccInfo').last4);
      var cl = $('body').data('ccInfo').type.toLowerCase().replace(/\s+/g, '');
      $('.ccard').attr('class', null).addClass('ccard').addClass(cl);
      $('.paymentMade').show();
      this.showContactForm();
    },

    // Reset the payment summary after it's been cancelled.
    hidePaymentInfo :function() {
      $('.paymentMade').hide();
      $('.amountNum').text('');
      $('.last4Num').text('');
      $('.ccard').attr('class', null).addClass('ccard');
      $('.payment').show();
    },

    // State functions to show hide. TODO: switch to a toggle class on parent element so visibility can be set in css.  
    // .show()/.hide() are bad practice IMO.
    showPaymentForm :function() {
      $('.paymentForm').show();
      $('.contactForm').hide();
    },

    showContactForm :function() {
      $('.paymentForm').hide();
      $('.contactForm').show();
    }

  });
  var contact = new App.Controls.Contact('body')
});