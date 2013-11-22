/*jshint globalstrict: true*/
"use strict";

//Objetos para contener las rutas y luego realizar la carga de recursos
var s_res = {};
var g_res= [];

//logo de la animacion inicial
//s_res.logo = "logo.png";
//g_res.push({src:s_res.logo});

//TMX:
s_res.arrNiveles=[];

s_res.arrNiveles.push("nivel0.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[0]});

s_res.arrNiveles.push("nivel01.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[1]});

s_res.arrNiveles.push("nivel02.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[2]});

s_res.arrNiveles.push("nivel03.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[3]});

s_res.arrNiveles.push("nivel04.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[4]});

s_res.arrNiveles.push("nivel05.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[5]});

s_res.arrNiveles.push("nivel06.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[6]});

s_res.arrNiveles.push("nivel07.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[7]});

s_res.arrNiveles.push("nivel08.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[8]});

s_res.arrNiveles.push("nivel09.tmx");
g_res.push({type:"tmx", src:s_res.arrNiveles[9]});

//Elementos del Mapa:
s_res.imgPiso = "piso.png";
g_res.push({type:"image", src:s_res.imgPiso});

s_res.imgPared = "pared.png";
g_res.push({type:"image", src:s_res.imgPared});

s_res.imgPortal = "portal.png";
g_res.push({type:"image", src:s_res.imgPortal});

//Personaje:
s_res.imgPersonaje = "personaje.png";
g_res.push({type:"image", src:s_res.imgPersonaje});

//fondos


//botones
s_res.btnArribaNormal = "btnArribaNormal.png";
g_res.push({type:"image", src:s_res.btnArribaNormal});

s_res.btnArribaActivo = "btnArribaActivo.png";
g_res.push({type:"image", src:s_res.btnArribaActivo});

s_res.btnAbajoNormal = "btnAbajoNormal.png";
g_res.push({type:"image", src:s_res.btnAbajoNormal});

s_res.btnAbajoActivo = "btnAbajoActivo.png";
g_res.push({type:"image", src:s_res.btnAbajoActivo});

s_res.btnDerechaNormal = "btnDerechaNormal.png";
g_res.push({type:"image", src:s_res.btnDerechaNormal});

s_res.btnDerechaActivo = "btnDerechaActivo.png";
g_res.push({type:"image", src:s_res.btnDerechaActivo});

s_res.btnIzquierdaNormal = "btnIzquierdaNormal.png";
g_res.push({type:"image", src:s_res.btnDerechaNormal});

s_res.btnIzquierdaActivo = "btnIzquierdaActivo.png";
g_res.push({type:"image", src:s_res.btnIzquierdaActivo});

//misceláneos
/*s_res.mscAgradecimientos = "mscAgradecimientos.png";
g_res.push({src:s_res.mscAgradecimientos});
s_res.mscLapiz = "mscLapiz.png";
g_res.push({src:s_res.mscLapiz});
s_res.mscLogo = "mscLogo.png";
g_res.push({src:s_res.mscLogo});
s_res.mscTipito = "mscTipito.png";
g_res.push({src:s_res.mscTipito});*/

//fuentes
//s_res.fntFedra = "FedraSansStd Normal.ttf";
//g_res.push({fontName:"FedraSansStd Normal", src:s_res.fntFedra, type:"truetype"});
//s_res.fntFedraBold = "FedraSansStd Bold.ttf";
//g_res.push({fontName:"FedraSansStd Bold", src:s_res.fntFedraBold, type:"truetype"});