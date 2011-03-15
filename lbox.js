/*
 * Author:  Joshua T Kalis
 * website: http://joshuakalis.com
 * email:   kalisjoshua@gmail.com
 * twitter: @kalisjoshua
*/
!!window.jQuery && (function (window, $) {
    var open = {};
    
    $.fn.lbox = function (options) {
        options = $.extend({}, {
            cssClass: "lbox_window",
            duration: 400,
            height: 500,
            width: 600
        }, options);
        
        return this.live("click", function (event) {
            if (open[this.href]) {
                return; // prevent the same link opening multiple lbox(es)
            }
            open[this.href] = true;
            event.preventDefault();

            var exit = (function (h) {
                    return function (event) {
                        !!event && event.preventDefault(); // incase this is used as a click handler
                        open[h] = false; // allow the lbox to be opend again after it is closed
                        hide.stop().remove();
                        lbox.stop().remove();
                    };
                }(this.href)),
            
                hide = $("<div/>").
                            hide().
                            appendTo("body").
                            css({
                                background: "#000000",
                                height: "100%",
                                left: "0px",
                                opacity: "0.8",
                                position: "fixed",
                                top: "0px",
                                width: "100%",
                                zIndex: 999999
                            }).
                            fadeIn().
                            click(exit),
                            
                lbox = (function (link, temp) {        
                    if (/(?:gif|jpeg|jpg|png)$/i.test(link.href)) {
                        temp = $("<img/>", {"class": options.cssClass, "src": link.href});
                        
                        $.when(temp).
                            done(function (element) {
                                var original = {
                                    height: element.get(0).height,
                                    width: element.get(0).width
                                };
                                
                                element.
                                    animate({
                                        height: Math.floor(options.width / original.width * original.height),
                                        marginLeft: -Math.floor(options.width / 2),
                                        marginTop: -Math.floor(options.width / original.width * original.height / 2),
                                        width: options.width
                                    }, options.duration);
                            });
                    } else {
                        temp = $("<div/>", {"class": options.cssClass});

                        $.get(link.href).
                            done(function (response) {
                                response = !!link.hash ? $(response).find(link.hash) : response;
                                temp.
                                    html(response).
                                    find("> *").
                                        hide().
                                        end().
                                    css({
                                        background: "#FFFFFF",
                                        overflow: "auto"
                                    }).
                                    animate({
                                        height: options.height,
                                        marginLeft: -Math.floor(options.width / 2),
                                        marginTop: -Math.floor(options.height / 2),
                                        width: options.width
                                    }, options.duration, function () {
                                        $(this).
                                            find("> *").
                                                show();
                                    });
                            });
                    }
                    return temp.
                        appendTo("body").
                        css({
                            left: "50%",
                            height: 0,
                            margin: 0,
                            position: "fixed",
                            top: "50%",
                            width: 0,
                            zIndex: 999999
                        }).
                        show();
                }(this));
        });
    };
}(window, jQuery));