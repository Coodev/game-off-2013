/*jshint globalstrict: true*/
"use strict";

//Engine:
/*global cc*/
//Rescursos:
/*global s_res*/
/* ^Declaraciones para JSHint--------------------------------------------- */

/** Programado por Sebastián R. Vansteenkiste. Otros autores y derechos serán cargados luego. **/
var LA = LA || {};
LA.Escenas = LA.Escenas || {};
LA.Capas = LA.Capas || {};

LA.nivelActual = 1;

var delay = 0.01;

LA.Capas.LayJuego = cc.Layer.extend({
	_mapa:null,
	_escalaMapa:null,
	_anchoEscalado:null,
	_altoEscalado:null,
	_paredes:null,
	_portal:null,
	_personaje:null,
	_ultimo:null,
	_movidas:null,
	_inicio:null,

    init:function () {
        var eso = this;
        this._super();      
		
		this.initTiledMap(s_res.arrNiveles[LA.nivelActual]);
		
		this.initControles();
		
        this.setTouchEnabled(true);
        
        return true;
    },
    
    initTiledMap:function(rutaMapa){
		this._movidas=0;

		this._mapa= cc.TMXTiledMap.create(rutaMapa);
		this.addChild(this._mapa, 0);
		this._mapa.setAnchorPoint(cc.p(0,0));
		//this._mapa.setAnchorPoint(cc.p(0.5,0.5));
		//this._mapa.setPosition(cc.p(0,0));
		this._inicio=cc.p(
			(LA.size.width - (this._mapa.getMapSize().width)*this._mapa.getTileSize().width) /2,
			0
		);
		this._mapa.setPosition(this._inicio);


		this._paredes = this._mapa.getLayer("paredes");
		this._portal = this._mapa.getLayer("portal");

		var ogPersonaje = this._mapa.getObjectGroup("personaje");
		var spawn = ogPersonaje.objectNamed("spawn");
		//var x= this._inicio.x + spawn.x;
		//var y= this._inicio.y + spawn.y;
		var x= spawn.x;
		var y= spawn.y;

		this._personaje = cc.Sprite.create(s_res.imgPersonaje);		 
		this._personaje.setPosition(cc.p(x,y));
		this._personaje.setAnchorPoint(cc.p(0.5,0.5));
		//this.addChild(this._personaje, 1);
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
			        cc.log("X:"+posicion.x+"; Y:"+posicion.y);

					this.moverPersonaje(posicion);
			    }

				if(eso._ultimo===null){
					eso._ultimo=this.btnArriba; //este botón
				}else{
					//swappeamos de lugar este botón y el anterior presionado
					this.swappear(this.btnArriba);
				}
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
			    }
				
				if(eso._ultimo===null){
					eso._ultimo=this.btnAbajo; //este botón
				}else{
					//swappeamos de lugar este botón y el anterior presionado
					this.swappear(this.btnAbajo);
				}
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
			    }
				
				if(eso._ultimo===null){
					eso._ultimo=this.btnDerecha; //este botón
				}else{
					//swappeamos de lugar este botón y el anterior presionado
					this.swappear(this.btnDerecha);
				}
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
			    }

				
				if(eso._ultimo===null){
					eso._ultimo=this.btnIzquierda; //este botón
				}else{
					//swappeamos de lugar este botón y el anterior presionado
					this.swappear(this.btnIzquierda);
				}
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
    },
    
    getCoord:function(posicion){
		var x = Math.floor((posicion.x)/this._mapa.getTileSize().width);
		var y = Math.floor((this._mapa.getMapSize().height * this._mapa.getTileSize().height - posicion.y-1)/this._mapa.getTileSize().height);//Hace falta "darlo vuelta" porque el (0,0) del tiled está arriba
		cc.log("MapaX:"+x+"; MapaY:"+y);
	    return cc.p(x, y);
    },
    
    moverPersonaje:function(posicion){
	    if(!this._paredes.getTileGIDAt(this.getCoord(posicion))){//si no hay nada en la capa paredes en es posición:1
				this._personaje.setPosition(posicion);
				
				if(this._portal.getTileGIDAt(this.getCoord(posicion))){
					//var optimo = this._mapa.getProperty("optimo");
					var optimo;
					switch(LA.nivelActual){
						case 0:
							optimo= 9;
							break;
						
						case 1:
							optimo= 5;
							break;
						
						case 2:
							optimo= 7;
							break;
						
						case 3:
							optimo= 9;
							break;
						
						case 4:
							optimo= 12;
							break;
							
						default:
							optimo= 1;
					}
					var iEstrellas = Math.floor((optimo/this._movidas)*5);
					var estrellas = "";
					var i;
					for(i=0; i<iEstrellas; i++){
						estrellas+="*";
					}
					if(estrellas===""){
						estrellas="*";
					}
					var mensaje = "¡Ganaste en " +this._movidas+" movidas!\n";
					if(optimo<this._movidas){
						mensaje+="¡Lo óptimo hubieran sido "+optimo+" movimientos!\n";
					}
					mensaje+=estrellas;
					alert(mensaje);
					
					this._mapa.removeAllChildren(true);
					this._mapa.removeFromParent(true);
					this._personaje.removeFromParent(true);
					if(LA.nivelActual<s_res.arrNiveles.length-1){
						LA.nivelActual++;
						this.initTiledMap(s_res.arrNiveles[LA.nivelActual]);
						this.resetearControles();
						//TODO: aplicar alguna transición?
					}else{
						//TODO: mostrar escena final
						alert("fin! gracias por jugar!");
						this.removeAllChildren(true);
					}
				}
	        }
    },
    
    swappear:function(boton){
		var temp = boton.getPosition();
		boton.runAction(cc.MoveTo.create(0.2, this._ultimo.getPosition()));
		this._ultimo.runAction(cc.MoveTo.create(0.2, temp));
		this._ultimo=boton; //este botón
    }
});

LA.Escenas.SceJuego = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        LA.size = cc.Director.getInstance().getWinSize();
        LA.cw = LA.size.width/2;
        LA.ch = LA.size.height/2;
        
        var layJuego = new LA.Capas.LayJuego();
        layJuego.init();
        this.addChild(layJuego);
    }
});