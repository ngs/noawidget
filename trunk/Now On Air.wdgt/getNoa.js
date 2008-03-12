
/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:::
:::
:::
:::	 Now On Air for Dashboard 1.0 :::
:::
:::	 code + design ::: atsushi nagase ::: http://ngsdev.org/
:::
:::
:::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


var xmlloc = "http://www.j-wave.co.jp/top/xml/now_on_air_song.xml";
var cdloc
var query
var statusDiv;
var noaDiv;
var interval_engine;
var interval;
var flip
var flip2
var interval_array = [0,0.1,0.5,1,1.5,2,5,10];
var reloadButton
function setup() {
	flip2 = new Flip("flip2","fliprollie2");
	flip = new Flip("flip","fliprollie");
	if (window.widget) {
		widget.onhide = onhide;
		widget.onshow = onshow;
		interval = widget.preferenceForKey("interval");
	}
	if(isNaN(interval)) changeInterval(1);
	createGenericButton(document.getElementById('doneButton'), "DONE", hideBack);
	getNoa();
}

function onshow() {
	activeInterval()
	getNoa()
}

function activeInterval() {
	removeInterval()
	if(interval) interval_engine = setInterval("getNoa();", interval);
	//alert(interval_engine)
}

function showFlips() {
	flip2.button.style.backgroundImage = "url(images/rotate.png)";
	flip.show()
	flip2.show()
}

function hideFlips() {
	flip.hide()
	flip2.hide()
}

function removeInterval() {
	clearInterval(interval_engine);
	delete interval_engine;
}

function onhide() {
	removeInterval()
}

function getNoa() {
	//alert("loading")
	noaDiv = document.getElementById("noa");
	//showStatus("読み込み中");
	flip2.setOpacity(100)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4){
			flip2.button.style.backgroundImage = "url(images/rotate.gif)";
			if(! flip2.isOver()) flip2.opacityTo(0)
			if(xhttp.responseText) {
				showStatus();
				changeNoa(xhttp.responseXML);
			}else{
				//showStatus("読み込み失敗");
			}
		}
	}
	var rnd = Math.ceil(Math.random()*100000);
	var fname = xmlloc+"?rnd="+rnd;
	xhttp.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
	xhttp.open('GET',fname,true)
	xhttp.send(null);
}
var song
var artist
function changeNoa(param) {
	var fc = param.firstChild.childNodes
	var len = fc.length
	for(var i=0;i<len;i++) {
		if(fc[i].nodeName=="data") {
			var info = fc[i].getAttribute("information");
			var lar = utf8to16(fc[i].getAttribute("cd_url")).split("?noa=");
			cdloc = lar[0];
			//query = utf8to16(lar[1]).replace(/%20/g,"+");
			var info_ar = info.split("」")
			song = info_ar[0].split("「").join('');
			artist = info_ar[1]
			noaDiv.innerHTML = "<div id=\"song\">"+song+"</div>";
			noaDiv.innerHTML += "<div id=\"artist\">"+artist+ "</div>";
			query = "「 "+song+" 」 "+artist;
			break;
		}
	}
}
function showStatus(param) {
	if(!param) param = "";
	statusDiv = document.getElementById("status");
	statusDiv.innerHTML = param;
}
function getCD() {
	if(!flip.isOver()&&!flip2.isOver()) {
		if (window.widget) {
			widget.openURL(cdloc+"?noa="+query);
		} else {
			window.location.href = cdloc+"?noa="+query;
		}
	}
}

function changeInterval(t) {
	t = interval_array[t];
	t*=60000;
	if(t) {
		activeInterval()
	} else {
		t = 0;
		removeInterval()
	}
	interval = t
	//alert(t)
	if(window.widget) widget.setPreferenceForKey(t,"interval");
}

function attachSelect() {
	var sel = document.getElementById("selectInterval");
	var len = interval_array.length
	for(var i=0; i<len; i++) {
		var opt = document.createElement("option");
		opt.value = i.toString();
		opt.selected = interval_array[i]*60000 == interval;
		var m = Math.floor(interval_array[i]);
		var s = interval_array[i] - m
		if(s>0) s*=60;
		var t = "";
		if(m) t+= m.toString()+"分";
		if(s) t+= s.toString()+"秒";
		if(!t) t= "しない";
		var tx = document.createTextNode(t)
		opt.appendChild(tx)
		sel.appendChild(opt)
	}
}

function removeSelect() {
	document.getElementById("selectInterval").innerHTML = "";
}


/*------------------------------------------------------------------------

functions from

[ Dashboard Programming Guide: Displaying a Reverse Side ]
http://developer.apple.com/ja/documentation/AppleApplications/Conceptual/Dashboard_Tutorial/Preferences/chapter_5_section_3.html

------------------------------------------------------------------------*/
function showBack()
{
	attachSelect();
	var front = document.getElementById("front");
	var back = document.getElementById("back");
		
	if (window.widget) widget.prepareForTransition("ToBack");
				
	front.style.display="none";
	back.style.display="block";
		
	if (window.widget) setTimeout ('widget.performTransition();', 0);  
}


function hideBack()
{
	flip.out(event);
	flip2.out(event);
	removeSelect();
	activeInterval()
	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget) widget.prepareForTransition("ToFront");

	back.style.display="none";
	front.style.display="block";

	if (window.widget) setTimeout ('widget.performTransition();', 0);
}


/*------------------------------------------------------------------------*/