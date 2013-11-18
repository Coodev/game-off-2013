/*jshint globalstrict: true*/
"use strict";

//Engine:
/*global cc*/
//Rescursos:
/*global s_res*/
//Definiciones en main.js:
/* ^Declaraciones para JSHint--------------------------------------------- */

/** Programado por Sebastián R. Vansteenkiste. Otros autores y derechos serán cargados luego. **/
var LA = LA || {};
LA.Mapas = LA.Mapas || {};

LA.Mapas.TmxNivel0 = cc.TMXTiledMap.extend({
            ctor : function() {
                this._super();
                this.initWithTMXFile(s_res.tmxNivel0);
                //this.iniciarParedes();
            },

            getTileCoordForPosition : function(position) {
                var x = Math.floor(position.x / this.getTileSize().width);
                var y = Math.floor((
						(this.getTileSize().height * this.getMapSize().height) - position.y)/this.getTileSize().height
					);
                return new cc.Point(x, y);
            },

            esPared : function(tileCoord) {
                var collidableLayer = this.getLayer("paredes");
                var gid = collidableLayer.getTileGIDAt(tileCoord);
                if (gid) {
                    var tileProperties = this.propertiesForGID(gid);
                    return true;
                }
                return false;
            },

            iniciarParedes : function() {
                this.obstacles = [];
                var mapWidth = this.getMapSize().width;
                var mapHeight = this.getMapSize().height;
                var tileWidth = this.getTileSize().width;
                var tileHeight = this.getTileSize().height;
                var collidableLayer = this.getLayer("paredes");
                var i, j;
                for (i = 0; i < mapWidth; i++) {
                    for (j = 0; j < mapHeight; j++) {
                        var tileCoord = new cc.Point(i, j);
                        var gid = collidableLayer.getTileGIDAt(tileCoord);
                        if (gid) {
                            var tileXPositon = i * tileWidth;
                            var tileYPosition = (mapHeight * tileHeight) - ((j + 1) * tileHeight);
                            var rect = cc.Rect(tileXPositon, tileYPosition, tileWidth, tileHeight);
                            this.obstacles.push(rect);
                        }
                    }
                }
            }
        });