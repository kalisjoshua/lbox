
(function (window, $) {
    var open = {},
        origin = {
            left: "50%",
            height: 0,
            margin: 0,
            position: "fixed",
            top: "50%",
            width: 0,
            zIndex: 999999
        };
    
    $.fn.lbox = function (options) {
        options = $.extend({}, {
            cssClass: "lbox_window",
            maxWidth: 600
        }, options);
        
        return this.live("click", function (event) {
            if (open[this.href]) {
                // prevent the same link being opened twice
                return;
            }
            // provide a way to reopen a link after it has been closed
            open[this.href] = true;
            event.preventDefault();

            // $.when($("<img/>", {"src": this.href})).
            //     done(function (element) {
            //         console.log(element.get(0).height);
            //     });
            var blind = $("<div/>").
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
                            click((function (h) {
                                return function () {
                                    open[h] = false;
                                    blind.stop().remove();
                                    content.stop().remove();
                                };
                            }(this.href))),
                            
                content = (function (link, temp) {        
                    if (/(?:gif|jpeg|jpg|png)$/i.test(link.href)) {
                        temp = $("<img/>", {"src": link.href});
                        $.when(temp).
                            done(function (element) {
                                var original = {
                                    height: element.get(0).height,
                                    width: element.get(0).width
                                };
                                
                                element.
                                    animate({
                                        height: Math.floor(options.maxWidth / original.width * original.height),
                                        marginLeft: -Math.floor(options.maxWidth / 2),
                                        marginTop: -Math.floor(options.maxWidth / original.width * original.height / 2),
                                        width: options.maxWidth
                                    }, 1000);
                            });
                    } else {
                        temp = $("<div/>", {"class": options.cssClass});
                        
                        $.ajax({
                            url: link.href,
                            success:
                                function (response) {
                                    temp.
                                        html($(response).find(link.hash)).
                                        find("> *").
                                            hide().
                                            end().
                                        css({
                                            background: "#FFFFFF",
                                            overflow: "auto"
                                        }).
                                        animate({
                                            height: 400,
                                            marginLeft: -Math.floor(options.maxWidth / 2),
                                            marginTop: "-200px",
                                            width: options.maxWidth
                                        }, 1000, function () {
                                            $(this).
                                                find("> *").
                                                    fadeIn();
                                        });
                                }
                            });
                    }
                    return temp.
                        appendTo("body").
                        css(origin).
                        show();
                }(this));
        });
    };
    
}(window, jQuery));