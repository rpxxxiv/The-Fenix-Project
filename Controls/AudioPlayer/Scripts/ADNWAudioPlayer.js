

var AudioLinks;
var songs;
var currentSong;
var player;
var volume;
var isDrag;
var volInterval = .05;
var element;

var options;

var ProxyDefaults = {
    Id: '',
    returnType: '$format=json',
    url: 'http://www.artistdevelopmentnw.com/adnwservicetest/ADNWClientApplicationWebServices.svc/',
    clientApp: 'ClientApplications'
}
//Audio Player Proxy
var apDefaults = {
    theme: '',
    entity: 'AudioLibraries/AudioAlbums/AudioFiles',
    AudioPlayerTemplate: 'Controls/AudioPlayer/Templates/AudioPlayer.htm'
}

$.fn.AudioPlayer = function (options) {
    options = $.extend(true, {}, ProxyDefaults, apDefaults, options);

    if (options.Id != undefined && options.Id != '') {
        options.url = options.url + options.clientApp + "(guid'" + options.Id + "')?" + options.returnType + ((options.entity) ? '&$expand=' + options.entity : '');
    }

    this.each(function (i, _element) {
        element = $(_element);
        var audioPlayer = AudioPlayer(_element, options);
    });
}

function AudioPlayer(element, options) {
    var t = this;
    t.options = options;
    t.element = element;
    AudioPlayerManager(t);
}

function AudioPlayerManager(Source) {
    GetAudioPlayerTemplates(element, options);
    GetAudioLibrary(options);
    //songs = options.AudioLinks;

}

function GetAudioLibrary(options) {
    if ($.browser.msie && window.XDomainRequest) {
        var xdr = new XDomainRequest();
        xdr.open("get", options.url);
        xdr.onload = function () {
            var JSON = $.parseJSON(xdr.responseText);
            if (JSON == null || typeof (JSON) == 'undefined') {
                JSON = $.parseJSON(data.firstChild.textContent);
            }
            LoadAudioLibrary(JSON.d);
            //LoadImageLibraryAlbums(JSON.d, options, element);
        }
        xdr.send();

    }
    else {
        $.getJSON(
                options.url,
                function (msg) {
                    LoadAudioLibrary(msg.d);
                    //LoadImageLibraryAlbums(msg.d, options, element);
                }).error(function (jqXHR, textStatus, errorThrown) {
                    alert('Error:' + textStatus + '  Message:' + errorThrown);
                });
    }

        }

        var apAudioDto = function (Audio) {
            var audioFile = new Object();
            audioFile.ID = Audio.AudioFileId;
            audioFile.Title = Audio.AudioFileName;
            audioFile.Path = Audio.AudioFileAddress;

            return audioFile;
        }

function LoadAudioLibrary(AudioLibrarySource) {
    var AudioFiles = [];
    var audioFiles = AudioLibrarySource.AudioLibraries[0].AudioAlbums[0].AudioFiles; //.AudioAlbums.AudioFiles;
    for (var i = 0; i < audioFiles.length; i++) {
        AudioFiles.push(apAudioDto(audioFiles[i]));
    }
    songs = AudioFiles;
    //var audioFiles = AudioLibrarySource;
    //var audioLibrary = AudioLibrarySource.



    //songs = Songs;
    InitializeAudioPlayer();
}


function SetButtonActions() {
    $('.apButton').mousedown(function () {
        $(this).css({ 'height': 90 + '%', 'width': 90 + '%' });
    });
    $('.apButton').mouseup(function () {
        $(this).css({ 'height': 100 + '%', 'width': 100 + '%' });
    });
    $('.apButton').mouseout(function () {
        $(this).css({ 'height': 100 + '%', 'width': 100 + '%' });
    });
    $('.next').click(function () {
        playNextSong(currentSong);
    });
    $('.previous').click(function () {
        playPreviousSong(currentSong);
    });

    $('.play').click(function () {
        PlayPause();
    });
    $('.volUp').click(function () {
        setVolume(volume + volInterval);
    });
    $('.volDown').click(function () {
        setVolume(volume - volInterval);
    });
    $('.mute').click(function () {
        Mute();
    });
}

function SetButtonMouseOvers() {
    $('.apButton').hover(
            function () {
                $(this).addClass("apButtonHover");
            },
            function () {
                $(this).removeClass("apButtonHover");
            });
}

