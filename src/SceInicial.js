/*jshint globalstrict: true*/
"use strict";

//Engine:
/*global cc*/
//Rescursos:
/*global s_res*/
/* ^Declaraciones para JSHint--------------------------------------------- */

/** Created by Sebastián R. Vansteenkiste. See "Readme.md" for more information **/
var LA = LA || {};
LA.Escenas = LA.Escenas || {}; //TODO: revisar si vale la pena dividir así..
LA.Capas = LA.Capas || {}; //TODO: revisar si vale la pena dividir así..

//Capa Creadores
LA.Capas.LayCreadores = cc.LayerColor.extend({
	init:function(){
		this._super(cc.c4b(0,0,0,0), LA.size.width, LA.size.height);
		var eso = this;
		
		var lblSebastian = cc.LabelTTF.create("Sebastián \"ZippoLag\" Vansteenkiste", "Trebuchet MS", 24);
		lblSebastian.setOpacity(0);
		lblSebastian.setPosition(cc.p(LA.cw, LA.ch));
		this.addChild(lblSebastian, 1);
		
		var actAparecer = cc.FadeIn.create(1.5); //TODO: encontrar forma de animar directamente la capa desde la escena y no tener que andar haciendo esto dentro de cada capa para cada elemento que tenga..
		
		this.runAction(
			//cc.Sequence.create(
                cc.CallFunc.create(function(){				
					lblSebastian.runAction(actAparecer.clone());
                })
			//)
        );
	}
});

//Capa de Agradecimientos
LA.Capas.LayAgradecimientos = cc.LayerColor.extend({
	init:function(){
		this._super(cc.c4b(0,0,0,0), LA.size.width, LA.size.height);
		var eso = this;
		
		var sprAgradecimientos = cc.Sprite.create(s_res.mscAgradecimientos);
		sprAgradecimientos.setOpacity(0);
		sprAgradecimientos.setAnchorPoint(cc.p(0,0));
        sprAgradecimientos.setPosition(cc.p(0, 0));
        sprAgradecimientos.setScale(1);
        this.addChild(sprAgradecimientos, 0);
		
		var lblAgradecimientos = cc.LabelTTF.create(LA.Textos.gracias, "Trebuchet MS", 40);
		lblAgradecimientos.setOpacity(0);
		lblAgradecimientos.setPosition(cc.p(LA.cw, Math.floor(LA.size.height*0.9)));
		this.addChild(lblAgradecimientos, 1);
		
		var actAparecer = cc.FadeIn.create(1.5);
		
		this.runAction(
			cc.CallFunc.create(
				function(){
					sprAgradecimientos.runAction(actAparecer.clone());
					lblAgradecimientos.runAction(actAparecer.clone());
                })
		);
	}		
});

//Capa Menú Principal
LA.Capas.LayMenuPrincipal = cc.LayerColor.extend({
    isMouseDown:false,

    init:function (color, ancho, alto) {
        this._super(color, ancho, alto);
		var eso = this;
        
		//creamos el logo
		var sprLogo = cc.Sprite.create(s_res.logo);
		sprLogo.setAnchorPoint(cc.p(0,0));
        sprLogo.setPosition(cc.p(0, 0));
        sprLogo.setOpacity(0);
        this.addChild(sprLogo, 0);


		//menú al cual se deben agregar los menu items
		var mMenuPrincipal = cc.Menu.create();
		mMenuPrincipal.setPosition(cc.p(0,0));		
		
		var btnJugar = cc.MenuItemLabel.create(
			cc.LabelTTF.create(LA.Textos.comenzar, "Trebuchet MS", 30),
			function(){
				var sceJuego = cc.TransitionFade.create(1.2, new LA.Escenas.SceJuego(), cc.c3b(0,0,0));
                cc.Director.getInstance().replaceScene(sceJuego);
			},
			this
		);
		btnJugar.setPosition(cc.p(LA.cw, LA.size.height*0.6));
		mMenuPrincipal.addChild(btnJugar);		
		
        //creamos las acciones que serán usadas para la animación
        var actRotar = cc.RotateTo.create(2, 0);
        actRotar = cc.EaseElasticOut.create(actRotar,0.4);
        var actEscalar = cc.ScaleTo.create(2, 0.7, 0.7);
        actEscalar = cc.EaseElasticOut.create(actEscalar, 0.4);
        var actEsfumar = cc.FadeOut.create(1.5);
        var actAparecer = cc.FadeIn.create(1.5);
		var actMoverArriba = cc.MoveTo.create(1,cc.p(LA.cw, LA.size.height*0.8));
		var actAchicar = cc.ScaleTo.create(1, 0.5, 0.5);//TODO: mejorar nomenclatura?

		//ejecutamos la animación que muestra el logo primero y luego rota el título y muestra los gráficos
        sprLogo.runAction(
            cc.Sequence.create(
				actAparecer,
                cc.CallFunc.create(function(){
					eso.addChild(mMenuPrincipal,1);
                })
            )
        );

		
        this.setTouchEnabled(true);
        
        return true;
    }
});

//Escena Inicial
LA.Escenas.SceInicial = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        var eso = this;
        
        //TODO: mover estas declaraciones a main?
        LA.size = cc.Director.getInstance().getWinSize();//TODO: verificar si no debería estar usando Design Resolution Size en realidad..
        LA.cw = LA.size.width/2;
        LA.ch = LA.size.height/2;
        
        var layCreadores = new LA.Capas.LayCreadores();
        layCreadores.init();
        this.addChild(layCreadores, 0);
        
        var layAgradecimientos = new LA.Capas.LayAgradecimientos();
        
        var layMenu = new LA.Capas.LayMenuPrincipal(cc.c4b(0,0,0,0), LA.size.width, LA.size.height);
        
        layCreadores.runAction(
			cc.Sequence.create(
				cc.DelayTime.create(3),
				
				cc.CallFunc.create(function(){
					layCreadores.setVisible(false);
					
					layAgradecimientos.init();
					eso.addChild(layAgradecimientos, 1);
				}),
				
				cc.DelayTime.create(3),
				
                cc.CallFunc.create(function(){					
					layMenu.init();
			        eso.addChild(layMenu, 2);
				})
			)
        );
    }
});