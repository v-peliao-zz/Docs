$(function () {
    // #menu-bar toggling
    $("#menu-expand").click(function () {
        $(".social-actions").slideToggle("fast", function () {
            if ($(".social-actions").css("display") === "none") {
                $("#menu-expand-icon").text("+ ");
            } else {
                $("#menu-expand-icon").text("- ");
            }
            // post-animation actions
        });
    });

    // theme switching
    $(".menu-theme").change(function () {
        $("body").removeClass().addClass($(".menu-theme select").val());
        $('#toc').contents().find('body').removeClass().addClass($(".menu-theme select").val());
    });

    // mobile navi switching
    $('.mobilenavi').change(function () {
        var target = $('.mobilenavi select').val();
        $(location).attr('href', target)
    });

    // In topic TOC
    var ToC = "<ul>";
    $("#main h2").each(function () {
        el = $(this);
        title = el.text();
        link = "#" + el.attr("id");
        newLine =
            "<li>" +
            "<a href='" + link + "'>" +
            title +
            "</a>" +
            "</li>";

        ToC += newLine;
    });
    ToC += "</ul>";

    $("aside.toc").append(ToC);

    // local TOC
    var toc = buildTOC();
    $('#sidebar').append(toc);

    var mobileToc = buildMobileTOC();
    $('.mobilenavi > select').empty();
    $('.mobilenavi > select').append(mobileToc);

    // breadcrumb
    var breadcrumb = buildGlobalBreadcrumb('', 'conceptual');
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

    // add alert effect to TIP/NOTE/IMPORTANT/WARNING
    $('.TIP, .NOTE, .IMPORTANT, .WARNING').addClass('alert');
});