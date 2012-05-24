var $Members =
[
    { Title: "Fenix", Page: "../Pages/Members/FenixSanders.htm", SortOrder: "1" },
    { Title: "Jason", Page: "../Pages/Members/JasonThomas.htm", SortOrder: "2" },
    { Title: "Jeffery", Page: "../Pages/Members/JefferyOtto.htm", SortOrder: "3" },
    { Title: "Fred", Page: "../Pages/Members/FredGarner.htm", SortOrder: "4" },
    { Title: "Jeff", Page: "../Pages/Members/JeffFrankel.htm", SortOrder: "5" }
]

function LoadMembers() {
    for (var i = 0; i < $Members.length; i++) {
        var m = $Members[i];
//        $("#Members").load('../Pages/Members/FenixSanders.html');
        $.get(m.Page, function (template) {
            //$.tmpl(template, m).appendTo("#Members");
            $(template).tmpl(m).appendTo("#Members");
        });
    }
}