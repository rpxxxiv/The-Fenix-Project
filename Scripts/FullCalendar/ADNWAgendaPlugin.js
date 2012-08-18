/*
ADNWAgendaPlugIn.Js
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


var fc = $.fullCalendar;
var formatDate = fc.formatDate;
var parseISO8601 = fc.parseISO8601;
var addDays = fc.addDays;
var applyAll = fc.applyAll;

var maxResults = 25;

(function ($, undefined) {

var options;


var gcDefaults = {
    'singleevents': true,
    'futureevents': true,
    'orderby': 'starttime',
    'sortorder':'ascending',
    'max-results': maxResults
}    
    


var ProxyDefaults = {
    theme:'Styles/Agenda.css',
    url:'http://www.google.com/calendar/feeds/firstfenix@gmail.com/public/full?alt=json-in-script&callback=?',
    maxResults: 25
}

$.fn.Agenda = function(opts)
{
options = $.extend(true,{},ProxyDefaults, opts);
    gcDefaults['max-results'] = options.maxResults;
    $.ajax({
        url: options.url,
        dataType: 'jsonp',
        data: gcDefaults,
        startParam: false,
        endParam: false,
        success: function (data) {
            var events = [];
            if (data.feed.entry) {
                $.each(data.feed.entry, function (i, entry) {
                    events.push(jsonCreateCalendarItem(entry));
                });
            }
            $("#Event").tmpl(events).appendTo("#Events");

            $(".EventItem").click(function (data) {
                var d = $(this).attr('data-url');
                window.open(d, 'gcalevent', 'width=700,height=600');
            });
        }
    });
    function jsonCreateCalendarItem(entry) {
        var calItem = new Object();
        calItem.url = entry.link[0].href;
        calItem.title = entry.title.$t;
        calItem.content = entry.content.$t;
        if (entry['gd$when']) {
            var startStr = parseISO8601(entry['gd$when'][0].startTime, true);
            var endStr = parseISO8601(entry['gd$when'][0].endTime, true);
            var sd = new Date(startStr);  //new Date(entry['gd$when'][0].startTime);
            var ed = new Date(endStr);
            calItem.StartDateSort = sd;
            calItem.EndDateSort = ed;
            calItem.startTime = ((sd.getHours() > 12) ? sd.getHours() - 12 : (sd.getHours() == 0) ? '12' : sd.getHours()) + ':' + ((sd.getMinutes() < 10) ? '0' + sd.getMinutes() : sd.getMinutes()) + ' ' + ((sd.getHours() >= 12) ? 'PM' : 'AM');
            calItem.endTime = ((ed.getHours() > 12) ? ed.getHours() - 12 : (ed.getHours() == 0) ? '12' : ed.getHours()) + ':' + ((ed.getMinutes() < 10) ? '0' + ed.getMinutes() : ed.getMinutes()) + ' ' + ((ed.getHours() >= 12) ? 'PM' : 'AM');
            sd.setHours(0, 0, 0);
            ed.setHours(0, 0, 0);
            calItem.startDate = (sd.getMonth() + 1) + '/' + sd.getDate() + '/' + sd.getFullYear();
            calItem.endDate = (ed.getMonth() + 1) + '/' + ed.getDate() + '/' + ed.getFullYear(); ;
            calItem.Time = calItem.startTime + ' - ' + calItem.endTime;
            calItem.EventDate = calItem.startDate;
            if (entry['gd$when'][0].startTime.indexOf('T') == -1) {
                calItem.Time = 'All Day';
            }

            if (Date.parse(calItem.endDate) > Date.parse(calItem.startDate)) {
                calItem.EventDate = calItem.startDate + ' - ' + calItem.endDate;
            }
        }
        if (entry['gd$where']) {
            calItem.where = entry['gd$where'][0].valueString;
        }
        return calItem;
    }
    function CreateCalendarItem(entry) {
        var calItem = new Object();
        calItem.title = $('title', entry).text();
        calItem.content = $('content', entry).text();
        if ($(entry).find("gd\\:when")) {
            var sd = new Date($(entry).find("gd\\:when").attr('startTime'));
            var ed = new Date($(entry).find("gd\\:when").attr('endTime'));
            calItem.startTime = ((sd.getHours() > 12) ? sd.getHours() - 12 : (sd.getHours() == 0) ? '12' : sd.getHours()) + ':' + ((sd.getMinutes() < 10) ? '0' + sd.getMinutes() : sd.getMinutes()) + ' ' + ((sd.getHours() >= 12) ? 'PM' : 'AM');
            calItem.endTime = ((ed.getHours() > 12) ? ed.getHours() - 12 : (ed.getHours() == 0) ? '12' : ed.getHours()) + ':' + ((ed.getMinutes() < 10) ? '0' + ed.getMinutes() : ed.getMinutes()) + ' ' + ((ed.getHours() >= 12) ? 'PM' : 'AM');
            sd.setHours(0, 0, 0);
            ed.setHours(0, 0, 0);
            calItem.startDate = (sd.getMonth() + 1) + '/' + sd.getDate() + '/' + sd.getFullYear();
            calItem.endDate = (ed.getMonth() + 1) + '/' + ed.getDate() + '/' + ed.getFullYear(); ;

            if (Date.parse(calItem.endDate) > Date.parse(calItem.startDate)) {
                calItem.Date = calItem.startDate + ' - ' + calItem.endDate;
            }
        }
        if ($(entry).find("gd\\:where")) {
            calItem.where = $(entry).find("gd\\:where").attr('valueString');
        }
        return calItem;
    }
}
})(jQuery)