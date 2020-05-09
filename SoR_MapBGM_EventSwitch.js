//=============================================================================
// SoR_MapBGM_EventSwitch.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// 2020/05/09
//=============================================================================


/*:ja
 * @plugindesc ＜条件付きマップBGM変更＞ 特定のスイッチがONになっている間、指定したマップのBGMを任意のものへ強制的に変更します。
 * @author 蒼竜　@soryu_rpmaker
 *
 * 
 *
 * @help
 * BGMが変更される際は、エディタ上で設定されているBGMは読み込まれないため、
 * 「ストーリー中のある一定場面のみ、そのマップのBGMを変える」というゲーム上の
 * 演出が自然になります。
 *
 * 例えば、 「普段は穏やかな街が襲撃に遭い戦闘状態になっている」といった
 * 場面でBGMを専用のものへ変更したいという場合に有効です。
 *　連続（ゲーム演出上、隣接）する複数マップのBGMを同じものに指定してあれば
 * 変更後のBGMがマップ移動後もシームレスに再生されることになります。
 *
 * ※エディタの機能のみでこれを行おうとすると、マップ切り替わりの時点で設定した
 * BGMを一旦止めた上で新しいBGMを再生するという処理になるため、一瞬
 * 変な間ができたり、最悪デフォルトのBGMが一瞬再生されるという間抜けな現象が
 * 起こる可能性があります。
 * 
 *
 * -----------------------------------------------------------
 * 用法
 * -----------------------------------------------------------
 * エディタ上で「マップの設定」画面にあるメモに
 * <mapswitch: スイッチ番号, BGMファイル(拡張子不要), ボリューム, ピッチ,　パン, 位置>
 * を記述する。
 * （BGMを変えたいマップの設定画面に記述してください）
 *
 * 例1) 10番のスイッチがONのとき、Battle1 をそのマップのBGMとする。(ボリューム等はデフォルト設定のまま)
 * <mapswitch: 10, Battle1, 90, 100, 0, 0>
 *
 * 例2) 33番のスイッチがONのとき、Theme3 をそのマップのBGMとする。(ピッチが150%になっている)
 * <mapswitch:33,Theme3,100,150,0,0>
 *
 *
 * なお、１つのマップに複数のタグを列挙することができます。
 * （例：ゲーム内時間等に応じて、朝・昼・夜と別々のBGMを再生する）
 * 複数のBGM変更タグが条件を満たしている場合は、
 * メモのより上の方に書かれているタグが優先されます。（優先度の高い条件のものを
 * より上部へ記述するようにしてください。）
 *
 * 詳細な用例は
 * https://github.com/soryu-rmv
 * に記載しています。
 *
 * -----------------------------------------------------------
 * バージョン情報
 * -----------------------------------------------------------
 * v1.00 (2020/05/09)       公開  
 */
 /*:
 * @plugindesc ＜Conditional BGM switch on Map＞ While a specified switch is ON, BGM in a specified map is force changed.
 * @author Soryu @soryu_rpmaker
 *
 *
 * @help 
 * ------------------------------------------------------------
 * How to use
 * ------------------------------------------------------------
 * - Write note tag in your map which you want to change BGM
 *   with a condition as following format
 * <mapswitch: switchID, BGMname, volume, pitch,　pan, pos>
 *
 * Ex) In case of switch 10 is ON, Change BGM to Battle1 (volume and etc is as the default).
 * <mapswitch: 10, Battle1, 90, 100, 0, 0>
 *
 * Ex) In case of switch 33 is ON, Change BGM to Theme3 (pitch is 150%).
 * <mapswitch:33,Theme3,100,150,0,0>
 *
 * 
 * You can enumerate several "mapswitch" tags in a map.
 * If multiple conditions are hold, tags written earlier on 
 * the note has higher priority to apply. It is expected to express time flow
 * such as morning, noon, and night with different BGMs.
 *
 * To get more instructions, see https://github.com/soryu-rmv .
 *
 *
 * ------------------------------------------------------------
 * Version info
 * ------------------------------------------------------------
 * v1.00 (May 9, 2020)       Released!
 */


    var So_Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        So_Game_Map_setup.call(this, mapId);
	    $dataMap.switchbgm_flagID = [];
		$dataMap.switched_bgm = []; // switch bgm candidate array
        this.setMapBGMtags();
    };
		
	
    Game_Map.prototype.setMapBGMtags = function() {
	//mapswitch tag	
 	var tag = /<(?:mapswitch):[ ]*(.*),[ ]*(.*),[ ]*(.*),[ ]*(.*),[ ]*(.*),[ ]*(.*)>/i;

	 var notes = $dataMap.note.split(/[\r\n]+/);
		for (var n = 0; n < notes.length; n++) {
			  var line = notes[n];
			  console.log(line);
			  if (line.match(tag)) {
				 var ID = parseInt(RegExp.$1);
			     var switchbgm =  {
					name: String(RegExp.$2),
					volume: parseInt(RegExp.$3),
					pitch: parseInt(RegExp.$4),
					pan: parseInt(RegExp.$5),
					pos: parseInt(RegExp.$6)
				};
				
				$dataMap.switchbgm_flagID.push(ID);
				$dataMap.switched_bgm.push(switchbgm);
	  	     }
		}
    };
	
	//overwrite 
	Game_Map.prototype.autoplay = function() {
		if ($dataMap.autoplayBgm) {
			if ($gamePlayer.isInVehicle()) {
				$gameSystem.saveWalkingBgm2();
			} else {
				/////// conditional bgm play
				if($dataMap.switched_bgm.length>0 ){
					for(var i=0; i<$dataMap.switched_bgm.length;i++){
						if($gameSwitches.value($dataMap.switchbgm_flagID[i])){
						    AudioManager.playBgm($dataMap.switched_bgm[i]);
							break;
						}
					}
				}
				else AudioManager.playBgm($dataMap.bgm); //regular bgm on database
			}
		}
		if ($dataMap.autoplayBgs) {
			AudioManager.playBgs($dataMap.bgs);
		}
	};