function loadPlayer(song) {
    player.pause();
    var source = document.createElement('source');
    if (player.canPlayType('audio/mpeg;')) {
        source.type = 'audio/mpeg';
        source.src = 'Content/Audio/' + song.Path + '.mp3';
    } else {
        source.type = 'audio/ogg';
        source.src = 'src', 'Content/Audio/' + song.Path + '.ogg';
    }
    PlayPause();
    player.setAttribute("src", source.src);
    $('#SongTitle').text(song.Title);
    var loaded;
    var loadingIndicator = $('#loading');
    if ((player.buffered != undefined) && (player.buffered.length != 0)) {
        $(player).bind('progress', function () {
            loaded = parseInt(((player.buffered.end(0) / player.duration) * 100), 10);
            loadingIndicator.css({ width: loaded + '%' });
        });
    }
    else {
        loadingIndicator.remove();
    }

    var isLoaded = false;
    $(player).bind('timeupdate', function () {

        var rem = parseInt(player.duration - player.currentTime, 10),
                pos = (player.currentTime / player.duration) * 100,
                mins = Math.floor(rem / 60, 10),
                secs = rem - mins * 60;

        if (player.duration > 0) {
            if (isLoaded == false) {
                isLoaded = true;
            }
            else {
            }
            var duration = calculateTime(player.currentTime) + "  /   " + calculateTime(player.duration);
            var playerPercent = player.currentTime / player.duration;

            $('#Duration').text(duration);
            setDurationProgress(playerPercent);
        }

        if (player.currentTime >= player.duration) {
            playNextSong(currentSong);
        }



        if (!loaded) {
            loaded = true;

        }

    })




    function calculateTime(value) {
        var mins = Math.floor(value / 60);
        var secs = (value - mins * 60).toFixed(0);
        return (mins == 0 ? "0" : mins) + ":" + (secs < 10 ? (secs == 0 ? "00" : "0" + secs) : secs);
    }
    player.play();

}

function setVolume(vol) {
    if ((vol >= 0) && (vol <= 1)) {
        volume = vol;
        player.volume = volume;
    }
    $('.volPercent').css('width', volume * 100 + '%');
}
function setDurationProgress(currentTime) {
    $('.durationPercent').css('width', currentTime * 100 + '%');
}

function playNextSong(index) {
    ++index;
    if (index >= songs.length) {
        index = 0;
    }
    currentSong = index;
    loadPlayer(songs[index]); ;
}

function playPreviousSong(index) {
    --index;
    if (index < 0) {
        index = songs.length - 1;
    }
    currentSong = index;
    loadPlayer(songs[index]); ;
}

function PlayPause() {
    if (player.paused == false) {
        player.pause();
        $('.play').css('background-image', "url('Controls/AudioPlayer/Images/Play.png')");
    }
    else {
        player.play();
        $('.play').css('background-image', "url('Controls/AudioPlayer/Images/Pause.png')");

    }
}

function Mute() {
    if (player.volume != 0) {
        volume = player.volume;
        player.volume = 0;
        $('.mute').css('background-image', "url('Controls/AudioPlayer/Images/Mute.png')");
    }
    else {
        player.volume = volume;
        $('.mute').css('background-image', "url('Controls/AudioPlayer/Images/Sound.png')");
    }
}

function GetAudioPlayerTemplates(element, options) {
    if ($('#AP').html()) {
    }
    else {
        $.get(
                options.AudioPlayerTemplate,
                function (template) {
                    $('body').append(template);
                    if ($(element)) {
                        ($(element)).remove();
                    }
                    $('#AP').tmpl().appendTo('body');
                    var pos = new Array();
                    var e = $(element).css('position');
                    var t = $(element).css('top');
                    var l = $(element).css('left');
                    var r = $(element).css('right');
                    var b = $(element).css('bottom');

                    if (e != 'undefined' && e != 'relative') {
                        pos.push({ 'position': e });
                        $('#Player').css('position', e);
                        if (t != 'undefined' && t != 'auto') {
                            pos.push({ 'top': t });
                            $('#Player').css('top', t);
                        }
                        if (l != 'undefined' && l != 'auto') {
                            pos.push({ 'left': l });
                            $('#Player').css('left', l);
                        }
                        if (r != 'undefined' && r != 'auto') {
                            pos.push({ 'right': r });
                            $('#Player').css('right', r);
                        }
                        if (b != 'undefined' && b != 'auto') {
                            pos.push({ 'bottom': b });
                            $('#Player').css('bottom', b);
                        }
                    };

                    //InitializeAudioPlayer();
                });
    }
}
function InitializeAudioPlayer() {
    player = new Audio();
    setVolume(.4);
    SetButtonActions();
    SetButtonMouseOvers();
    playNextSong(songs.length);
}


//    });