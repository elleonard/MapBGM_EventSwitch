# MapBGM_EventSwitch
Conditional BGM switch on Map

by @soryu_rpmakermv

-------------------------------------------------

<br>

## 1. Introduction

When I play console RPG games, I notice that BGM playing in a city map sometimes changes to others    
under a dramatic scene that a tranquil city is raided by enemies and battles begins.     
In such a situation, the effect of BGM changes spreads not only one map but also involving several adjacent maps. 


How can we inplement in RPGMaker series without using plugins?    
It is regularly implementend as follows. 

![bgmcha](https://user-images.githubusercontent.com/64351233/81460279-446dc300-91df-11ea-90aa-b40e5d190751.png)

This event is triggered by parallel, and just processes playing bgm and erase itself (event).    
We put the event on a map which we want to change its BGM.    
However, this implementation is processed by RPGMV as follows

- Play a default map BGM set by RPGMV editor
- Stop the BGM
- Play a BGM induced by a event

This means prossibility to cause some weird performance before playing a specified BGM.

- Occur an small interval
- Play a default BGM for a moment

This plugin eliminates such weird performance, and provide natural direction like console RPGs.
In the implementation of this plugin does not play a default bgm when an alternative bgm plays.
The below figure describes the difference of behavior between the implementation with this plugin and event commands in RPGMV.

![bgmflow2](https://user-images.githubusercontent.com/64351233/81463464-d03e1a00-91f4-11ea-9ffb-425fcc88df49.png)

Especially, several sequential (geographically in the game) maps has set to play the same BGM,  
the BGM still plays with neither pause nor rewind.
When we do that with event commands in RPGMV, it is inevitable to rewind BGM    
even if they are changed to play the same BGM.

In terms of a direction to imitate a dramatic scene like console RPG games by RPGMakers,   
this plugin proposes you an effective design.



## 2. Usage

In RPGMV editor, open a Map Properties which you want to switch BGM,   
and write following format tag in a Note.

**<mapswitch: switchID, BGMname, volume, pitch,　pan, pos>**   

, as a below figure.

![mapmemo](https://user-images.githubusercontent.com/64351233/81460548-0ffb0680-91e1-11ea-93fb-1ec1d4df2087.png)



-Ex) In case of switch 10 is ON, Change BGM to Battle1 (volume and etc is as the default)    
**<mapswitch: 10, Battle1, 90, 100, 0, 0>**    

-Ex) In case of switch 33 is ON, Change BGM to Theme3 (pitch is 150%).     
**<mapswitch: 33,Theme3,100,150,0,0>**   



You can also enumerate several "mapswitch" tags in a map.    
If multiple conditions are hold, tags written earlier on the note has higher priority to apply.     
It is expected to express time flow such as morning, noon, and night with different BGMs.     


 ## 3. Implementation (Information for Possible Conflict to other plugins)
 
- Game_Map.prototype.setup    
 --Add a method call to read and process mapswitch tags.  
 --Array to manage BGMs by mapswitch tags are initialized.   
- Game_Map.prototype.autoplay **is overwritten**.
  Add a process to switch BGM according to mapswitch arrays.
  
  
 ### Version info.
 - ver 1.00  (May 5, 2020)  Released
