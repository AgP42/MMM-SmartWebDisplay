/* Magic Mirror
 * Module: MMM-SmartWebDisplay
 * 
 * By AgP42
 * First Version : 09/02/2019
 * 
 * MIT Licensed.
 */
 
//For the PIR sensor
var UserPresence = true; //by default : user present. (No PIR-Sensor)
var startTimePir = 0;

Module.register("MMM-SmartWebDisplay",{
		
		// Default module config.
		defaults: {
				logDebug: false, //set to true to get detailed debug logs. To see them : "Ctrl+Shift+i"
				height:"100%", //hauteur du cadre en pixel ou %
				width:"100%", //largeur
                updateInterval: 0, //in min. Set it to 0 for no refresh (for videos)
                NextURLInterval: 0.5, //in min, set it to 0 not to have automatic URL change. If only 1 URL given, it will be updated
                displayStateInfos: false,	//to display extra debug info directly on the module 
                displayLastUpdate: true, //to display the last update of the URL
				displayLastUpdateFormat: 'ddd - HH:mm:ss', //format of the date and time to display
                url: ["http://magicmirror.builders/", "https://www.youtube.com/embed/Qwc2Eq6YXTQ?autoplay=1"], //source of the URL to be displayed
				scrolling: "no", // allow scrolling or not. html 4 only
				shutoffDelay: 10000	
		},

start: function () {
	
		Log.info("Starting module: " + this.name + " with identifier: " + this.identifier);

		self = this;
		
		this.ModuleiFrameHidden = false; //displayed by default
		this.updateIntervalID = 0;
		this.NextURLIntervalID = 0;
		this.URLposition = 0;
		this.ActualState = "Starting...";
		
		//local variables, copie the config at startup and then will follow its life...
		this.url_list = this.config.url;
		this.updateInt = this.config.updateInterval; 
		this.nextURLInt = this.config.NextURLInterval;
        this.shutoffDelay = this.config.shutoffDelay;		
		
		//run !!
   		this.StartDisplay();	

}, //end start function

//call only once at start-up
iframeLoad: function() {
	
	if(this.config.logDebug){
		Log.log ("iframeLoad à : " + moment.unix(Date.now() / 1000).format('dd - HH:mm:ss') + "url : " + this.urlToDisplay);		
	}
	
	//Init of the iFrame   
	iframe = document.createElement("IFRAME");
	iframe.width = this.config.width;
	iframe.height = this.config.height;
	iframe.scrolling = this.config.scrolling;
	iframe.src = this.urlToDisplay; 
	
    return iframe;
},

//allow to select the URL to be displayed
selectURL: function(direction) {
	
	self = this;
	
	if(this.config.logDebug){
		Log.log("Fct selectURL - URLposition = " + self.URLposition);
	}
			
	if(direction === "next"){
		self.URLposition++;
		
		if(self.URLposition === self.url_list.length) //quand on a atteint la fin de la liste, on repart au debut
		{
			self.URLposition = 0;
		}
	}else if(direction === "prev"){
		
		self.URLposition--;
		
		if(self.URLposition < 0)  //si negatif, on revient a partir de la fin de la liste
		{
			self.URLposition = self.url_list.length + self.URLposition;
		}
	}
	
	return self.url_list[self.URLposition];

},
  
suspend: function() { //function called when module is hidden
	this.ModuleiFrameHidden = true; 
	
	if(this.config.logDebug){
		Log.log("Fct suspend - ModuleHidden = " + this.ModuleiFrameHidden);
	}
	
	this.GestionUpdateIntervalSWD(); //call the function that manage all cases
},

resume: function() { //function called when module is displayed again
	this.ModuleiFrameHidden = false;
	
	if(this.config.logDebug){
		Log.log("Fct resume - ModuleHidden = " + this.ModuleiFrameHidden);
	}
	
	this.GestionUpdateIntervalSWD();	
},

notificationReceived: function(notification, payload) {
	if (notification === "USER_PRESENCE") { // notification sent by the module MMM-PIR-Sensor or others
		
		if(this.config.logDebug){
			Log.log("Fct notificationReceived USER_PRESENCE - payload = " + payload);
		}
		
		UserPresence = payload;
		this.GestionUpdateIntervalSWD();
	}
	
	if (notification === "SWD_URL") {
		
		if(this.config.logDebug){
			Log.log("Fct notificationReceived SWD_URL - payload = " + payload.url + payload.update + payload.NextURL);
		}
				
		this.URLposition = 0; //on reinitialise notre boucle de lecture des URL pour recommencer par la 1ere
		
		if (payload.url){
			this.url_list = payload.url;
			if(this.config.logDebug){
				Log.log("URL présent et le voilà = " + this.url_list);
			}	
		}
		if (payload.update){
			this.updateInt = payload.update; 
			
			if(this.config.logDebug){
				Log.log("update présent et le voilà = " + this.updateInt);
			}	
		}
		if (payload.NextURL){
			this.nextURLInt = payload.NextURL;
			
			if(this.config.logDebug){
				Log.log("NextURL présent et le voilà = " + this.nextURLInt);
			}	
		}
		
   		this.StopDisplay();	//on arrete tout ce qui cours
   		this.StartDisplay();	//on relance avec les nouvelles infos          	
	
	}
	
	if (notification === "SWD_NEXT") {
		
		if(this.config.logDebug){
			Log.log("Fct notificationReceived SWD_NEXT");
		}		
			
		this.StopDisplay();	//on arrete tout ce qui cours
   		this.StartDisplay("next");	//demande la prochaine video
		//arreter puis relancer permet de relancer les timers de mise à jour
	
	}
	
	if (notification === "SWD_PREV") {
		
		if(this.config.logDebug){
			Log.log("Fct notificationReceived SWD_PREV");
		}		
			
		this.StopDisplay();	//on arrete tout ce qui cours
   		this.StartDisplay("prev");	
		//arreter puis relancer permet de relancer les timers de mise à jour
	
	}
	
	if (notification === "SWD_PLAY") {
		
		if(this.config.logDebug){
			Log.log("Fct notificationReceived SWD_PLAY");
		}		
			
		this.StopDisplay();	//on arrete tout ce qui cours
   		this.StartDisplay();	//on relance avec l'URL en cours
		//arreter puis relancer permet de relancer les timers de mise à jour
	
	}
	
	if (notification === "SWD_STOP") {
		
		if(this.config.logDebug){
			Log.log("Fct notificationReceived SWD_STOP");
		}		
		
		this.StopDisplay();	//on arrete tout ce qui cours et on coupe la video
	
	}
	
	if (notification === "SWD_PAUSE") {
		
		if(this.config.logDebug){
			Log.log("Fct notificationReceived SWD_PAUSE");
		}		
		
		clearInterval(this.updateIntervalID); // on arrete l'intervalle d'update en cours
		this.updateIntervalID=0; //on reset la variable
		
		clearInterval(this.NextURLIntervalID); // on arrete l'intervalle pour passer d'une URL à l'autre en cours
		this.NextURLIntervalID=0; //on reset la variable
				
		this.ActualState = "Pause";

		//but the actual video continu to run, or the actual display will remains, only timers are stopped
			
	}
},


getCommands: function(commander) {
  commander.add({
    command: 'swd_next',
    callback: 'command_swd_next'
  });
  commander.add({
    command: 'swd_prev',
    callback: 'command_swd_prev'
  });
  commander.add({
    command: 'swd_play',
    callback: 'command_swd_play'
  });
  commander.add({
    command: 'swd_stop',
    callback: 'command_swd_stop'
  });
  commander.add({
    command: 'swd_pause',
    callback: 'command_swd_pause'
  });
  commander.add({
    command: 'swd_url',
    callback: 'command_swd_url'
  });
},

command_swd_next: function(command, handler) {
  	this.StopDisplay();	//on arrete tout ce qui cours
   	this.StartDisplay("next");	//demande la prochaine video
	//arreter puis relancer permet de relancer les timers de mise à jour
    handler.reply("TEXT", "Next URL requested");
},

command_swd_prev: function(command, handler) {
  	this.StopDisplay();	//on arrete tout ce qui cours
   	this.StartDisplay("prev");
	//arreter puis relancer permet de relancer les timers de mise à jour
    handler.reply("TEXT", "Previous URL requested");
},

command_swd_play: function(command, handler) {
	this.StopDisplay();	//on arrete tout ce qui cours
   	this.StartDisplay();	//on relance avec l'URL en cours
		//arreter puis relancer permet de relancer les timers de mise à jour
    handler.reply("TEXT", "Play requested");
},

command_swd_stop: function(command, handler) {
	this.StopDisplay();	//on arrete tout ce qui cours et on coupe la video

    handler.reply("TEXT", "Stop requested");
},

command_swd_pause: function(command, handler) {
		
	clearInterval(this.updateIntervalID); // on arrete l'intervalle d'update en cours
	this.updateIntervalID=0; //on reset la variable
		
	clearInterval(this.NextURLIntervalID); // on arrete l'intervalle pour passer d'une URL à l'autre en cours
	this.NextURLIntervalID=0; //on reset la variable
				
	this.ActualState = "Pause";

	//but the actual video continu to run, or the actual display will remains, only timers are stopped
    
	handler.reply("TEXT", "Pause requested");
},

command_swd_url: function(command, handler) {
		
	this.URLposition = 0; //on reinitialise notre boucle de lecture des URL pour recommencer par la 1ere
		
	if (handler.args){
		this.url_list = [handler.args];
	}
		
   	this.StopDisplay();	//on arrete tout ce qui cours
   	this.StartDisplay();	//on relance avec les nouvelles infos       
    
	handler.reply("TEXT", "New URL received");
},

GestionUpdateIntervalSWD: function() {
	if (UserPresence === true && this.ModuleiFrameHidden === false){ //user is present and module is displayed
		
  		this.StartDisplay();	//on relance au dernier URL	
		this.ModuleiFrameHidden = true;
	}else if (UserPresence === false && this.ModuleiFrameHidden === false && new Date().getTime() > this.startTimePir + this.shutoffDelay){ //user is not present AND module is displayed AND shutoffDelay is ended already : stop updating and stop video playing
   		
   		this.StopDisplay();

	}
},


StopDisplay: function() {
  		
		if(this.config.logDebug){
			Log.log("Stop Display ! updateIntervalID : " + this.updateIntervalID + " NextURLIntervalID : " + this.NextURLIntervalID);
		}
		
		clearInterval(this.updateIntervalID); // on arrete l'intervalle d'update en cours
		this.updateIntervalID=0; //on reset la variable
		
		clearInterval(this.NextURLIntervalID); // on arrete l'intervalle pour passer d'une URL à l'autre en cours
		this.NextURLIntervalID=0; //on reset la variable
		
		//stop the video 
        this.urlToDisplay = "";
   		this.ActualState = "STOPPED";

  		this.updateDom(1000);
},


StartDisplay: function(direction) {
  	
  		var self = this;

		if(this.config.logDebug){
			Log.log("StartDisplay, direction : " + direction);
		}	
		
		this.urlToDisplay = this.selectURL(direction);
		this.ActualState = "Playing";

		self.updateDom(1000);	
						                               
		//set autoupdate of the DOM                            
        if(this.updateIntervalID === 0 && this.updateInt > 0){
			this.updateIntervalID = setInterval( function () { 
				self.updateDom(1000);
			}, this.updateInt * 60 * 1000);    
		}

		//set auto next url
        if(this.NextURLIntervalID === 0 && this.nextURLInt > 0){
			this.NextURLIntervalID = setInterval( function () { 
				self.urlToDisplay = self.selectURL("next");
				self.updateDom(1000);
			}, this.nextURLInt * 60 * 1000);    
		}
},

getStyles: function() {
    return ["MMM-SmartWebDisplay.css"];
},


// Override dom generator.
getDom: function() {
	
	var self = this;

	if(this.config.logDebug){		
		Log.log ("update SWD DOM at : " + moment.unix(Date.now() / 1000).format('dd - HH:mm:ss')  + ", url : " + this.urlToDisplay);		
	}
	
	var wrapper = document.createElement("div");// main Wrapper that containts the others
	wrapper.className = "mainWrapper"; //for CSS customization
	
		//Init of the iFrame   
	iframe = document.createElement("IFRAME");
	iframe.width = this.config.width;
	iframe.height = this.config.height;
	iframe.scrolling = this.config.scrolling;
	
	iframe.src = this.urlToDisplay; 
	wrapper.appendChild(iframe);//request the iFrame to be displayed
	
/*	var html = `
			<iframe
				src="${this.urlToDisplay}"
                width="${this.config.width}"
                height="${this.config.height}"
                scrolling="${this.config.scrolling}"
            ></iframe>
        `;

    wrapper.insertAdjacentHTML("afterbegin", html);  //*/             
	
	//to display last update at the end
	if(this.config.displayLastUpdate){
		
		this.lastUpdate = Date.now() / 1000 ; 

		var updateinfo = document.createElement("div"); //le div qui donne la date, si configuré pour etre affichée
		updateinfo.className = "updateinfo"; // align-left
		updateinfo.innerHTML = "Update requested at : " + moment.unix(this.lastUpdate).format(this.config.displayLastUpdateFormat);
		wrapper.appendChild(updateinfo);
	}
	
	//to display state info at the end
	if(this.config.displayStateInfos){
		
		var stateinfo = document.createElement("div"); 
		stateinfo.className = "stateinfo"; // align-left
		stateinfo.innerHTML = /*"Update display interval : " + this.updateInt + "min, Delay between each URL : " + this.nextURLInt + "min, actual status : " + this.ActualState +*/ ", URL : " + this.url_list;
		wrapper.appendChild(stateinfo);
	}//*/
			
	return wrapper;
	
	}//fin getDom

}); //fin module register
