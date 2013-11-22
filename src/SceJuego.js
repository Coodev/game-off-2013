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
	_controles:{w:null, a:null, s:null, d:null},

    init:function () {
        var eso = this;
        this._super();      
		
		this.initTiledMap(s_res.arrNiveles[LA.nivelActual]);
		
		this.initControles();
		
        this.setTouchEnabled(true);
        
        this.setKeyboardEnabled(true);//TODO: ver si da problemas el no verificar que el dispositivo soporte teclado antes de activar
        
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
			        cc.log("X:"+posicion.x+"; Y:"+posicion.y);

					this.moverPersonaje(posicion);
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
					switch(LA.nivelActual){						
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
							optimo= 9;
							break;
							
						case 5:
							optimo= 15;
							break;
							
						case 6:
							optimo= 19;
							break;
							
						case 7:
							optimo= 43;
							break;
							
						case 8:
							optimo= 29;
							break;
							
						case 9:
							optimo= 75;
							break;
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
						this.resetearControles();
						LA.nivelActual++;
						this.initTiledMap(s_res.arrNiveles[LA.nivelActual]);						
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
		if(this._ultimo===null){
			this._ultimo=boton;
		}else{
			//swappeamos las teclas asignadas a los botones
			var temp = boton.slot;
			boton.slot= this._ultimo.slot;
			this._ultimo.slot = temp;
			
			//swappeamos de lugar este botón y el anterior presionado
			temp = boton.getPosition();
			boton.runAction(cc.MoveTo.create(0.2, this._ultimo.getPosition()));//TODO: solucionar caso en que si se presiona una dirección mientras su botón se está moviendo se toma esa posición en lugar de la final T_T
			this._ultimo.runAction(cc.MoveTo.create(0.2, temp));
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
        
        LA.size = cc.Director.getInstance().getWinSize();//TODO: verificar si no debería estar usando Design Resolution Size en realidad..
        LA.cw = LA.size.width/2;
        LA.ch = LA.size.height/2;
        
        var layJuego = new LA.Capas.LayJuego();
        layJuego.init();
        this.addChild(layJuego);
    }
});