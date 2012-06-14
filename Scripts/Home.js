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

    var ProxyDefaults = {
        Id: '',
        returnType: '$format=json',
        url: 'http://www.artistdevelopmentnw.com/adnwservicetest/ADNWClientApplicationWebServices.svc/',
        clientApp: 'ClientApplications',
        UpcomingEvents: false,
        Members: false,
        LatestGuestbook: false
    }

    $.fn.ADNWProxy = function (opts) {
        options = $.extend(true, {}, ProxyDefaults, gbDefaults, opts);

        if (options.Members) {
        }
        if (options.LatestGuestbook) {
        }

        if (options.Id != undefined && options.Id != '') {
            options.url = options.url + options.clientApp + "(guid'" + options.Id + "')?" + options.returnType + ((options.entity) ? '&$expand=' + options.entity : '');
        }
        this.each(function (i, _element) {
            var element = $(_element);
            Guestbook(element, options);

        });
    }

    $.fn.CalendarProxy = function (opts) {

    }

})