


(function ($, undefined) {

    var GuestbookId;
    var options;

    var ProxyDefaults = {
        Id: '',
        url: 'http://www.artistdevelopmentnw.com/adnwservicetest/ADNWClientApplicationWebServices.svc/',
        clientApp: 'ClientApplications'
    }
    var gbDefaults = {
        theme: 'Styles/Guestbook.css',  
        expand: '?$expand=ADNWGuestbooks/ADNWGuestbookEntries'
    }
    $.fn.Guestbook = function (options) {
        options = $.extend(true, {}, ProxyDefaults, gbDefaults, options);
        if (options.Id != undefined && options.Id != '') {
            options.url = options.url + options.clientApp + "(guid'" + options.Id + "')" + options.expand;
        }
        this.each(function (i, _element) {
            var element = $(_element);
            Guestbook(element, options);
           
        });
    }

    function Guestbook(element, options) {
        var t = this;
        t.options = options;
        t.element = element;
        GuestbookManager(t);
    }
    function GuestbookManager(Source) {
        options = Source.options;
        var element = Source.element;
        if ($('#GB').html()) {
        }
        else {
            $.get('../Controls/Guestbook/ADNWGuestbook.htm', function (template) {
                $('body').append(template);
                ($(element)).remove();
                $('#GB').tmpl().appendTo('body');
                $('#btnSubmit').click(function () {
                    SaveGuestbookEntry($('#Sign :input'), SaveGuestbookEntryCompleted, null);
                });
            });
        }
        GetGuestbookEntries(options);
    }

    function GetGuestbookEntries(options) {
        $.ajax({
            type: "GET",
            url: options.url,
            //crossDomain:true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (msg) { LoadGuestbookEntries(msg.d, options, element); },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    }

    var $gbDto = function (Entry) {
        var entry = new Object()
        entry.ADNWGuestbookId = GuestbookId;
        entry.GuestName = Entry.GuestName;
        entry.GuestComment = Entry.GuestComment;
        var edate = Entry.DateAdded;
        if (edate) {
            entry.DateAdded = new Date(parseInt(edate.substr(6)));
        }
        entry.GuestEmail = Entry.GuestEmail;
        return entry;
    }
    function LoadGuestbookEntries(guestbookSource, options, element) {
        var entries = [];
        var gbooks = guestbookSource.ADNWGuestbooks[0];
        GuestbookId = gbooks.ADNWGuestbookId;
        for (var i = 0; i < gbooks.ADNWGuestbookEntries.length; i++) {
            entries.push($gbDto(gbooks.ADNWGuestbookEntries[i]));

        }
        var gbEntryTemplate = $('#GBEntry').html();
        if (gbEntryTemplate) {
            $('#gbRight').empty();
            $('#GBEntry').tmpl(entries).appendTo('#gbRight');
        }
        else {
            $.get('../Controls/Guestbook/GuestbookEntry.htm', function (template) {
                $('body').append(template);
                $('#GBEntry').tmpl(entries).appendTo('#gbRight');
            });
        }
    }

    function SaveGuestbookEntry(data, successCallback, errorCallback) {
        var fields = {};
        $(data).each(function () {
            if (this.name != 'DateAdded') {
                fields[this.name] = $(this).val();
            }
        });
        var entry = $gbDto(fields);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: ProxyDefaults.url + "SignGuestbookSave?guestbookId='" + entry.ADNWGuestbookId + "'&guestName='"+entry.GuestName + "'&guestComment='" + entry.GuestComment + "'&guestEmail='" + entry.GuestEmail + "'",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (dat, textStatus, XmlHttpRequest) {
                if (successCallback) {
                    successCallback(dat.d, textStatus, XmlHttpRequest);
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                if (errorCallback) errorCallback(XmlHttpRequest, textStatus, errorThrown);
                else alert("Error on the creation of record; Error - " + errorThrown);
            }
        });
    }

    function SaveGuestbookEntryCompleted(data, textStatus, XmlHttpRequest) {
        $('#Sign').each(
            function() { this.reset();});
        Guestbook(null, options);
    }





















    //Image Library Proxy
    var ilDefaults = {
        theme: 'Styles/ImageLibrary',
        expand: '?$expand=ImageLibraries/ImageAlbums/Images'
    }
    $.fn.ImageLibrary = function (options) {
        options = $.extend(true, {}, ProxyDefaults, ilDefaults, options);
        if (options.Id != undefined && options.Id != '') {
            options.url = options.url + "(guid'" + options.Id + "')" + options.expand;
        }

        this.each(function (i, _element) {
            var element = $(_element);
            var imagelibrary = ImageLibrary(element, options);
            //            var guestbook = Guestbook(element, options);
            //            element.data('Guestbook', guestbook);
        });
    }

    function ImageLibrary(element, options) {
        var t = this;
        t.options = options;
        t.element = element;
        ImageLibraryManager(t);
    }

    function ImageLibraryManager(Source) {
        var options = Source.options;
        var element = Source.element;
        $.ajax({
            type: "GET",
            url: options.url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) { CreateImageLibrary(msg.d, options, element); },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    }

    function CreateImageLibrary(guestbookSource, options, element) {
        var entries = [];
        var iLibrary = guestbookSource.ImageLibraries[0].ImageAlbums;
        //        for (var i = 0; i < gbooks.ADNWGuestbookEntries.length; i++) {
        //            entries.push($gbDto(gbooks.ADNWGuestbookEntries[i]));

        //        }
        //        $.get('Themes/ADNWGuestbook.htm', function (template) {
        //            $('body').append(template);

        //            $('#GB').tmpl().appendTo('body');
        //            ($(element)).replaceWith('#GB');
        //        });
        //        $.get('Themes/GuestbookEntry.htm', function (template) {
        //            $('body').append(template);
        //            $('#GBEntry').tmpl(entries).appendTo('#gbRight');
        //        });
    }


    var $ilDto = function (Entry) {
        var entry = new Object()
        entry.Name = Entry.GuestName;
        entry.Comment = Entry.GuestComment;
        var edate = Entry.DateAdded;
        entry.Date = new Date(parseInt(edate.substr(6)));
        return entry;
    }
})(jQuery)