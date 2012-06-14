
/*
    ADNWGuestbookPlugIn.Js
    Copyright (C) 2012  Andrew Ferrante

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


*/



(function ($, undefined) {

    var GuestbookId;
    var options;

    var ProxyDefaults = {
        Id: '',
        returnType: '$format=json',
        url: 'http://www.artistdevelopmentnw.com/adnwservicetest/ADNWClientApplicationWebServices.svc/',
        clientApp: 'ClientApplications'
    }
    var gbDefaults = {
        theme: 'Styles/Guestbook.css',
        entity: 'ADNWGuestbooks/ADNWGuestbookEntries',
        guestbookTemplate: '../Controls/Guestbook/ADNWGuestbook.htm',
        guestbookEntryTemplate: '../Controls/Guestbook/GuestbookEntry.htm'
    }
    $.fn.Guestbook = function (opts) {
        options = $.extend(true, {}, ProxyDefaults, gbDefaults, opts);
        if (options.Id != undefined && options.Id != '') {
            options.url = options.url + options.clientApp + "(guid'" + options.Id + "')?" + options.returnType + ((options.entity) ? '&$expand=' + options.entity : '');
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
        GetGuestbookTemplates(element);
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
        var entry = new Object();
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

        }
        else {
            GetGuesbookTemplates(null);
        }
        $('#GBEntry').tmpl(entries).appendTo('#gbRight');
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

    function GetGuestbookTemplates(element) {
        if ($('#GB').html()) {
        }
        else {
            $.get(options.guestbookTemplate, function (template) {
                $('body').append(template);
                if ($(element)) {
                    ($(element)).remove();
                }
                $('#GB').tmpl().appendTo('body');
                $('#btnSubmit').click(function () {
                    SaveGuestbookEntry($('#Sign :input'), SaveGuestbookEntryCompleted, null);
                });
            });
        }
    }
})(jQuery)