require([
    "esri/config",
    "esri/layers/WebTileLayer",
    "esri/Map",
    "esri/Basemap",
    "esri/widgets/BasemapToggle",
    "esri/views/SceneView",
    "esri/views/MapView",
    "dojo/domReady!"
], function(esriConfig, WebTileLayer, Map,
    Basemap, BasemapToggle, SceneView
) {

    esriConfig.request.corsEnabledServers.push("a.tile.stamen.com",
        "b.tile.stamen.com", "c.tile.stamen.com", "d.tile.stamen.com");

    // Create a WebTileLayer with a third-party cached service
    var mapBaseLayer = new WebTileLayer({
        urlTemplate: "http://{subDomain}.tile.stamen.com/terrain/{level}/{col}/{row}.png",
        subDomains: ["a", "b", "c", "d"],
        copyright: "Map tiles by <a href=\"http://stamen.com/\">Stamen Design</a>, " +
            "under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. " +
            "Data by <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>, " +
            "under <a href=\"http://creativecommons.org/licenses/by-sa/3.0\">CC BY SA</a>."
    });

    // Create a Basemap with the WebTileLayer. The thumbnailUrl will be used for
    // the image in the BasemapToggle widget.
    var stamen = new Basemap({
        baseLayers: [mapBaseLayer],
        title: "Terrain",
        id: "terrain",
        thumbnailUrl: "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/409.png"
    });

    var map = new Map({
        basemap: "satellite",
        ground: "world-elevation"
    });

    var initCamera = {
        //heading: 124.7,
        //tilt: 82.9,
        position: {
            latitude: 40.713906,
            longitude: -111.848111,
            //z: 1990
            z: 100000
        }
    };

    var view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: initCamera,
        // The secondary (Stamen) basemap only covers the contiguous USA.
        // Set constraints to make the user unlikely to go to unsupported locations
        constraints: {
            altitude: {
                max: 500000
            }
        }
    });

    view.then(function() {
        // Add a basemap toggle widget to toggle between basemaps
        var toggle = new BasemapToggle({
            titleVisible: true,
            view: view,
            nextBasemap: stamen
        });

        // Add widget to the top right corner of the view
        view.ui.add(toggle, "top-right");
    });
    require(["esri/layers/MapImageLayer", "esri/widgets/Legend", "esri/widgets/Expand"], function(MapImageLayer, Legend, Expand) {
        // points to the states layer in a service storing U.S. census data
        var layer = new MapImageLayer({
            url: "https://maps.geology.utah.gov/arcgis/rest/services/Hazards/Faults_Quaternary/MapServer"
        });
        map.add(layer); // adds the layer to the map

        var legend = new Legend({
            view: view,
            layerInfos: [{
                layer: layer,
                title: "Legend"
            }]
        });
        //view.ui.add(legend, "bottom-right");
        var bgExpand = new Expand({
            view: view,
            content: legend.domNode,
            expandIconClass: "esri-icon-basemap"
        });
        view.ui.add(bgExpand, "bottom-right");
    });

});
