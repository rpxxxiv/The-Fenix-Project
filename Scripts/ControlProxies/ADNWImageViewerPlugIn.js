
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
        ImageViewerTemplate: '../../Controls/ImageViewer/ImageViewer.htm',
        ImageViewerImageTemplate: ''
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
        album.uri = Album.__metadata.uri + '/Images?' + options.returnType;
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
        var image = new Object();
        image.Id = Image.ImageId;
        image.Address = Image.ImageAddress;
        image.Thumb = Image.ThumbAddress;
        image.Caption = Image.Description;
        image.DateAdded = Image.DateAdded;
        image.Photographer = Image.Photographer;

        return image;
    }
    function LoadImageLibraryAlbums(imageLibrarySource, options, element) {
        var Albums = [];
        var albums = imageLibrarySource.ImageLibraries[0].ImageAlbums;
        for (var i = 0; i < albums.length; i++) {
            Albums.push(ilAlbumDto(albums[i]));
        }



        $('#ivAlbumsDisplay').empty();
        //Initialize Albums
        //        var template = "<div class=\"btnImageAlbum\" data-uri=\"${uri}\"><img src=\"../../Content/${coverArt.ThumbAddress}\" /></div>";
        //        $.tmpl(template, Albums).appendTo('#ivAlbumsDisplay');

        $('#ivAlbum').tmpl(Albums).appendTo('#ivAlbumsDisplay');
        $('.btnImageAlbum').click(function () {
            var o = $(this).data("uri");
            GetAlbumImages(o);
        });
    }
    function LoadAlbumImages(ImageSource) {
        var Images = [];
        var images = ImageSource;
        for (var i = 0; i < images.length; i++) {
            Images.push(ilImageDto(images[i]));
        }

        $('#ivImagesDisplay>ul').empty();
        $('#ivImage').tmpl(Images).appendTo('#ivImagesDisplay>ul');
        $('.imageHolder').click(function (d) {
            //var image = $.parseJSON($(this).data("imgdata")); //ilImageDto($(this).data("imgdata"));
            var photographer = $(this).data("photographer");
            var address = $(this).data("address");
            var caption = $(this).data("caption");

        });
    }
    function GetAlbumImages(uri) {
        if ($.browser.msie && window.XDomainRequest) {
            var xdr = new XDomainRequest();
            xdr.open("get", uri);
            xdr.onload = function () {
                var JSON = $.parseJSON(xdr.responseText);
                if (JSON == null || typeof (JSON) == 'undefined') {
                    JSON = $.parseJSON(data.firstChild.textContent);
                }
                LoadAlbumImages(JSON.d);
            }
            xdr.send();

        }
        else {
            $.getJSON(
                uri,
                function (msg) {
                    LoadAlbumImages(msg.d);
                }).error(function (jqXHR, textStatus, errorThrown) {
                    alert('Error:' + textStatus + '  Message:' + errorThrown);
                });
        }
    }
    function LoadImageFromAlbum(imageSource) {

    }
    function GetImageFromAlbum(imageId) {

    }

    function GetImageLibraryTemplates(element) {
        if ($('#IV').html()) {
        }
        else {
            $.get(options.ImageViewerTemplate, function (template) {
                $('body').append(template);
                if ($(element)) {
                    ($(element)).remove();
                }
                $('#IV').tmpl().appendTo('body');

                //$('#ivImageDisplay').tmpl().prependTo('body', window.parent.parent.parent.document);
            });
        }
    }
})(jQuery)