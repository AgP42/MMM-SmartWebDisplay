# MMM-SmartWebDisplay

`MMM-SmartWebDisplay` is a module for MagicMirror². It allow to display any web content to your [MagicMirror](https://github.com/MichMich/MagicMirror) and interact with it through notifications or with [MMM-TelegramBot](https://github.com/eouia/MMM-TelegramBot).

This module is a major evolution of [MMM-iFrame-Ping](https://github.com/AgP42/MMM-iFrame-Ping)
 
## Main functionalities of MMM-SmartWebDisplay module: 
- Allow periodic refresh of the URL, or not (configurable), this allow to display images or video
- Allow several rotating URLs, it is possible to change the URL to display through a timer, or throught notification, or with a Telegram message (with MMM-TelegramBot installed)
- Allow to receive notification/Telegram messages for the following actions : 

	- Change the URL or the list of URLs to displays, and update refresh timer value and rotating timer value
	- Go to the next/previous URL of the list
	- Play(or restart)/Pause/Stop the update and rotation of URLs

These notifications can by sent by several other MM module and also (thanks to [MMM-RemoteControl](https://github.com/Jopyth/MMM-Remote-Control)) by external http request, as for example IFTTT or Tasker (Android). 
You can also send notification easily by using this fork of MMM-RemoteControl that add specifics controls : [MMM-RemoteControl for SmartWebDisplay](https://github.com/AgP42/MMM-Remote-Control)

- If a PIR-sensor using MMM-PIR-Sensor module is used, the display will not be updated during screen off (this behavior works also with all other module that send the notification "USER_PRESENCE") and will be refresh with screen on.
- If the MMM-SmartWebDisplay module is hidden (by REMOTE-CONTROL or any Carousel module for example), the URL display will not be updated. As soon as one MMM-SmartWebDisplay module will be again displayed on the screen, an update will be requested.
- Possibility to display the date and time of the last update request (configurable)
- Possibility to declare several instances (but so far the notification will address all the instances together)
- CSS file

Known issue : 
- If several instances of this module are declared, the notifications/Telegram messages send will apply on each instances. 

Some screenshot : 

Displaying YouTube (displayLastUpdate: true) : 
![MMM-SmartWebDisplay](https://github.com/AgP42/MMM-iFrame-Ping/blob/master/screenshot/MMM-iFrame-Ping_youtube_update.png)
Displaying TRENDnet snapshot (displayLastUpdate: false) : 

![MMM-SmartWebDisplay](https://github.com/AgP42/MMM-iFrame-Ping/blob/master/screenshot/MMM-iFrame-Ping.png)

MMM-RemoteControl menu for SmartWebDisplay : 
![](https://github.com/AgP42/MMM-Remote-Control/raw/master/.github/RemoteSWD_2.png)


## Installation

Git clone this repo into ~/MagicMirror/modules directory :
```
cd ~/MagicMirror/modules
git clone https://github.com/AgP42/MMM-SmartWebDisplay.git
```
and add the configuration section in your Magic Mirror config file 

## Update
```
cd ~/MagicMirror/modules/MMM-SmartWebDisplay
git pull
```

## Module configuration

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-SmartWebDisplay',
		position: 'middle_center',	// This can be any of the regions.
		config: {
			// See 'Configuration options' for more information.
			logDebug: false, //set to true to get detailed debug logs. To see them : "Ctrl+Shift+i"
			height:"100%", //hauteur du cadre en pixel ou %
			width:"100%", //largeur
               		updateInterval: 0, //in min. Set it to 0 for no refresh (for videos)
                	NextURLInterval: 0.5, //in min, set it to 0 not to have automatic URL change. If only 1 URL given, it will be updated
                	displayLastUpdate: true, //to display the last update of the URL
					displayLastUpdateFormat: 'ddd - HH:mm:ss', //format of the date and time to display
                	url: ["http://magicmirror.builders/", "https://www.youtube.com/embed/Qwc2Eq6YXTQ?autoplay=1"], //source of the URL to be displayed
					scrolling: "no", // allow scrolling or not. html 4 only
					shutoffDelay: 10000 //delay in miliseconds to video shut-off while using together with MMM-PIR-Sensor 
			}
	},
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
		<tr>
			<td><code>url</code></td>
			<td>List of the URL(s) to display<br>
				<br><b>Example:</b> See use case examples bellow. 
				<br><b>Default value:</b> <code>["http://magicmirror.builders/", "https://www.youtube.com/embed/Qwc2Eq6YXTQ?autoplay=1"],</code>
			</td>
		</tr>		
		<tr>
			<td><code>width</code></td>
			<td>the width of the iFrame<br>
				<br><b>Example:</b><code>"100%"</code>
				<br><b>Example:</b><code>"200px"</code>
				<br><b>Default value:</b> <code>"100%"</code>
			</td>
		</tr>
		<tr>
			<td><code>height</code></td>
			<td>the width of the iFrame<br>
				<br><b>Example:</b><code>"100%"</code>
				<br><b>Example:</b><code>"300px"</code>
				<br><b>Default value:</b> <code>"100px"</code>
			</td>
		</tr>
			<tr>
			<td><code>scrolling</code></td>
			<td>Allow a scroll bar or not<br>
				<br><b>Default value:</b> <code>"no"</code>
			</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>the update internal to refresh the display, in minutes. Set it to 0 to avoid refresh (case of videos)<br>
				<br><b>Example for 30 seconds:</b><code>0.5</code>
				<br><b>Default value:</b> <code>0.5</code>
			</td>
		</tr>
		<tr>
			<td><code>NextURLInterval</code></td>
			<td>The delay between 2 URL rotation, in minutes. Set it to 0 to avoid automatic rotation. If only 1 URL declared, it will be refresh with this delay (if not set to 0)<br>
				<br><b>Example for 30 seconds:</b><code>0.5</code>
				<br><b>Default value:</b> <code>0.5</code>
			</td>
		</tr>
		<tr>
			<td><code>displayLastUpdate</code></td>
			<td>If true this will display the last update time at the end of the task list. See screenshot bellow<br>
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>displayLastUpdateFormat</code></td>
			<td>Format to use for the time display if displayLastUpdate:true <br>
				<br><b>Possible values:</b> See [Moment.js formats](http://momentjs.com/docs/#/parsing/string-format/)
				<br><b>Default value:</b> <code>'ddd - HH:mm:ss'</code>
			</td>
		</tr>
			<tr>
			<td><code>logDebug</code></td>
			<td>Set to true to have all log infos on the console<br>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>shutoffDelay</code></td>
			<td>The delay between getting USER_PRESENCE notification from the PIR sensor. Please be acknoledged, that each time the MMM-PIR-Sensor will receive a modification of the sensor status, it will sent IMMIDIATELLY (to everyone, so to MMM-SmartWebDisplay too) a notification saying “USER_PRESENCE=true” or false.<br>
				<br><b>Possible values:</b> <code>Any miliseconds</code>
				<br><b>Default value:</b> <code>10000</code>
			</td>
		</tr>		
</table>

## Notifications

### Change the URL

From the config file of other module, example here with MMM-Navigate : 

<code>{notification: "SWD_URL", payload: {url:["https://magicmirror.builders/"]}}, 
{notification: "SWD_URL", payload: {url:["https://www.youtube.com/embed/Qwc2Eq6YXTQ?autoplay=1"]}},>/code>

or with MMM-ModuleScheduler : 

<code>{notification: 'SWD_URL', schedule: '30 7 * * *', payload: {url:["https://magicmirror.builders/"]}},</code>

from http requests using MMM-RemoteControl (GET request) : 
<code>http://192.168.xx.xx:8080/remote?action=NOTIFICATION&notification=SWD_URL&payload={"url":["https://magicmirror.builders/", "http://blabla.com"], "update":"0", "NextURL":"1"}</code>


### URL rotation (NEXT, PREV, PLAY, PAUSE, STOP)

From another module : 

- {notification: "SWD_NEXT"},

- {notification: "SWD_PREV"},

- {notification: "SWD_PLAY"},

- {notification: "SWD_PAUSE"},

- {notification: "SWD_STOP"},

From http request (GET request) : 

http://192.168.xx.xx:8080/remote?action=NOTIFICATION&notification=SWD_NEXT

http://192.168.xx.xx:8080/remote?action=NOTIFICATION&notification=SWD_PREV

http://192.168.xx.xx:8080/remote?action=NOTIFICATION&notification=SWD_PLAY

http://192.168.xx.xx:8080/remote?action=NOTIFICATION&notification=SWD_PAUSE

http://192.168.xx.xx:8080/remote?action=NOTIFICATION&notification=SWD_STOP

Warning : "play/pause/stop" apply to the rotation of the URL, not to the video (if you display a video) itself. It is not possible to interact with the video itself...

## Commands from MMM-TelegramBot

Please see [here](https://github.com/eouia/MMM-TelegramBot) for this module documentation. 

### Change the URL to be displayed : 

/swd_url (then the url you want to display on your MagicMirror)
for example :
```
/swd_url http://magicmirror.builders/
```

### Other commands : 
```
/swd_next
/swd_prev
/swd_play
/swd_pause
/swd_stop
```

Warning : "play/pause/stop" apply to the rotation of the URL, not to the video (if you display a video) itself. It is not possible to interact with the video itself...

## Use case examples

### TRENDnet camera (snapshots)
Snapshot URL : http://website.com:port/image/jpeg.cgi
(Works only without "Snapshot URL Authentication")

### Nest Camera streaming
As of right now, Nest Camera only support streaming to iFrame when the camera feed is set to public. When you set it to public, you'll get a live URL and a iFrame embedded URL (should look like https://video.nest.com/embedded/live/wSbs3mRsOF?autoplay=1). For more info, check out this thread https://nestdevelopers.io/t/is-there-a-way-to-get-nest-camera-streams-in-an-iframe/813. 

### D-Link Camera streaming
D-Link cameras streams can be easily embedded into an iFrame.  Some cameras require a username and password.  You can construct a URL that looks like this http://admin:password@10.0.1.7/mjpeg.cgi. For mroe info, check out http://forums.dlink.com/index.php?PHPSESSID=ag1ne0jgnnl7uft3s1ssts14p4&topic=59173.0.

### Youtube streaming
Just got to the video you want (see bellow more details). Click share and embed and pull out the url and add the autoplay parameter (eg.   https://www.youtube.com/embed/pcmjht0Hqvw?autoplay=1).

#### Youtube playlist streaming (thanks to [theramez](https://github.com/AgP42/MMM-iFrame-Ping/issues/4))

You can stream any public playlist or make your own playlist (this requires a youtube account). 
With your own playlist streaming on the mirror, you are able to change the contents directly on YouTube (adding videos, removing others, adding live channels and broadcasts..etc) using your mobile or desktop, without changing anything to the mirror and it'll be updated automatically 🥇

To do so : firstly, go to the first video in any playlist, right click and choose Copy embed code as seen here
![MMM-iFrame-Ping](https://github.com/AgP42/MMM-iFrame-Ping/blob/master/screenshot/youtubeplaylist.jpg)

now paste it on any notepad. It should look like that :
```
<iframe width="853" height="480" src="https://www.youtube.com/embed/XMIc4uTAMh0?list=PLbIZ6k-SE9ShGEZ_wuvG3hatiC6jWJgVm" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
```

we only need the source src part so copy this part only, it should look like that :
```
https://www.youtube.com/embed/XMIc4uTAMh0?list=PLbIZ6k-SE9ShGEZ_wuvG3hatiC6jWJgVm
```

copy this link to the module url: in config.js file and voila! you've a full playlist in your mirror... but wait a minute videos are not auto playable and I want to add a shuffle! also what happens when the list play is finished? here comes the fun part (^_^) you can simply add tags called YouTube player parameters within your link just like that link&TAG
so in our example to enable autoplay add tag:

    autoplay=1

so our link will be
```
https://www.youtube.com/embed/XMIc4uTAMh0?list=PLbIZ6k-SE9ShGEZ_wuvG3hatiC6jWJgVm&autoplay=1
```

you can add multiple tags like link&TAG1&TAG2&TAG3
to enable list repeating add tag

    loop=1

to remove the YouTube logo from the control bar add

    modestbranding=1

to disable videos annotations add

    iv_load_policy=3

Small hint: you can test your link in the browser easily : just open a new tab and paste it to see how it will be exactly on the mirror

so we'll edit our link to make it autoplayable and disable annoying annotations and remove YouTube logo
```
https://www.youtube.com/embed/XMIc4uTAMh0?list=PLbIZ6k-SE9ShGEZ_wuvG3hatiC6jWJgVm&autoplay=1&modestbranding=1&iv_load_policy=3
```

wanna edit the YouTube player more ? here is the full list of tags in The Official YouTube API page under Supported Parameters table :
to disable keyboard inputs to the player, add

    disablekb=1

to disable the player controls completely for more clean look, add

    controls=0
    
## CSS use

See MMM-SmartWebDisplay.css file for details of configurable field


The MIT License (MIT)
=====================

Copyright © 2019 Agathe Pinel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
