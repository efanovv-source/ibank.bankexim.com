/**
 * Created by lopatyuk on 31.08.2016.
 */
$(document).ready(function(e) {

        progressEl="<div id=\"process\" style=\"overflow-y: auto; position: fixed; bottom: 0; top: 0; right: 0; left: 0; z-index: 9999;\">" +
            "<div style=\"opacity: 0.5; background:black; position: absolute;cursor: pointer;top: 0;overflow: hidden;z-index: 99997;left: 0;display: block;width:100%;height:100%;\"></div>" +
            "<div id=\"message_window\" style=\"width:415px; height:280px; background:white; position:absolute; top:0px; bottom:0px; left:0px; right:0px; margin:auto; z-index:99998; border:3px solid #eaac0f; border-radius:10px 10px 10px 10px; box-shadow: 0 0 20px rgba(1,1,1,1);\">" +
            "<div style=\"width:100%; height:30px; background:#ffc90a; border-bottom: 1px solid #eaac0f; border-radius:5px 5px 0px 0px;\"></div>" +
            "<div style=\"width:100%; height:208px; text-align:center; font-size:17px; font-weight:bold;\">" +
            "<div style=\"margin-top:10px; height:70px;\" id=\"process_message\">Ваш запрос обрабатывается...<br>Пожалуйста, ожидайте.</div>" +
            "<div style=\"margin-top:50px; margin-left:5px; margin-right:5px;\">\n" +
            "<div class=\"cssload-container2\">"+
            "<div class=\"cssload-whirlpool\"></div></div>"+ "<div></div>" +
            "<div></div>" +
            "<div></div>" +
            "<div></div>" +
            "</div>" +
            "</div>" +
            "<div style=\"width:100%; height:30px; background:#ffc90a; border-top: 1px solid #eaac0f; border-radius:0px 0px 5px 5px;\"></div>" +
            "</div>" +
            "</div>";
   // }

    $("body").append(progressEl);

    

    $('#process').css('display', 'none');

    $('.btn').click(function () {
        setTimeout(function(){
        $('#process').css('display', 'block');
            $('body').css("overflow","hidden");
        setTimeout(function(){         
            $("#process_message").html("Операция длится более минуты..<br>Пожалуйста, ожидайте ее завершения.<br>Приносим свои извинения!");
            $("#message_window").css("width","400px");
        }, 60000);
        }, 5000);
    });


    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);

    special.scrollstart = {
        setup: function() {
            var timer,
                handler = function(event) {
                    var _self = this,
                        _args = arguments;

                    if (timer) {
                        clearTimeout(timer);
                    } else {

                        $.event.trigger('scrollstart', null, _self);
                    }

                    timer = setTimeout(function() {
                        timer = null;
                    }, special.scrollstop.latency);
                };

            $(this).bind('scroll', handler).data(uid1, handler);
        },
        teardown: function() {
            $(this).unbind('scroll', $(this).data(uid1));
        }
    };

    special.scrollstop = {
        latency: 300,
        setup: function() {
            var timer,
                handler = function(event) {
                    var _self = this,
                        _args = arguments;

                    if (timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout(function() {
                        timer = null;
                        $.event.trigger('scrollstop', null, _self);
                    }, special.scrollstop.latency);
                };

            $(this).bind('scroll', handler).data(uid2, handler);
        },
        teardown: function() {
            $(this).unbind('scroll', $(this).data(uid2));
        }
    };


    var $elem = $('body');

    $('#nav_up').fadeIn('slow');
    $('#nav_down').fadeIn('slow');

    $(window).bind('scrollstart', function(){
        $('#nav_up,#nav_down').stop().animate({'opacity':'0.2'});
    });
    $(window).bind('scrollstop', function(){
        $('#nav_up,#nav_down').stop().animate({'opacity':'1'});
    });

    $('#nav_down').click(
        function (e) {
            $('html, body').animate({scrollTop: $elem.height()}, 800);
        }
    );
    $('#nav_up').click(
        function (e) {
            $('html, body').animate({scrollTop: '0px'}, 800);
        }
    );
});
