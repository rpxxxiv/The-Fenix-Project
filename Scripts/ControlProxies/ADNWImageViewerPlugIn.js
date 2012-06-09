
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
        returnType: '$format=json',
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
            options.url = options.url + options.clientApp + "(guid'" + options.Id + "')?" + options.returnType + ((options.entity) ? '&$expand=' + options.entity : '');
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
        GetImageLibraryTemplates(element);
        $('#btnSubmit').click(function () { GetImageLibraryAlbums(options); });
        GetImageLibraryAlbums(options)
    }

    function GetImageLibraryAlbums(options) {
        if ($.browser.msie && window.XDomainRequest) {
            var xdr = new XDomainRequest();
            xdr.open("get", options.url);
            xdr.onload = function () {
                var JSON = $.parseJSON(xdr.responseText);
                if (JSON == null || typeof (JSON) == 'undefined') {
                    JSON = $.parseJSON(data.firstChild.textContent);
                }
                LoadImageLibraryAlbums(JSON.d, options, element);
            }
            xdr.send();

        }
        else {
            $.getJSON(
                options.url,
                function (msg) {
                    LoadImageLibraryAlbums(msg.d, options, element);
                }).error(function (jqXHR, textStatus, errorThrown) {
                    alert('Error:' + textStatus + '  Message:' + errorThrown);
                });
        }
    }

    var ilAlbumDto = function (Album) {
        var album = new Object();
        album.Id = Album.ImageAlbumId;
        album.uri = Album.__metadata.uri;
        album.Name = Album.ImageAlbumName;
        album.DateAdded;
        var edate = Album.DateAdded;
        if (edate) {
            album.DateAdded = new Date(parseInt(edate.substr(6)));
        }

        album.coverArt = Album.Images[Math.floor(Math.random() * Album.Images.length)];

        return album;

    }

    var ilImageDto = function (Image) {

    }
    function LoadImageLibraryAlbums(imageLibrarySource, options, element) {
        var Albums = [];
        var albums = imageLibrarySource.ImageLibraries[0].ImageAlbums;
        for (var i = 0; i < albums.length; i++) {
            Albums.push(ilAlbumDto(albums[i]));
        }

        $('#ivAlbumsDisplay').empty();
        //Initial First Album
        var template = "<div class=\"btnImageAlbum\"><img src=\"../../Content/${coverArt.ThumbAddress}\" /></div>";

        $.tmpl(template, Albums).appendTo('#ivAlbumsDisplay');
        //$('#ivAlbumsDisplay')
    }
    //        $.ajax({
    //            type: "GET",
    //            url: options.url,
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (msg) { CreateImageLibrary(msg.d, options, element); },
    //            error: function (xhr, ajaxOptions, thrownError) {
    //                alert(xhr.status);
    //                alert(thrownError);
    //            }
    //        });



    function LoadAlbumImages(imagesSource) {

    }
    function GetAlbumImages(albumnId) {

    }
    function LoadImageFromAlbum(imageSource) {

    }
    function GetImageFromAlbum(imageId) {

    }

    function CreateImageLibrary(guestbookSource, options, element) {
        var entries = [];
        var iLibrary = guestbookSource.ImageLibraries[0].ImageAlbums;
    }
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





    function GetImageLibraryTemplates(element) {

    }
})(jQuery)