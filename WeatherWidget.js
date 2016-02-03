define( ["js/qlik",
  "http://maps.googleapis.com/maps/api/js?sensor=false", 
  "http://maps.gstatic.com/maps-api-v3/api/js/21/4/intl/nl_ALL/main.js", 
  "./SimpleWeather/jquery.simpleWeather", 
  "css!./SimpleWeather/SimpleWeather.css", 
  "css!./SimpleWeather/fontsgoogleapis.css", 
  "css!http://yui.yahooapis.com/pure/0.6.0/pure-min.css",
  "css!./SimpleWeather/output/scoped-bootstrap.css"
  // "css!./SimpleWeather/bootstrap/bootstrap.css"  
],
function (qlik, cssContent) {'use strict';
	return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				settings: {
					uses: "settings",
					items: {
						Listbox: {
							type: "items",
							label: "Widget settings",
							items: {
								TemperatureVariable:{
									ref: "temperature",
									translation: "Customize the variable in which the local temperature is stored",
									type: "string",
									defaultValue: "vTemp"
								},
                CustomLocation : {
                  ref : "cbx_CustomLocation",
                  type : "boolean",
                  label : "Customize your location",
                  defaultValue : false
                  },
                CustomLocationValue:{
                      ref: "ipt_CustomLocation",
                      translation: "Custom location name *",
                      type: "string",
                      defaultValue: "New York",
                      show : function(data) {
                        return data.cbx_CustomLocation;
                      }
                },
                Fahrenheit : {
                  ref : "cbx_Fahrenheit",
                  type : "boolean",
                  label : "Use Fahrenheit",
                  defaultValue : false
                  }					
							}
						}
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ($element, layout) {
            var app = qlik.currApp();
      			var geocoder;
            var self = this, html = "";
            var divWidth = $element.width() / 3 - 40;
            var divHeight = $element.height();
            var displayNone = '';

            if(divWidth < 80){
              divWidth = $element.width()-20;
            }

            if(divHeight < 200){
              displayNone = 'none';
            }

            console.log(divHeight);

            function initialize() {
                geocoder = new google.maps.Geocoder();  
                // console.log(google);
            }

            function getLocation() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
                } else {
                    console.log("Geolocatie bepaling is niet mogelijk in deze browser.");
                   
                }
            }

            function geoSuccess(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                console.log("lat:" + lat + " long:" + lng);
                initialize();       
                codeLatLng(lat, lng);
            }

            function geoError() {
                console.log("Geocodering is gefaald."); 
            }       

            function codeLatLng(lat, lng) {
                var latlng = new google.maps.LatLng(lat, lng);

                geocoder.geocode({'latLng': latlng}, function(results, status) {
                  if(status == google.maps.GeocoderStatus.OK) {
                      // console.log(results)
                      if(results[1]) {
                          //formatted address
                          var address = layout.cbx_CustomLocation == false ? results[1].formatted_address : layout.ipt_CustomLocation;
                          console.log("address = " + address);

                          loadWeather(address, '');
                          // layout.cbx_CustomLocation == false ? loadWeather(address, ''):  loadWeather(layout.ipt_CustomLocation,'');
                      } else {
                          console.log("Geen adres resultaten gevonden."); 
                      }
                  } else {
                      console.log("Geocodering gefaald o.w.v oorzaak: " + status);
                      console.log(google.maps);
                      console.log(results);
                  }
                });
            }

            function loadWeather(location, woeid) {
              $.simpleWeather({
                location: location,
                woeid: woeid,
                unit:  layout.cbx_Fahrenheit == false ? 'c' : 'f',
                success: function(weather) {
                  // html = '<div class="row text-center"><div class="col-lg-6 col-md-12 col-sm-6"><i style="vertical-align:middle;" id="WeatherHead" class="weatherIcon-'+weather.code+'"></i></div><div class="col-lg-6 col-md-12 col-sm-6"><h1 class="text-center vcenter primary" style="font-size:3.5em;">'+weather.temp+'&deg;'+weather.units.temp+'</h1></div></div>';
                  // html += '<div class="row"><div class="col-lg-12 col-md-12 col-sm-4 col-xs-12t well well-sm" style="margin-bottom:3px">'+weather.city+', '+weather.country+'</div>';
                  // html += '<div class="col-lg-12 col-md-12 col-sm-4 col-xs-12 well well-sm" style="margin-bottom:3px">'+weather.currently+'</div>';
                  // html += '<div class="col-lg-12 col-md-12 col-sm-4 col-xs-12 well well-sm" style="margin-bottom:3px">'+weather.alt.temp+'&deg;F </div></div>';  
                  
                  // html = '<div class="bootstrap_inside "><h2 id="weatherWidget"><i style="color: #555;" class="iWeather WeatherIcon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
                  // html += '<div class="button-success pure-button" style="display:inline; margin:10px;">'+weather.city+' '+weather.region+'</div>';
                  // html += '<div class="currently button-success pure-button" style="display:inline; margin: 10px;">'+weather.currently+'</div>';
                  // html += '<div class="button-success pure-button" style="display:inline;  margin: 10px;">'+weather.alt.temp+'&deg;'+weather.alt.unit+'</div></div>'; 

                  html = '<div class="bootstrap_inside"><h2 id="weatherWidget"><i style="color: #555;" class="iWeather WeatherIcon-'+weather.code+'"></i><span style="font-size:bold;"> '+weather.temp+'&deg;'+weather.units.temp+'</span></h2>';
                  html += '<div class="row"><div class="btn btn-default disabled" style="margin: 10px 20px 10px 20px; display:'+ displayNone +'; min-width:' + divWidth + 'px" >'+weather.city+' '+weather.region+'</div>';
                  html += '<div class="btn btn-default disabled" style="margin: 10px 20px 10px 20px; display:'+ displayNone +'; min-width:' + divWidth + 'px">'+weather.currently+'</div>';
                  html += '<div class="btn btn-default disabled" style="margin: 10px 20px 10px 20px; display:'+ displayNone +'; min-width:' + divWidth + 'px">'+weather.alt.temp+'&deg;'+weather.alt.unit+'</div></div></div>'; 

					        $element.html(html); 

                  app.variable.setContent("" + layout.temperature, "" + weather.temp);
                },
                error: function(error) {
                  $("#weather").html('<p>'+error+'</p>');
                }
              });
            }

            getLocation();
		}
	};

} );

