(function ($) {

    "use strict";

    var $html = $('html'), isTouch = $html.hasClass('touchevents');
    var $body = $('body');
    var windowWidth = Math.max($(window).width(), window.innerWidth);


    /*Detect IE*/
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE');
        var trident = ua.indexOf('Trident/');
        var edge = ua.indexOf('Edge/');
        if(msie > 0){
            $html.addClass('ie');
        }
        else if(trident > 0){
            $html.addClass('ie');
        }
        else if(edge > 0){
            $html.addClass('edge');
        }
        else{
            $html.addClass('not-ie');
        }
        return false;
    }

    detectIE();


    /*Detect ios*/
    var mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

    if(mac){
        $html.addClass('ios');
    }

    /*Ios fix zoom on form elems focus*/
    function cancelZoom() {
        var d = document,
            viewport,
            content,
            maxScale = ',maximum-scale=',
            maxScaleRegex = /,*maximum\-scale\=\d*\.*\d*/;

        // this should be a focusable DOM Element
        if (!this.addEventListener || !d.querySelector) {
            return;
        }

        viewport = d.querySelector('meta[name="viewport"]');
        content = viewport.content;

        function changeViewport(event) {
            viewport.content = content + (event.type == 'blur' ? (content.match(maxScaleRegex, '') ? '' : maxScale + 10) : maxScale + 1);
        }

        // We could use DOMFocusIn here, but it's deprecated.
        this.addEventListener('focus', changeViewport, true);
        this.addEventListener('blur', changeViewport, false);
    }

    $.fn.cancelZoom = function () {
        return this.each(cancelZoom);
    };

    if($html.hasClass('ios')) {
        $('input:text, select, textarea').cancelZoom();
    }


    /*Detect Android*/
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
    if (isAndroid) {
        $html.addClass('android');
    }
    else {
        $html.addClass('not-android');
    }







    /*RequestAnimationFrame Animate*/

    var runningAnimationFrame = true;
    var scrolledY;

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();

    function loop(){
        if(runningAnimationFrame){

            scrolledY = $(window).scrollTop();

            if($html.hasClass('no-touchevents') && $('.main__screen .main__screen-bg').length){
                mainScreenBgAnimate();
            }

            requestAnimationFrame(loop);
        }
    }
    requestAnimationFrame(loop);


    /*Header*/
    function stickyHeader(){
        var wST = $(window).scrollTop();
        if(wST >= 1){
            $html.addClass('sticky-header');
        }
        else{
            $html.removeClass('sticky-header');
        }
    }
    stickyHeader();



        /*Nav*/
    $('.header__nav li').each(function(){
        if($(this).find('.header__dropdown').length){
            $(this).addClass('has-child');
        }
    });

    $('.no-touchevents .header__nav .has-child > a').mouseenter(function(){
        if(windowWidth > 940){
            $(this).next('.header__dropdown').addClass('dropdown_visible');
        }
    });

    $('.no-touchevents .header__nav .has-child').mouseleave(function(){
        if(windowWidth > 940){
            $(this).find('.header__dropdown').removeClass('dropdown_visible');
        }
    });

    $('.touchevents .header__nav .has-child > a').click(function(e){
        if($(this).parents('li').hasClass('has-child')){
            e.preventDefault();
            e.stopPropagation();
        }
        if(windowWidth > 940){
            if(!$(this).next('.header__dropdown').hasClass('dropdown_visible')){
                $('.header__nav .has-child').removeClass('dropdown_opened');
                $('.header__nav .header__dropdown').removeClass('dropdown_visible');
                $(this).parents('.has-child').addClass('dropdown_opened');
                $(this).next('.header__dropdown').addClass('dropdown_visible');
            }
            else{
                $(this).parents('.has-child').removeClass('dropdown_opened');
                $(this).next('.header__dropdown').removeClass('dropdown_visible');
            }
        }
    });

    $('.header__nav li a').click(function(e){
        if(windowWidth <= 940){
            if($(this).next('.header__dropdown').length){
                e.preventDefault();
                if(!$(this).parent('li').hasClass('opened')){
                    $(this).parents('li').siblings('li').removeClass('opened').find('.header__dropdown').hide();
                    $(this).parents('li').find('li').removeClass('opened').find('.header__dropdown').hide();
                    $(this).next('.header__dropdown').slideDown(150).parent('li').addClass('opened');
                }
                else{
                    $(this).next('.header__dropdown').slideUp(150).parent('li').removeClass('opened');
                }
            }
        }
    });


    $('.touchevents .header__nav').click(function(e) {
        e.stopPropagation();
    });

    $('main').click(function(){
        if(windowWidth > 940 && $html.hasClass('touchevents')){
            $('.header__nav .has-child').removeClass('dropdown_opened');
            $('.header__nav .header__dropdown').removeClass('dropdown_visible');
        }
    });

    $('.header__open-nav').click(function(){
        if(!$html.hasClass('nav_opened')){
            $html.addClass('nav_opened');
            $('.header__nav li').each(function(){
                if($(this).hasClass('header__nav_active') && $(this).find('.header__dropdown').length){
                    $(this).addClass('opened').children('.header__dropdown').show();
                }
            });
            $(this).attr('title', 'Закрыть меню');
        }
        else{
            $html.removeClass('nav_opened');
            $('.header__nav li').removeClass('opened').find('.header__dropdown').hide();
            $(this).attr('title', 'Открыть меню');
        }
    });


    /*Main screen*/
        /*Responsive img*/
    if($('.bg_responsimg').length){
        $('.bg_responsimg').responsImg();
    }


    function mainScreenBgAnimate() {
        $('.main__screen .main__screen-bg').css({
            "-webkit-transform": "translate3d(0px, " + scrolledY * .5 + "px, 0px)",
            "-ms-transform": "translate3d(0px, " + scrolledY * .5 + "px, 0px)",
            "transform": "translate3d(0px, " + scrolledY * .5 + "px, 0px)"
        });
    }


   /*Photo gallery*/
    function masonryGrid(){
        var $container = $('.content__gallery');
        $container.imagesLoaded(function(){
            $container.masonry({
                itemSelector: '.content__gallery-item'
            });
        });
    }

    function galleryInit(){
        $('.content__gallery').lightGallery({
            hash: false
        });
    }

    if($('.content__gallery').length){
        masonryGrid();
        galleryInit();
    }

    var windowScrollCountGallery = '';
    $('.content__gallery').on('onBeforeOpen.lg',function(){
        windowScrollCountGallery = $(window).scrollTop();
    });

    $('.content__gallery').on('onBeforeClose.lg',function(){
        if($('.ie')){
            $('html, body').animate({
                scrollTop: windowScrollCountGallery
            }, 50);
        }
    });

    $('.content__gallery a').hover(function(){
        $('.content__gallery').addClass('on-hover');
    }, function(){
        $('.content__gallery').removeClass('on-hover');
    });



    /*Footer*/
    function stickyFooter(){
        var fHeight = $('#footer').innerHeight();
        $('#footer').css('marginTop', - fHeight);
        $('#indent').css('paddingBottom', fHeight);
    }

    if($('#footer').length){
        stickyFooter();
    }




    /*Animations*/

    /*Viewport checker*/
    function inViewChecker(){
        $('.no-touchevents .js-view-checker').viewportChecker({
            offset: '25%'
        });
        $('.no-touchevents .img-text-box.js-view-checker').viewportChecker({
            offset: '25%',
            classToAdd: 'visible'
        });
    }

    if($('.no-touchevents .js-view-checker').length){
        inViewChecker();
    }


    /*Keyboard controls*/
    $(document).keyup(function(e){
        if(e.keyCode == 27){
            $('.nav_opened .header__open-nav').trigger('click');
        }
    });


    /*Window load*/
    $(window).on('load', function(){
        $.ready.then(function(){

            if($('#footer').length){
                stickyFooter();
            }
        });
    });


    $(window).on('resize', function(){
        windowWidth = Math.max($(window).width(), window.innerWidth);

        waitForFinalEvent(function(){
            if($('#footer').length){
                stickyFooter();
            }
        }, 250);
    });


    $(window).on('orientationchange', function(){
        windowWidth = Math.max($(window).width(), window.innerWidth);

        waitForFinalEvent(function(){
            if($('#footer').length){
                stickyFooter();
            }
        }, 350);
    });

    $(window).scroll(function(){
        stickyHeader();
    });

})(jQuery);


var waitForFinalEvent = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();