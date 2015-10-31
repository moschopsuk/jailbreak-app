var TrackingMap = function ($) {
    var tracking = {},
        mapContainer = $('#map-container'),
        markers = [];

    function addPoint(key, team) {
        console.log(team);

        mapContainer.gmap3({
            marker : {
                id: key,
                latLng : [team.lat, team.lon],
                events : {
                    mouseover: function( marker ){
                        console.log(marker);
                        $( '#marker_' + key ).css( { 'display' : 'block', 'opacity' : 0 } ).stop(true,true).animate( { bottom : '15px', opacity : 1 }, 500 );
                    },
                    mouseout: function( marker ){
                        console.log(marker);
                        $( '#marker_' + key ).stop(true,true).animate( { bottom : '50px', opacity : 0 }, 500, function() {
                            $(this).css( { 'display' : 'none' } );
                        });
                    }
                },
            },
            overlay : {
                latLng : [team.lat, team.lon],
                options : {
                    content : '<div id="marker_' + key +'" class="et_marker_info"><div class="location-description" style="background-image: url(/images/teams/'+ team.team.picture +'.png)"> <div class="location-title"> <h2>' + team.team.name + '</h2> </div> <div class="location-rating"><span class="et-rating"><span style="width: 68px;">' + team.distance + ' km</span></span></div> </div> <!-- .location-description --> </div> <!-- .et_marker_info -->',
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

    tracking.init = function () {
        mapContainer.gmap3({
            map:{
                options:{
                    center: [54, -2],
                    zoom: 8
                }
            }
        });

        plotMarkers();
    };

    return tracking;
}(jQuery);
