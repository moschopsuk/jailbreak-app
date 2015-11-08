var TrackingMap = function ($) {
    var tracking = {},
        mapContainer,
        markers = [];

    function addPoint(key, team) {

        mapContainer.gmap3({
            marker : {
                id: key,
                latLng : [team.lat, team.lon],
                events : {
                    mouseover: function( marker ){
                        $( '#marker_' + key ).css( { 'display' : 'block', 'opacity' : 0 } ).stop(true,true).animate( { bottom : '15px', opacity : 1 }, 500 );
                    },
                    mouseout: function( marker ){
                        $( '#marker_' + key ).stop(true,true).animate( { bottom : '50px', opacity : 0 }, 500, function() {
                            $(this).css( { 'display' : 'none' } );
                        });
                    }
                },
            },
            overlay : {
                latLng : [team.lat, team.lon],
                options : {
                    content : '<div id="marker_' + key +'" class="et_marker_info"><div class="location-description" style="background-image: url(/images/teams/'+ team.picture +'.png)"> <div class="location-title"> <h2>' + team.name + '</h2> </div> <div class="location-rating"><span class="et-rating"><span style="width: 68px;">' + team.distance + ' km</span></span></div> </div> <!-- .location-description --> </div> <!-- .et_marker_info -->',
                    offset : {
                        y:-42,
                        x:-122
                    }
                }
            }
        });
    }

    function plotMarkers() {
        $.ajax({
            dataType: "json",
            url: '/api/leaderboard',
        })
        .done(function(teams) {
            $.each(teams, function(key, team) {
                addPoint(key, team);
            });
      });
    }

    function addPolygon(points) {
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };

        mapContainer.gmap3({
            polyline:{
                values:[{
                    options:{
                        path: points
                    }
                }],
                options:{
                    strokeColor: "#2783ba",
                    fillColor : "#2783ba",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    icons: [{
                        icon: lineSymbol,
                        offset: '0%',
                        repeat: '50px'
                    }]
                }
            },
            autofit:{}
        });
    }

    function plotTrack(team) {
        var points =[];

        $.ajax({
            dataType: "json",
            url: '/api/team/' + team,
        })
        .done(function(data) {
            $.each(data.locations, function(key, location) {
                points.push([location.lat, location.lon]);
            });
            points.reverse();
            addPolygon(points);
      });
    }

    tracking.init = function (element) {
        mapContainer = $(element),

        mapContainer.gmap3({
            map:{
                options:{
                    scrollwheel: false,
                    center: [54, -2],
                    zoom: 4
                }
            }
        });
    };

    tracking.plotAll = function () {
        plotMarkers();
    };

    tracking.plot = function (team) {
        plotTrack(team);
    };

    tracking.wipe = function () {
        mapContainer.gmap('clearMarkers');
    }

    return tracking;
}(jQuery);
