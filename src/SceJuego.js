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
LA.Sesion = {};

//Animación de sacudida para cuando se intenta mover en una dirección inválida:
LA.Animaciones = {};
LA.Animaciones.actSacudir = cc.Sequence.create(
	cc.MoveBy.create(0.1, cc.p(10, 0)),
	cc.MoveBy.create(0.1, cc.p(0, -10)),
	cc.MoveBy.create(0.1, cc.p(-10, 0)),
	cc.MoveBy.create(0.1, cc.p(0, 10))
);//TODO: mover esto a donde tenga más sentido
LA.Animaciones.actSacudir = cc.EaseElasticOut.create(LA.Animaciones.actSacudir, 0.4);

var delay = 0.01;

LA.Capas.LayJuego = cc.Layer.extend({
	_mapa:null,
	_paredes:null,
	_portal:null,
	_personaje:null,
	_ultimo:null,
	_movidas:null,
	_controles:{w:null, a:null, s:null, d:null},

    init:function () {
        var eso = this;
        this._super();      
		
		LA.Sesion.nivelActual = 0;
		LA.Sesion.arrPuntajes = [];
		
		this.initTiledMap(s_res.arrNiveles[LA.Sesion.nivelActual]);
		
		this.initControles();		
		
        this.setTouchEnabled(true);
        
        this.setKeyboardEnabled(true);//TODO: ver si da problemas el no verificar que el dispositivo soporte teclado antes de activar
        
        return true;
    },
    
    initTiledMap:function(rutaMapa, rectanguloVisor){
		this._movidas=0; //importante..
		
		//creamos el mapa
		this._mapa= cc.TMXTiledMap.create(rutaMapa);
		//this.addChild(this._mapa, 0);
		this._mapa.setAnchorPoint(cc.p(0,0));
		//this._mapa.setAnchorPoint(cc.p(0.5,0.5));
		//this._mapa.setPosition(cc.p(0,0));
		/*var inicio=cc.p(
			(LA.size.width - (this._mapa.getMapSize().width)*this._mapa.getTileSize().width) /2,
			0
		);
		this._mapa.setPosition(inicio);*/
		
		//Algoritmo mágico para escalar el mapa al tamaño correcto para mostrarlo a donde lo querramos mostrar
		rectanguloVisor= (typeof rectanguloVisor !== "undefined" && rectanguloVisor !== null) ? rectanguloVisor : cc.rect(0, 0, LA.size.width, LA.size.height);//Si no nos dicen donde, usamos toda la pantalla

		var mapSize= this._mapa.getMapSize();

		//mapSize.width++;
		//mapSize.height++;
		
		mapSize.width*=this._mapa.getTileSize().width;
		mapSize.height*=this._mapa.getTileSize().height;
		
		var ratioM = mapSize.width/mapSize.height;
		var ratioR = rectanguloVisor.width/rectanguloVisor.height;
		
		var escalaW = 1;
		var escalaH = 1;
		
		if(ratioM===ratioR){//Si el mapa y el área donde queremos mostrarlo tienen la misma relación de aspecto
			escalaW = (mapSize.width<rectanguloVisor.width) ? mapSize.width/rectanguloVisor.width : rectanguloVisor.width/mapSize.width;//Encontramos el coeficiente para igualar el ancho del mapa al ancho del visor (siendo que tienen la misma relación de aspecto, podríamos haber usado la altura y daría lo mismo)
			escalaH = escalaW;
		}else if(ratioM>ratioR){//Sino, si el mapa es mas achatado horizontalmente que el visor
			escalaW = (mapSize.width<rectanguloVisor.width) ? mapSize.width/rectanguloVisor.width : rectanguloVisor.width/mapSize.width;
			escalaH = escalaW;
		}else{//Sino, si el mapa es más estirado verticalmente que el visor
			escalaH = (mapSize.height<rectanguloVisor.height) ? mapSize.height/rectanguloVisor.height : rectanguloVisor.height/mapSize.height;
			escalaW = escalaH;
		}//TODO: ver por qué carajo se ve como se ve el mapa 2.. (es un bug, pero está copado)
		
		this._mapa.setScale(escalaW, escalaH);
		
		var inicio = cc.p(
			Math.floor(rectanguloVisor.x + (rectanguloVisor.width - mapSize.width*escalaW)/2),
			Math.floor(rectanguloVisor.y + (rectanguloVisor.height - mapSize.height*escalaH)/2)
		);		
		this._mapa.setPosition(inicio);		
		
		this.addChild(this._mapa, 0);

		//creamos y posicionamos el personaje y el "portal":
		this._paredes = this._mapa.getLayer("paredes");
		this._portal = this._mapa.getLayer("portal");

		var ogPersonaje = this._mapa.getObjectGroup("personaje");
		var spawn = ogPersonaje.objectNamed("spawn");
		var x= spawn.x;
		var y= spawn.y;

		this._personaje = cc.Sprite.create(s_res.imgPersonaje);		 
		this._personaje.setPosition(cc.p(x,y));
		this._personaje.setAnchorPoint(cc.p(0.5,0.5));
		this._mapa.addChild(this._personaje, 1);
    },
    
    initControles: function(){
		var eso = this;		        
        
		//menú al cual se deben agregar los menu items
		var mControles = cc.Menu.create();
		mControles.setPosition(cc.p(0,0));
		this.addChild(mControles, 3);
		
		this.btnArriba = cc.MenuItemImage.create(
			s_res.btnArribaNormal,
			s_res.btnArribaActivo,
			
			function(){
				var posicion = eso._personaje.getPosition();
				//this._personaje.runAction(cc.RotateTo.create(delay, 0));
				this._personaje.setRotation(0);
				this._movidas++;

				if (posicion.y < ((eso._mapa.getMapSize().height-1) * eso._mapa.getTileSize().height)){
			        posicion.y+= eso._mapa.getTileSize().height;
			        //cc.log("X:"+posicion.x+"; Y:"+posicion.y);

					this.moverPersonaje(posicion);
			    }else{
					this._personaje.runAction(LA.Animaciones.actSacudir.clone());
			    }

				this.swappear(this.btnArriba);	
			},
			
			this
		);
		this.btnArriba.setAnchorPoint(cc.p(0, 0));
		//btnArriba.setPosition(cc.p(66, 66));
		mControles.addChild(this.btnArriba);
		
		this.btnAbajo = cc.MenuItemImage.create(
			s_res.btnAbajoNormal,
			s_res.btnAbajoActivo,
			
			function(){
				var posicion = eso._personaje.getPosition();
				//this._personaje.runAction(cc.RotateTo.create(delay, 180));
				this._personaje.setRotation(180);
				this._movidas++;

				if (posicion.y > eso._mapa.getTileSize().height){
			        posicion.y-= eso._mapa.getTileSize().height;

					this.moverPersonaje(posicion);					
			    }else{
					this._personaje.runAction(LA.Animaciones.actSacudir.clone());
			    }

				this.swappear(this.btnAbajo);
			},
			
			this
		);
		this.btnAbajo.setAnchorPoint(cc.p(0, 0));
		//btnAbajo.setPosition(cc.p(66, 1));
		mControles.addChild(this.btnAbajo);
		
		this.btnDerecha = cc.MenuItemImage.create(
			s_res.btnDerechaNormal,
			s_res.btnDerechaActivo,
			
			function(){
				var posicion = eso._personaje.getPosition();
				//this._personaje.runAction(cc.RotateTo.create(delay, 90));
				this._personaje.setRotation(90);
				this._movidas++;

				if (posicion.y < ((eso._mapa.getMapSize().width-1)*eso._mapa.getTileSize().width)){
			        posicion.x+= eso._mapa.getTileSize().width;
			        
					this.moverPersonaje(posicion);
			    }else{
					this._personaje.runAction(LA.Animaciones.actSacudir.clone());
			    }
				
				this.swappear(this.btnDerecha);
			},
			
			this
		);
		this.btnDerecha.setAnchorPoint(cc.p(0, 0));
		//btnDerecha.setPosition(cc.p(131, 1));
		mControles.addChild(this.btnDerecha);
		
		this.btnIzquierda = cc.MenuItemImage.create(
			s_res.btnIzquierdaNormal,
			s_res.btnIzquierdaActivo,
			
			function(){
				var posicion = eso._personaje.getPosition();
				//this._personaje.runAction(cc.RotateTo.create(delay, 270));
				this._personaje.setRotation(270);
				this._movidas++;

				if (posicion.x > eso._mapa.getTileSize().width){
			        posicion.x-= eso._mapa.getTileSize().width;	        
					
					this.moverPersonaje(posicion);	        
			    }else{
					this._personaje.runAction(LA.Animaciones.actSacudir.clone());
			    }

				this.swappear(this.btnIzquierda);
			},
			
			this
		);
		this.btnIzquierda.setAnchorPoint(cc.p(0, 0));
		//btnIzquierda.setPosition(cc.p(1, 1));
		mControles.addChild(this.btnIzquierda);
		
		this.resetearControles();
    },
    
    resetearControles:function(){

		this.btnArriba.setPosition(cc.p(66, 66));
		this.btnAbajo.setPosition(cc.p(66, 1));
		this.btnDerecha.setPosition(cc.p(131, 1));
		this.btnIzquierda.setPosition(cc.p(1, 1));
		
		this._ultimo = null;
		
		this.btnArriba.slot=cc.KEY.w;
		this.btnAbajo.slot=cc.KEY.s;
		this.btnDerecha.slot=cc.KEY.d;
		this.btnIzquierda.slot=cc.KEY.a;
		
		this.btnArriba.pFinal=cc.p(66, 66);
		this.btnAbajo.pFinal=cc.p(66, 1);
		this.btnDerecha.pFinal=cc.p(131, 1);
		this.btnIzquierda.pFinal=cc.p(1, 1);
		
    },
    
    getCoord:function(posicion){
		var x = Math.floor((posicion.x)/this._mapa.getTileSize().width);
		var y = Math.floor((this._mapa.getMapSize().height * this._mapa.getTileSize().height - posicion.y-1)/this._mapa.getTileSize().height);//Hace falta "darlo vuelta" porque el (0,0) del tiled está arriba
	    return cc.p(x, y);
    },
    
    moverPersonaje:function(posicion){
	    if(!this._paredes.getTileGIDAt(this.getCoord(posicion))){//si no hay nada en la capa paredes en esa posición, podemos movernos allí
				this._personaje.setPosition(posicion);
				
				if(this._portal.getTileGIDAt(this.getCoord(posicion))){
					//var optimo = this._mapa.getProperty("optimo");
					var optimo; //TODO: estar atento a cuando arreglen esto
					switch(LA.Sesion.nivelActual){						
						case 0:
							optimo= 5;
							break;
						
						case 1:
							optimo= 7;
							break;
						
						case 2:
							optimo= 9;
							break;
						
						case 3:
							optimo= 9;
							break;
							
						case 4:
							optimo= 15;
							break;
							
						case 5:
							optimo= 19;
							break;
							
						case 6:
							optimo= 43;
							break;
							
						case 7:
							optimo= 29;
							break;
							
						case 8:
							optimo= 75;
							break;
					}
					var iEstrellas = Math.floor((optimo/this._movidas)*(5 /*+ LA.Sesion.nivelActual*/));
					LA.Sesion.arrPuntajes.push(iEstrellas);
					var estrellas = "";
					var i;
					for(i=0; i<iEstrellas; i++){
						estrellas+="*";
					}
					if(estrellas===""){
						estrellas="*";
					}
					var mensaje = LA.Textos.ganaste +this._movidas+LA.Textos.movidas;
					if(optimo<this._movidas){
						mensaje+=LA.Textos.optimo+optimo+LA.Textos.movidas;
					}
					mensaje+=estrellas;
					alert(mensaje);
					
					this._mapa.removeAllChildren(true);
					this._mapa.removeFromParent(true);
					this._personaje.removeFromParent(true);
					
					if(LA.Sesion.nivelActual<s_res.arrNiveles.length-1){
						this.resetearControles();
						LA.Sesion.nivelActual++;
						this.initTiledMap(s_res.arrNiveles[LA.Sesion.nivelActual]);						
						//TODO: aplicar alguna transición?
					}else{
						//TODO: mostrar escena final?
						iEstrellas=0;
						estrellas="";
						for(i=0; i<LA.Sesion.arrPuntajes.length; i++){
							iEstrellas+=LA.Sesion.arrPuntajes[i];
						}
						for(i=0; i<iEstrellas; i++){
							estrellas+="*";
						}
						if(estrellas===""){
							estrellas="*";
						}
						alert(LA.Textos.graciasPorJugar+estrellas+LA.Textos.excusas);
						this.removeAllChildren(true);
						if(confirm(LA.Textos.deNuevo)){
							this.init();
						}
					}
				}
	        }else{//Sino, es que hay una pared y no podemos movernos, así que damos feedback visual sacudiendo el personaje
				this._personaje.runAction(LA.Animaciones.actSacudir.clone());
	        }
    },
    
    swappear:function(boton){
		if(this._ultimo===null){
			this._ultimo=boton;
		}else{
			//swappeamos las teclas asignadas a los botones
			var temp = boton.slot;
			boton.slot= this._ultimo.slot;
			this._ultimo.slot = temp;
			
			//primero detenemos las animaciones que puedan estar sucediendo (pasan cosas feas si le decís a algo que se mueva cuando ya se está moviendo por alguna razón) //TODO: probar si lo mismo pasa al usar MoveBy
			boton.stopAllActions();
			this._ultimo.stopAllActions();
			
			//swappeamos de lugar este botón y el anterior presionado
			temp = boton.pFinal;
			boton.runAction(cc.MoveTo.create(0.2, this._ultimo.pFinal));//TODO: solucionar caso en que si se presiona una dirección mientras su botón se está moviendo se toma esa posición en lugar de la final T_T
			this._ultimo.runAction(cc.MoveTo.create(0.2, temp));
			
			boton.pFinal= this._ultimo.pFinal;
			this._ultimo.pFinal=temp;
			
			this._ultimo=boton;
		}
    },
    
    onKeyUp:function (tecla) {
        switch(tecla){
			case cc.KEY.up:
				tecla = cc.KEY.w;					
				break;
				
			case cc.KEY.down:
				tecla = cc.KEY.s;					
				break;
				
			case cc.KEY.right:
				tecla = cc.KEY.d;					
				break;
				
			case cc.KEY.left:
				tecla = cc.KEY.a;					
				break;
		}
		
		switch(tecla){
			case this.btnArriba.slot:
					this.btnArriba.activate();
				break;
				
			case this.btnAbajo.slot:
					this.btnAbajo.activate();
				break;
				
			case this.btnDerecha.slot:
					this.btnDerecha.activate();
				break;
				
			case this.btnIzquierda.slot:
					this.btnIzquierda.activate();
				break;
		}
	}
});

LA.Escenas.SceJuego = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        //TODO: mover estas declaraciones a main?
        //LA.size = cc.Director.getInstance().getWinSize();//TODO: verificar si no debería estar usando Design Resolution Size en realidad..
        //LA.cw = LA.size.width/2;
        //LA.ch = LA.size.height/2;        
        
        this.addChild(cc.LayerColor.create(cc.c4b(180,180,180,255), LA.size.width, LA.size.height));
        
        var layJuego = new LA.Capas.LayJuego();
        layJuego.init();
        this.addChild(layJuego);
        
        alert(LA.Textos.bienvenido);
    }
});