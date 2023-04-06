/*
Copyright (c) 2018
[Custom Script]
Template Name : CRM
Version    : 1.0
Author     :  
Author URI :  
Support    :  
*/

$(function () {

    "use strict";

    /*-----------------------------------
     * NAVBAR CLOSE ON CLICK
     *-----------------------------------*/

    $('.navbar-nav > li:not(.dropdown) > a').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });



    /*-----------------------------------
     * ONE PAGE NAV - SMOOTH SCROLLING
     *-----------------------------------*/

    // Select all links with hashes
    $('.navbar-nav .nav-link')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .on('click', function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 40
                    }, 700, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

         $('.navbar-nav-1 .nav-link-1')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .on('click', function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 40
                    }, 700, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });
    /*-----------------------------------
     *Dropdown Multilevel Menu
     *-----------------------------------*/
    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');

        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-submenu .show').removeClass("show");
        });

        return false;
    });

    /*-----------------------------------
     * Twitter Widget
     *-----------------------------------*/
    window.twttr = (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));


});

         $('#contactus-contact').click(function() {
                        $('#recorderror-contact').hide();
                        $('#recorderror-contact').html('')
                        var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
                        var myName = $('#contact_name').val();
                        var mobileNumber = $('#contact_phone').val();
                        var myEmail = $('#contact_email').val();
                        var referrer = document.referrer;
                        var userAgent = navigator.userAgent;
                        if (myEmail != '') {
                            if (!pattern.test(myEmail)) {
                                $('#cterror_email').show();
                                return;
                            }
                        }
                        if (myName == "") {
                            $('#cterror_name').show();
                            return false;
                        } else if (mobileNumber == "" || mobileNumber.length != 10) {
                            $('#cterror_mobile').show();
                            return false;
                        } else {
                            $('#contactus-contact').hide();
                            $('.ctbuttonload').show();
                            formData = {
                                name: myName,
                                phone: mobileNumber,
                                email: myEmail,
                                extra: {
                                    referrer: referrer,
                                    userAgent: userAgent
                                }
            
                            };
                            var settings = {
                                async: true,
                                crossDomain: true,
                                url: "https://lmsapi.persquarefeet.in/submit_lead/9311b09bd44042a4ac624822b48dd68d/e4b788f900294e47a64b69cc96b36e1a",
                                method: "POST",
                                headers: {
                                    "content-type": "application/json"
                                },
                                processData: false,
                                data: JSON.stringify(formData)
                            }
            
                            $.ajax(settings).done(function(response) {
                                //console.log(response);
                                $('#ctthanku-msg').show()
                                $('#contact-form').hide();
                                setTimeout(function() {
                                    $('#ctthanku-msg').hide();
                                    $('#contact-form').show();
                                    $('#cterror_name').hide();
                                    $('#cterror_mobile').hide();
                                    $('#cterror_email').hide();
                                    $('#contactus-contact').show();
                                    $('.ctbuttonload').hide();
                                }, 3000);
                                $('input').val('');
                            }).fail(function(error) {
                                //console.log(error.responseText.error);
                                $('#error-wrap').html(error.responseText.error)
                                $('#recorderror-contact').html(error.responseJSON.error)
                                $('#recorderror-contact').show();
                                $('#contactus-contact').show();
                                $('.ctbuttonload').hide();
                                setTimeout(function() {
                            $('#recorderror-contact').html('')
                        $('#recorderror-contact').hide();
                         },5000);
                            });
                        }
                    });
         
         
         function validate(evt) {
             var theEvent = evt || window.event;
         
             // Handle paste
             if (theEvent.type === 'paste') {
                 key = event.clipboardData.getData('text/plain');
             } else {
                 // Handle key press
                 var key = theEvent.keyCode || theEvent.which;
                 key = String.fromCharCode(key);
             }
             var regex = /[0-9]|\./;
             if (!regex.test(key)) {
                 theEvent.returnValue = false;
                 if (theEvent.preventDefault) theEvent.preventDefault();
             }
         }