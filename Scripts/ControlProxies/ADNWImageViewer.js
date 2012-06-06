
/*
ADNWImageViewerPlugIn.Js
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

    var options;
    var ProxyDefaults = {
        Id: '',
        url: 'http://www.artistdevelopmentnw.com/adnwservicetest/ADNWClientApplicationWebServices.svc/',
        clientApp: 'ClientApplications'
    }
    //Image Library Proxy
    var ilDefaults = {
        theme: 'Styles/ImageLibrary',
        entity: 'ImageLibraries/ImageAlbums/Images',
        ImageViewerTemplate: '../Controls/ImageViewer/ImageViewer.htm',
        ImageViewerImageTemplate: '../Controls/ImageViewer/GuestbookEntry.htm'
    }
    $.fn.ImageLibrary = function (options) {
        options = $.extend(true, {}, ProxyDefaults, ilDefaults, options);
        if (options.Id != undefined && options.Id != '') {
            options.url = options.url + "(guid'" + options.Id + "')" + (options.entity) ? '$expand=' + options.entity : '';
        }

        this.each(function (i, _element) {
            var element = $(_element);
            var imagelibrary = ImageLibrary(element, options);
        });
    }

    function ImageLibrary(element, options) {
        var t = this;
        t.options = options;
        t.element = element;
        ImageLibraryManager(t);
    }

    function ImageLibraryManager(Source) {
        options = Source.options;
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