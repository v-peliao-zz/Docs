$(function () {
    // code highlighting
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    // overload expanding
    $('.expander').simpleexpand();

    // #menu-bar toggling
    $("#menu-expand").click(function () {
        $("#menu-bar").slideToggle("fast", function () {
            if ($("#menu-bar").css("display") === "none") {
                $("#menu-expand-text").text("More ");
                $("#menu-expand-icon").removeClass("icon-up-arrow");
                $("#menu-expand-icon").addClass("icon-down-arrow");
            } else {
                $("#menu-expand-text").text("Less ");
                $("#menu-expand-icon").removeClass("icon-down-arrow");
                $("#menu-expand-icon").addClass("icon-up-arrow");
            }
            // post-animation actions
        });
    });

    // theme switching
    $(".menu-theme").change(function () {
        if ($(".menu-theme select").val() == 'theme-2columns') {
            $('.secondary').css('width', '100%');
            $('.secondary').css('margin-left', '0');
            $('.secondary').css('padding-left', '0');
            $('.primary').css('width', '100%');
            $('.primary').css('float', 'initial');
        }
        else if ($(".menu-theme select").val() == 'theme-3columns') {
            $('.secondary').removeAttr('style');
            $('.primary').removeAttr('style');
        }
        else {
            $("body").removeClass().addClass($(".menu-theme select").val());
        }
    });

    // mobile navi switching
    $('.mobilenavi').change(function () {
        var target = '#' + $('.mobilenavi select').val();
        $(document).scrollTop($(target).offset().top);
        autoExpand(target);
    });

    // update language to friendly name
    $('#menu-lang').find('option').each(function () {
        switch ($(this).text()) {
            case 'csharp':
                $(this).text('C#');
                break;
            case 'vb':
                $(this).text('VB');
                break;
            case 'cplusplus':
                $(this).text('C++');
                break;
            default:
                break;
        }
    });

    // update platform to friendly name
    $('#menu-platform').find('option').each(function () {
        switch ($(this).text()) {
            case 'net40':
                $(this).text('.NET');
                break;
            case 'winform40':
                $(this).text('.NET.WindowsForms');
                break;
            case 'wp8':
                $(this).text('WinPhone');
                break;
            case 'sl':
                $(this).text('WinPhoneSilverlight');
                break;
            case 'rt':
                $(this).text('WinRT');
                break;
            default:
                break;
        }
    });

    // filter platform and language by selection
    contentFilter($('#menu-platform').find('select').val(), $('#menu-lang').find('select').val());

    // navigation auto expand clicked section
    $('body').on('click', '.navigation > ul > li > a', function () {
        var target = $(this).attr('href');
        autoExpand(target);
    });

    // add breadcrumb
    var breadcrumb = buildReferenceBreadcrumb();
    $('.breadcrumbs').append(breadcrumb);

    // build share url
    var shareLink = location.origin + location.pathname;
    var facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + shareLink;
    var twitterShareUrl = "https://twitter.com/intent/tweet?original_referer=" + shareLink + "&text=" + document.title + "&tw_p=tweetbutton&url=" + shareLink;
    $(".share-facebook").attr("href", facebookShareUrl);
    $(".share-twitter").attr("href", twitterShareUrl);

    // share toggling
    $('body').not('.share-container').click(function () {
        $('.share-container').hide();
    });
    $('.sharebutton').click(function () {
        var pos = $('.sharebutton').position();
        $('.share-container').css('left', pos.left);
        $('.share-container').css('top', pos.top + 36);
        $('.share-container').toggle();
        return false;
    });

    // social share window control
    $('.share-container > li > a').click(function () {
        window.open(this.href, '', 'width=600,height=650');
        return false;
    });

    // add BI tag for code block
    $('figure').attr('ms.cmpgrp', 'code');

    // add alert effect to TIP/NOTE/IMPORTANT/WARNING
    $('.TIP, .NOTE, .IMPORTANT, .WARNING').addClass('alert');
});