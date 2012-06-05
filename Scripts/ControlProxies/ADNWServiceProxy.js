﻿


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
        expand: '?$format=json&$expand=ADNWGuestbooks/ADNWGuestbookEntries'
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
        if ($.browser.msie && window.XDomainRequest) {
            var xdr = new XDomainRequest();
            xdr.open("get", options.url);
            xdr.onload = function () {
                var JSON = $.parseJSON(xdr.responseText);
                if (JSON == null || typeof (JSON) == 'undefined') {
                    JSON = $.parseJSON(data.firstChild.textContent);
                }
                LoadGuestbookEntries(JSON.d, options, element);
            }
            xdr.send();

        }
        else {
            $.getJSON(
                options.url,
                function (msg) {
                    LoadGuestbookEntries(msg.d, options, element);
                }).error(function (jqXHR, textStatus, errorThrown) {
                    alert('Error:' + textStatus + '  Message:' + errorThrown);
                });
        }
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
        entry.Subscribe = Entry.Subscribe;
        entry.GuestEmail = Entry.GuestEmail;
        entry.Subscribe = Entry.Subscribe;

        return entry;
    }
    function LoadGuestbookEntries(guestbookSource, options, element) {
        var entries = [];
        var gbooks = guestbookSource.ADNWGuestbooks[0];
        GuestbookId = gbooks.ADNWGuestbookId;
        var jsonEntries = gbooks.ADNWGuestbookEntries;
        jsonEntries = jsonEntries.sort(function (a, b) { return b.GuestbookEntryId - a.GuestbookEntryId; });
        for (var i = 0; i < jsonEntries.length; i++) {
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
            if (this.name == 'Subscribe') {
                fields[this.name] = $(this).is(':checked');
            }

        });
        var entry = $gbDto(fields);
        if (!EntryValid(entry)) {
            return;
        }
        var url = ProxyDefaults.url + "SignGuestbookSave?guestbookId='" + entry.ADNWGuestbookId + "'&guestName='" + entry.GuestName + "'&guestComment='" + entry.GuestComment + "'&guestEmail='" + entry.GuestEmail + "'&subscribe=" + entry.Subscribe;

        if ($.browser.msie && window.XDomainRequest) {
            var xdr = new XDomainRequest();
            xdr.open("post", url);
            xdr.onload = function () {
                successCallback(null, null, null);
            }
            xdr.send();
        }
        else {
            $.post(
                url,
                function (dat, textStatus, XmlHttpRequest) {
                    if (successCallback) {
                        successCallback(dat.d, textStatus, XmlHttpRequest);
                    }
                }).error(function (jqXHR, textStatus, errorThrown) {
                    alert('Error:' + textStatus + '  Message:' + errorThrown);
                });
        }
    }

    function SaveGuestbookEntryCompleted(data, textStatus, XmlHttpRequest) {
        $('#Sign').each(
            function () { this.reset(); });
        Guestbook(null, options);
    }


    var EntryValid = function (data) {
        var valid = false;

        if (data.GuestName.length > 0 && data.GuestEmail.length > 0) {
            
            return true;
        }
        alert('Please Entry your Name and Email to sign the Guestbook');
        return valid;
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