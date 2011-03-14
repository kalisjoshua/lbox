
(function (window, $) {
    var open = {};
    
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
                            
                content = (function (link) {        
                    if (/(?:gif|jpeg|jpg|png)$/i.test(link.href)) {
                        return $("<img/>", {"src": link.href}).
                            load(function () {
                                var original = {
                                    height: this.height,
                                    width: this.width
                                };
                                $(this).
                                    appendTo("body").
                                    show().
                                    animate({
                                        height: Math.floor(options.maxWidth / original.width * original.height),
                                        marginLeft: -Math.floor(options.maxWidth / 2),
                                        marginTop: -Math.floor(options.maxWidth / original.width * original.height / 2),
                                        width: options.maxWidth
                                    }, 1000);
                            });
                    } else {
                        return $("<div/>", {"class": options.cssClass}).
                            load(link.pathname + (!!link.hash ? " " + link.hash : ""), function () {
                                $(this).
                                    find("> *").
                                        hide().
                                    end().
                                    appendTo("body").
                                    show().
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
                            }).
                            css({
                                background: "#FFFFFF",
                                overflow: "auto"
                            });
                    }
                }(this)).
                    css({
                        left: "50%",
                        height: 0,
                        margin: 0,
                        position: "fixed",
                        top: "50%",
                        width: 0,
                        zIndex: 999999
                    });
        });
    };
    
}(window, jQuery));