/*jshint globalstrict: true*/
"use strict";

//Engine:
/*global cc*/
//Recursos:
/*global g_res*/
/* ^Declaraciones para JSHint--------------------------------------------- */

/** Created by Sebastián R. Vansteenkiste. See "Readme.md" for more information **/

/* Declaraciones de Constantes */

var LA = LA || {}; //Objeto global al que colgarle cosas sobre la partida
LA.Escenas = LA.Escenas || {};
LA.Capas = LA.Capas || {};
LA.Sprites = LA.Sprites || {};

LA.Mapas = LA.Mapas || {};

LA.Textos= LA.Textos || {};
LA.arrTextos= LA.arrTextos || [];
/* FIN Declaraciones de Constantes */

/* Funciones Auxiliares */

/* FIN Funciones Auxiliares */


var cocos2dApp = cc.Application.extend({

    config:document.ccConfig,
    ctor:function (scene) {
        this._super();
        this.startScene = scene;

        cc.COCOS2D_DEBUG = this.config.COCOS2D_DEBUG;
        cc.initDebugSetting();

        cc.setup(this.config.tag);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        if(cc.RenderDoesnotSupport()){
            //show Information to user
            alert("Browser doesn't support WebGL");
            return false;
        }
        
        // initialize director
        var director = cc.Director.getInstance();

        var screenSize = cc.EGLView.getInstance().getFrameSize();
        var resourceSize = cc.size(800, 450);
		//var resourceSize = cc.size(450, 800);
		var designSize = cc.size(800, 450);
		//var designSize = cc.size(450, 800);

        var searchPaths = [];
        var resDirOrders = [];

        searchPaths.push("res");
        cc.FileUtils.getInstance().setSearchPaths(searchPaths);

        var platform = cc.Application.getInstance().getTargetPlatform();
        
        resDirOrders.push("HD");
        
		cc.FileUtils.getInstance().setSearchResolutionsOrder(resDirOrders);

        director.setContentScaleFactor(resourceSize.width / designSize.width);

        cc.EGLView.getInstance().setDesignResolutionSize(designSize.width, designSize.height, cc.RESOLUTION_POLICY.SHOW_ALL);

        director.setDisplayStats(this.config.showFPS);
        director.setAnimationInterval(1.0 / this.config.frameRate);

        //load resources
        cc.LoaderScene.preload(g_res, function () {
			//TODO: en realidad esto debería (o podría) ir en otro lado, ya que no estoy cargando los textos como recursos sino como archivos de fuente del juego..
			var idiomaLargo = window.navigator.language;
            var idioma;
	        if(idiomaLargo){
	            idioma = idiomaLargo.substring(0,2);
	        } else {
	            idioma = "en"; //Si hubo un error, tomamos inglés por defecto
	        }
			
			if(typeof LA.arrTextos[idioma] !== "undefined" && LA.arrTextos[idioma] !== null){
				LA.Textos=LA.arrTextos[idioma];
			}else{
				LA.Textos=LA.arrTextos["en"];
			}
			
			//Terminada la carga, arranca nomás..
            director.replaceScene(new this.startScene());
        }, this);

        return true;
    }
});

var myApp = new cocos2dApp(LA.Escenas.SceInicial);