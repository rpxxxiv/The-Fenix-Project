var $NavigationLinks = 
[
    { Title: "Home", Icon: "Styles/Layout/HomeLogo.png", Page: "Pages/Home.html", InDomain : true},
    { Title: "About Us", Icon: "Styles/Layout/AboutUsLogo.png", Page: "Pages/AboutUs.html", InDomain: true},
    { Title: "Contact", Icon: "Styles/Layout/ContactLogo.png", Page: "Pages/Contact.html", InDomain: true},
    { Title: "Events", Icon: "Styles/Layout/EventsLogo.png", Page: "Pages/Events.html", InDomain: true},
    { Title: "Guestbook", Icon: "Styles/Layout/GuestbookLogo.png", Page: "Pages/Guestbook.html", InDomain: true},
    { Title: "Media", Icon: "Styles/Layout/GalleryLogo.png", Page: "Pages/Media/ImageLibrary.html", InDomain: true},
    //{ Title: "News", Icon: "Styles/Layout/NewLogo.png", Page: "Pages/News.html", InDomain: true},
    { Title: "Facebook", Icon: "Styles/Layout/FacebookLogo.png", Page: "http://www.facebook.com" },
    { Title: "ReverbNation", Icon: "Styles/Layout/ReverbNationLogo.png", Page: "http://www.reverbnation.com"},
    { Title: "ADNW", Icon: "Styles/Layout/ADNWLogo.png", Page: "http://www.myadnw.com" },
    { Title: "Blue Diamond", Icon: "Styles/Layout/BlueDiamondLogo.png", Page: "http://bluediamondpdx.com"}
]


function SetLinkEvents(ullia, iframe) {

    $(ullia).find('a').each(
        function () {
            MapLinkEvent($(this), iframe);
        })
}


function MapLinkEvent(btn, iframe) {
    var $frm = iframe;
    var link = $(btn).attr('href');
    //link = link.substring(link.indexOf('#'));
    //$(btn).attr('href')
    var a = link;
    var isOutOfDomain = link.toString().search("http://");
    var inDomain = link.toString().search("Pages/");
    if (isOutOfDomain && inDomain) {
        a = NavUriMapper(link.replace('#', '').replace('.html', ''));
    }

    $(btn).click(function (e) {
        if (isOutOfDomain) {
            e.preventDefault();
            $frm.animate(
            { opacity: 0 },
            toggleSpeed,
                function () {
                    $frm.delay(300);
                    $frm.empty();
                    $frm.attr("src", a);

                });
        }
    });
}

function NavUriMapper(link) {

    return 'Pages/{0}.html'.format(link);
}

String.prototype.format = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
