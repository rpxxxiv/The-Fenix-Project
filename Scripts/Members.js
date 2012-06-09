var $Members =
[
    { Title: "Fenix", Page: "../Pages/Members/FenixSanders.htm", SortOrder: "1" },
    { Title: "Jason", Page: "../Pages/Members/JasonThomas.htm", SortOrder: "2" },
    { Title: "Jeffery", Page: "../Pages/Members/JefferyOtto.htm", SortOrder: "3" },
    { Title: "Fred", Page: "../Pages/Members/FredGarner.htm", SortOrder: "4" },
    { Title: "Jeff", Page: "../Pages/Members/JeffFrankel.htm", SortOrder: "5" }
]

var options;
var ProxyDefaults = {
    Id: '',
    url: 'http://www.artistdevelopmentnw.com/adnwservicetest/ADNWClientApplicationWebServices.svc/',
    clientApp: 'ClientApplications'
}
//ADNW ClientMember Proxy
var mbDefaults = {
    theme: 'Styles/Guestbook.css',
    entity: 'ClientMembers',
    returnType: '$format=json',
    guestbookTemplate: '../Controls/Guestbook/ADNWGuestbook.htm',
    guestbookEntryTemplate: '../Controls/Guestbook/GuestbookEntry.htm'

}
$.fn.Members = function (opts) {
    options = $.extend(true, {}, ProxyDefaults, mbDefaults, opts);
    if (options.Id != undefined && options.Id != '') {
        options.url = options.url + options.clientApp + "(guid'" + options.Id + "')?" + options.returnType + ((options.entity) ? '&$expand=' + options.entity : '');
    }

    this.each(function (i, _element) {
        var element = $(_element);
        var members = Members(element, options);
    });
}

function Members(element, options) {

    if ($.browser.msie && window.XDomainRequest) {
        var xdr = new XDomainRequest();
        xdr.open("get", options.url);
        xdr.onload = function () {
            var JSON = $.parseJSON(xdr.responseText);
            if (JSON == null || typeof (JSON) == 'undefined') {
                JSON = $.parseJSON(data.firstChild.textContent);
            }
            LoadMembers(JSON.d, options, element);
        }
        xdr.send();

    }
    else {
        $.getJSON(
                options.url,
                function (msg) {
                    LoadMembers(msg.d, options, element);
                }).error(function (jqXHR, textStatus, errorThrown) {
                    alert('Error:' + textStatus + '  Message:' + errorThrown);
                });
            }

//    for (var i = 0; i < $Members.length; i++) {
//        var m = $Members[i];
////        $("#Members").load('../Pages/Members/FenixSanders.html');
//        $.get(m.Page, function (template) {
//            //$.tmpl(template, m).appendTo("#Members");
//            $(template).tmpl(m).appendTo("#Members");
//        });
//    }
        }

        function LoadMembers(source, options, element) {
            var members = source.ClientMembers;
            for (var i = 0; i < members.length; i++) {
                var jsonMember = members[i];
                $(element).append(jsonMember.ClientMemberDescription);
            }
        }