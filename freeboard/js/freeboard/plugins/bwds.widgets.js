// # Building a Freeboard Plugin
//
// A freeboard plugin is simply a javascript file that is loaded into a web page after the main freeboard.js file is loaded.
//
// Let's get started with an example of a datasource plugin and a widget plugin.
//
// -------------------

// Best to encapsulate your plugin in a closure, although not required.
(function()
{
	// ## A Datasource Plugin
	//
	// -------------------
	// ### Datasource Definition
	//
	// -------------------
	// **freeboard.loadDatasourcePlugin(definition)** tells freeboard that we are giving it a datasource plugin. It expects an object with the following:
	freeboard.loadDatasourcePlugin({
		"type_name"   : "ssn_to_datum",
		// **display_name** : The pretty name that will be used for display purposes for this plugin. If the name is not defined, type_name will be used instead.
		"display_name": "BWDS Semantic Sensor Network Point Adapter",
                // **description** : A description of the plugin. This description will be displayed when the plugin is selected or within search results (in the future). The description may contain HTML if needed.
                "description" : "Extract Semantic Sensor Network data from the <a href='https://apps.opensheffield.org/sparql'>BWDS Linked Data Endpoint</a> and covert it to points suitable for consumption by the heat map widget",
		// **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
		"external_scripts" : [
			// "http://mydomain.com/myscript1.js", "http://mydomain.com/myscript2.js"
		],
		// **settings** : An array of settings that will be displayed for this plugin when the user adds it.
		"settings"    : [
			{
				// **name** (required) : The name of the setting. This value will be used in your code to retrieve the value specified by the user. This should follow naming conventions for javascript variable and function declarations.
				"name"         : "postcode",
				// **display_name** : The pretty name that will be shown to the user when they adjust this setting.
				"display_name" : "Postcode",
				// **type** (required) : The type of input expected for this setting. "text" will display a single text box input. Examples of other types will follow in this documentation.
				"type"         : "text",
				// **default_value** : A default value for this setting.
				"default_value": "S3 8PZ",
				// **description** : Text that will be displayed below the setting to give the user any extra information.
				"description"  : "Centroid of the data values..."
			},
			{
				"name"         : "refresh_time",
				"display_name" : "Refresh Time",
				"type"         : "text",
				"description"  : "In milliseconds",
				"default_value": 5000
			}
		],
		// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
		// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
		// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
		// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			// myDatasourcePlugin is defined below.
			newInstanceCallback(new BWDSSSNPointDatasourcePlugin(settings, updateCallback));
		}
	});


	// ### Datasource Implementation
	//
	// -------------------
	// Here we implement the actual datasource plugin. We pass in the settings and updateCallback.
	var BWDSSSNPointDatasourcePlugin = function(settings, updateCallback)
	{
		// Always a good idea...
		var self = this;

		// Good idea to create a variable to hold on to our settings, because they might change in the future. See below.
		var currentSettings = settings;

		/* This is some function where I'll get my data from somewhere */
		function getData()
		{
			var newData = { 
                           readings:[ [37.782551, -122.445368], [37.782745, -122.444586], [37.782842, -122.443688], [37.782919, -122.442815], [37.782992, -122.442112], [37.783100, -122.441461], [37.783206, -122.440829], [37.783273, -122.440324], [37.783316, -122.440023], [37.783357, -122.439794], [37.783371, -122.439687], [37.783368, -122.439666], [37.783383, -122.439594], [37.783508, -122.439525], [37.783842, -122.439591], [37.784147, -122.439668], [37.784206, -122.439686], [37.784386, -122.439790], [37.784701, -122.439902], [37.784965, -122.439938], [37.785010, -122.439947], [37.785360, -122.439952], [37.785715, -122.440030], [37.786117, -122.440119], [37.786564, -122.440209], [37.786905, -122.440270], [37.786956, -122.440279], [37.800224, -122.433520], [37.800155, -122.434101], [37.800160, -122.434430], [37.800378, -122.434527], [37.800738, -122.434598], [37.800938, -122.434650], [37.801024, -122.434889], [37.800955, -122.435392], [37.800886, -122.435959], [37.800811, -122.436275], [37.800788, -122.436299], [37.800719, -122.436302], [37.800702, -122.436298], [37.800661, -122.436273], [37.800395, -122.436172], [37.800228, -122.436116], [37.800169, -122.436130], [37.800066, -122.436167], [37.784345, -122.422922], [37.784389, -122.422926], [37.784437, -122.422924], [37.784746, -122.422818], [37.785436, -122.422959], [37.786120, -122.423112], [37.786433, -122.423029], [37.786631, -122.421213], [37.786660, -122.421033], [37.786801, -122.420141], [37.786823, -122.420034], [37.786831, -122.419916], [37.787034, -122.418208], [37.787056, -122.418034], [37.787169, -122.417145], [37.787217, -122.416715], [37.786144, -122.416403], [37.785292, -122.416257], [37.780666, -122.390374], [37.780501, -122.391281], [37.780148, -122.392052], [37.780173, -122.391148], [37.780693, -122.390592], [37.781261, -122.391142], [37.781808, -122.391730], [37.782340, -122.392341], [37.782812, -122.393022], [37.783300, -122.393672], [37.783809, -122.394275], [37.784246, -122.394979], [37.784791, -122.395958], [37.785675, -122.396746], [37.786262, -122.395780], [37.786776, -122.395093], [37.787282, -122.394426], [37.787783, -122.393767], [37.788343, -122.393184], [37.788895, -122.392506], [37.789371, -122.391701], [37.789722, -122.390952], [37.790315, -122.390305], [37.790738, -122.389616], [37.779448, -122.438702], [37.779023, -122.438585], [37.778542, -122.438492], [37.778100, -122.438411], [37.777986, -122.438376], [37.777680, -122.438313], [37.777316, -122.438273], [37.777135, -122.438254], [37.776987, -122.438303], [37.776946, -122.438404], [37.776944, -122.438467], [37.776892, -122.438459], [37.776842, -122.438442], [37.776822, -122.438391], [37.776814, -122.438412], [37.776787, -122.438628], [37.776729, -122.438650], [37.776759, -122.438677], [37.776772, -122.438498], [37.776787, -122.438389], [37.776848, -122.438283], [37.776870, -122.438239], [37.777015, -122.438198], [37.777333, -122.438256], [37.777595, -122.438308], [37.777797, -122.438344], [37.778160, -122.438442], [37.778414, -122.438508], [37.778445, -122.438516], [37.778503, -122.438529], [37.778607, -122.438549], [37.778670, -122.438644], [37.778847, -122.438706], [37.779240, -122.438744], [37.779738, -122.438822], [37.780201, -122.438882], [37.780400, -122.438905], [37.780501, -122.438921], [37.780892, -122.438986], [37.781446, -122.439087], [37.781985, -122.439199], [37.782239, -122.439249], [37.782286, -122.439266], [37.797847, -122.429388], [37.797874, -122.429180], [37.797885, -122.429069], [37.797887, -122.429050], [37.797933, -122.428954], [37.798242, -122.428990], [37.798617, -122.429075], [37.798719, -122.429092], [37.798944, -122.429145], [37.799320, -122.429251], [37.799590, -122.429309], [37.799677, -122.429324], [37.799966, -122.429360], [37.800288, -122.429430], [37.800443, -122.429461], [37.800465, -122.429474], [37.800644, -122.429540], [37.800948, -122.429620], [37.801242, -122.429685], [37.801375, -122.429702], [37.801400, -122.429703], [37.801453, -122.429707], [37.801473, -122.429709], [37.801532, -122.429707], [37.801852, -122.429729], [37.802173, -122.429789], [37.802459, -122.429847], [37.802554, -122.429825], [37.802647, -122.429549], [37.802693, -122.429179], [37.802729, -122.428751], [37.766104, -122.409291], [37.766103, -122.409268], [37.766138, -122.409229], [37.766183, -122.409231], [37.766153, -122.409276], [37.766005, -122.409365], [37.765897, -122.409570], [37.765767, -122.409739], [37.765693, -122.410389], [37.765615, -122.411201], [37.765533, -122.412121], [37.765467, -122.412939], [37.765444, -122.414821], [37.765444, -122.414964], [37.765318, -122.415424], [37.763961, -122.415296], [37.763115, -122.415196], [37.762967, -122.415183], [37.762278, -122.415127], [37.761675, -122.415055], [37.760932, -122.414988], [37.759337, -122.414862], [37.773187, -122.421922], [37.773043, -122.422118], [37.773007, -122.422165], [37.772979, -122.422219], [37.772865, -122.422394], [37.772779, -122.422503], [37.772676, -122.422701], [37.772606, -122.422806], [37.772566, -122.422840], [37.772508, -122.422852], [37.772387, -122.423011], [37.772099, -122.423328], [37.771704, -122.423783], [37.771481, -122.424081], [37.771400, -122.424179], [37.771352, -122.424220], [37.771248, -122.424327], [37.770904, -122.424781], [37.770520, -122.425283], [37.770337, -122.425553], [37.770128, -122.425832], [37.769756, -122.426331], [37.769300, -122.426902], [37.769132, -122.427065], [37.769092, -122.427103], [37.768979, -122.427172], [37.768595, -122.427634], [37.768372, -122.427913], [37.768337, -122.427961], [37.768244, -122.428138], [37.767942, -122.428581], [37.767482, -122.429094], [37.767031, -122.429606], [37.766732, -122.429986], [37.766680, -122.430058], [37.766633, -122.430109], [37.766580, -122.430211], [37.766367, -122.430594], [37.765910, -122.431137], [37.765353, -122.431806], [37.764962, -122.432298], [37.764868, -122.432486], [37.764518, -122.432913], [37.763435, -122.434173], [37.762847, -122.434953], [37.762291, -122.435935], [37.762224, -122.436074], [37.761957, -122.436892], [37.761652, -122.438886], [37.761284, -122.439955], [37.761210, -122.440068], [37.761064, -122.440720], [37.761040, -122.441411], [37.761048, -122.442324], [37.760851, -122.443118], [37.759977, -122.444591], [37.759913, -122.444698], [37.759623, -122.445065], [37.758902, -122.445158], [37.758428, -122.444570], [37.757687, -122.443340], [37.757583, -122.443240], [37.757019, -122.442787], [37.756603, -122.442322], [37.756380, -122.441602], [37.755790, -122.441382], [37.754493, -122.442133], [37.754361, -122.442206], [37.753719, -122.442650], [37.753096, -122.442915], [37.751617, -122.443211], [37.751496, -122.443246], [37.750733, -122.443428], [37.750126, -122.443536], [37.750103, -122.443784], [37.750390, -122.444010], [37.750448, -122.444013], [37.750536, -122.444040], [37.750493, -122.444141], [37.790859, -122.402808], [37.790864, -122.402768], [37.790995, -122.402539], [37.791148, -122.402172], [37.791385, -122.401312], [37.791405, -122.400776], [37.791288, -122.400528], [37.791113, -122.400441], [37.791027, -122.400395], [37.791094, -122.400311], [37.791211, -122.400183], [37.791060, -122.399334], [37.790538, -122.398718], [37.790095, -122.398086], [37.789644, -122.397360], [37.789254, -122.396844], [37.788855, -122.396397], [37.788483, -122.395963], [37.788015, -122.395365], [37.787558, -122.394735], [37.787472, -122.394323], [37.787630, -122.394025], [37.787767, -122.393987], [37.787486, -122.394452], [37.786977, -122.395043], [37.786583, -122.395552], [37.786540, -122.395610], [37.786516, -122.395659], [37.786378, -122.395707], [37.786044, -122.395362], [37.785598, -122.394715], [37.785321, -122.394361], [37.785207, -122.394236], [37.785751, -122.394062], [37.785996, -122.393881], [37.786092, -122.393830], [37.785998, -122.393899], [37.785114, -122.394365], [37.785022, -122.394441], [37.784823, -122.394635], [37.784719, -122.394629], [37.785069, -122.394176], [37.785500, -122.393650], [37.785770, -122.393291], [37.785839, -122.393159], [37.782651, -122.400628], [37.782616, -122.400599], [37.782702, -122.400470], [37.782915, -122.400192], [37.783137, -122.399887], [37.783414, -122.399519], [37.783629, -122.399237], [37.783688, -122.399157], [37.783716, -122.399106], [37.783798, -122.399072], [37.783997, -122.399186], [37.784271, -122.399538], [37.784577, -122.399948], [37.784828, -122.400260], [37.784999, -122.400477], [37.785113, -122.400651], [37.785155, -122.400703], [37.785192, -122.400749], [37.785278, -122.400839], [37.785387, -122.400857], [37.785478, -122.400890], [37.785526, -122.401022], [37.785598, -122.401148], [37.785631, -122.401202], [37.785660, -122.401267], [37.803986, -122.426035], [37.804102, -122.425089], [37.804211, -122.424156], [37.803861, -122.423385], [37.803151, -122.423214], [37.802439, -122.423077], [37.801740, -122.422905], [37.801069, -122.422785], [37.800345, -122.422649], [37.799633, -122.422603], [37.799750, -122.421700], [37.799885, -122.420854], [37.799209, -122.420607], [37.795656, -122.400395], [37.795203, -122.400304], [37.778738, -122.415584], [37.778812, -122.415189], [37.778824, -122.415092], [37.778833, -122.414932], [37.778834, -122.414898], [37.778740, -122.414757], [37.778501, -122.414433], [37.778182, -122.414026], [37.777851, -122.413623], [37.777486, -122.413166], [37.777109, -122.412674], [37.776743, -122.412186], [37.776440, -122.411800], [37.776295, -122.411614], [37.776158, -122.411440], [37.775806, -122.410997], [37.775422, -122.410484], [37.775126, -122.410087], [37.775012, -122.409854], [37.775164, -122.409573], [37.775498, -122.409180], [37.775868, -122.408730], [37.776256, -122.408240], [37.776519, -122.407928], [37.776539, -122.407904], [37.776595, -122.407854], [37.776853, -122.407547], [37.777234, -122.407087], [37.777644, -122.406558], [37.778066, -122.406017], [37.778468, -122.405499], [37.778866, -122.404995], [37.779295, -122.404455], [37.779695, -122.403950], [37.779982, -122.403584], [37.780295, -122.403223], [37.780664, -122.402766], [37.781043, -122.402288], [37.781399, -122.401823], [37.781727, -122.401407], [37.781853, -122.401247], [37.781894, -122.401195], [37.782076, -122.400977], [37.782338, -122.400603], [37.782666, -122.400133], [37.783048, -122.399634], [37.783450, -122.399198], [37.783791, -122.398998], [37.784177, -122.398959], [37.784388, -122.398971], [37.784404, -122.399128], [37.784586, -122.399524], [37.784835, -122.399927], [37.785116, -122.400307], [37.785282, -122.400539], [37.785346, -122.400692], [37.765769, -122.407201], [37.765790, -122.407414], [37.765802, -122.407755], [37.765791, -122.408219], [37.765763, -122.408759], [37.765726, -122.409348], [37.765716, -122.409882], [37.765708, -122.410202], [37.765705, -122.410253], [37.765707, -122.410369], [37.765692, -122.410720], [37.765699, -122.411215], [37.765687, -122.411789], [37.765666, -122.412373], [37.765598, -122.412883], [37.765543, -122.413039], [37.765532, -122.413125], [37.765500, -122.413553], [37.765448, -122.414053], [37.765388, -122.414645], [37.765323, -122.415250], [37.765303, -122.415847], [37.765251, -122.416439], [37.765204, -122.417020], [37.765172, -122.417556], [37.765164, -122.418075], [37.765153, -122.418618], [37.765136, -122.419112], [37.765129, -122.419378], [37.765119, -122.419481], [37.765100, -122.419852], [37.765083, -122.420349], [37.765045, -122.420930], [37.764992, -122.421481], [37.764980, -122.421695], [37.764993, -122.421843], [37.764986, -122.422255], [37.764975, -122.422823], [37.764939, -122.423411], [37.764902, -122.424014], [37.764853, -122.424576], [37.764826, -122.424922], [37.764796, -122.425375], [37.764782, -122.425869], [37.764768, -122.426089], [37.764766, -122.426117], [37.764723, -122.426276], [37.764681, -122.426649], [37.782012, -122.404200], [37.781574, -122.404911], [37.781055, -122.405597], [37.780479, -122.406341], [37.779996, -122.406939], [37.779459, -122.407613], [37.778953, -122.408228], [37.778409, -122.408839], [37.777842, -122.409501], [37.777334, -122.410181], [37.776809, -122.410836], [37.776240, -122.411514], [37.775725, -122.412145], [37.775190, -122.412805], [37.774672, -122.413464], [37.774084, -122.414186], [37.773533, -122.413636], [37.773021, -122.413009], [37.772501, -122.412371], [37.771964, -122.411681], [37.771479, -122.411078], [37.770992, -122.410477], [37.770467, -122.409801], [37.770090, -122.408904], [37.769657, -122.408103], [37.769132, -122.407276], [37.768564, -122.406469], [37.767980, -122.405745], [37.767380, -122.405299], [37.766604, -122.405297], [37.765838, -122.405200], [37.765139, -122.405139], [37.764457, -122.405094], [37.763716, -122.405142], [37.762932, -122.405398], [37.762126, -122.405813], [37.761344, -122.406215], [37.760556, -122.406495], [37.759732, -122.406484], [37.758910, -122.406228], [37.758182, -122.405695], [37.757676, -122.405118], [37.757039, -122.404346], [37.756335, -122.403719], [37.755503, -122.403406], [37.754665, -122.403242], [37.753837, -122.403172], [37.752986, -122.403112], [37.751266, -122.403355]] };

			/* Get my data from somewhere and populate newData with it... Probably a JSON API or something. */
			/* ... */

			// I'm calling updateCallback to tell it I've got new data for it to munch on.
			updateCallback(newData);
		}

		// You'll probably want to implement some sort of timer to refresh your data every so often.
		var refreshTimer;

		function createRefreshTimer(interval)
		{
			if(refreshTimer)
			{
				clearInterval(refreshTimer);
			}

			refreshTimer = setInterval(function()
			{
				// Here we call our getData function to update freeboard with new data.
				getData();
			}, interval);
		}

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{
			// Here we update our current settings with the variable that is passed in.
			currentSettings = newSettings;
		}

		// **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function()
		{
			// Most likely I'll just call getData() here.
			getData();
		}

		// **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function()
		{
			// Probably a good idea to get rid of our timer.
			clearInterval(refreshTimer);
			refreshTimer = undefined;
		}

		// Here we call createRefreshTimer with our current settings, to kick things off, initially. Notice how we make use of one of the user defined settings that we setup earlier.
		createRefreshTimer(currentSettings.refresh_time);
	}
	// ## A Widget Plugin
	//
	// -------------------
	// ### Widget Definition
	// Display diffusion tube data as a google heat map
	// -------------------
	// **freeboard.loadWidgetPlugin(definition)** tells freeboard that we are giving it a widget plugin. It expects an object with the following:
	freeboard.loadWidgetPlugin({
		// Same stuff here as with datasource plugin.
		"type_name"   : "bwds_heat_map",
		"display_name": "Heat Map",
                "description" : "Visualise Point Data as a Google Heat Map",
		// **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
		"external_scripts": [
			"/freeboard/js/plugins/aqhm.js"
		],
		// **fill_size** : If this is set to true, the widget will fill be allowed to fill the entire space given it, otherwise it will contain an automatic padding of around 10 pixels around it.
		"fill_size" : false,
		"settings"    : [
			{
				"name"        : "Postcode",
				"display_name": "Postcode",
				// We'll use a calculated setting because we want what's displayed in this widget to be dynamic based on something changing (like a datasource).
				"type"        : "calculated"
			},
			{
				"name"        : "DisplayName",
				"display_name": "Name",
				// We'll use a calculated setting because we want what's displayed in this widget to be dynamic based on something changing (like a datasource).
				"type"        : "calculated"
			},
			{
				"name"        : "size",
				"display_name": "Size",
				"type"        : "option",
				"options"     : [
					{
						"name" : "Regular",
						"value": "regular"
					},
					{
						"name" : "Big",
						"value": "big"
					}
				]
			}
		],
		// Same as with datasource plugin, but there is no updateCallback parameter in this case.
		newInstance   : function(settings, newInstanceCallback)
		{
			newInstanceCallback(new BWDSHeatMapPlugin(settings));
		}
	});

	// ### Widget Implementation
	//
	// -------------------
	// Here we implement the actual widget plugin. We pass in the settings;
	var BWDSHeatMapPlugin = function(settings)
	{
		var self = this;
		var currentSettings = settings;

		// Here we create an element to hold the text we're going to display. We're going to set the value displayed in it below.
		var myTextElement = $("<span>Air Quality</span>");

		// **render(containerElement)** (required) : A public function we must implement that will be called when freeboard wants us to render the contents of our widget. The container element is the DIV that will surround the widget.
		self.render = function(containerElement)
		{
			// Here we append our text element to the widget container element.
			$(containerElement).append(myTextElement);
		}

		// **getHeight()** (required) : A public function we must implement that will be called when freeboard wants to know how big we expect to be when we render, and returns a height. This function will be called any time a user updates their settings (including the first time they create the widget).
		//
		// Note here that the height is not in pixels, but in blocks. A block in freeboard is currently defined as a rectangle that is fixed at 300 pixels wide and around 45 pixels multiplied by the value you return here.
		//
		// Blocks of different sizes may be supported in the future.
		self.getHeight = function()
		{
			if(currentSettings.size == "big")
			{
				return 2;
			}
			else
			{
				return 1;
			}
		}

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{
			// Normally we'd update our text element with the value we defined in the user settings above (the_text), but there is a special case for settings that are of type **"calculated"** -- see below.
			currentSettings = newSettings;
		}

		// **onCalculatedValueChanged(settingName, newValue)** (required) : A public function we must implement that will be called when a calculated value changes. Since calculated values can change at any time (like when a datasource is updated) we handle them in a special callback function here.
		self.onCalculatedValueChanged = function(settingName, newValue)
		{
			// Remember we defined "the_text" up above in our settings.
			if(settingName == "the_text")
			{
				// Here we do the actual update of the value that's displayed in on the screen.
				$(myTextElement).html(newValue);
			}
		}

		// **onDispose()** (required) : Same as with datasource plugins.
		self.onDispose = function()
		{
		}
	}
}());
