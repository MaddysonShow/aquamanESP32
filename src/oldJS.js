var WBut= document.getElementById("white");
var BBut= document.getElementById("blue");
var GBut= document.getElementById("green");
var RBut= document.getElementById("red");

var BackButW=document.getElementById("backW");
var BackButB=document.getElementById("backB");
var BackButG=document.getElementById("backG");
var BackButR=document.getElementById("backR");

var Wblock= document.getElementById("controlWhite");
var Bblock= document.getElementById("controlBlue");
var Gblock= document.getElementById("controlGreen");
var Rblock= document.getElementById("controlRed");

var Wbright=document.getElementById("whiteBr");
var Bbright=document.getElementById("blueBr");
var Gbright=document.getElementById("greenBr");
var Rbright=document.getElementById("redBr");

var main=document.getElementById("mainBlock");

//----------------------request-----------



//--------------refresh time--------------------


setInterval(refresh_time,60000);
function refresh_time(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            mclock.value=this.responseText;
        }
    };
    xhttp.open("GET","refresh?r=1",true); //
    xhttp.send();
}

//----------------start white-------------------

var start_white=document.querySelector(".startTimeW");
start_white.addEventListener("change",tx_start_white);
function tx_start_white(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            start_white.value=this.responseText;
        }
    };
    if(!start_white.value){start_white.value="00:00";}
    xhttp.open("GET","start_white?stw="+start_white.value,true); //
    xhttp.send();
}


//----------------start blue-------------------
var start_blue=document.querySelector(".startTimeB");
start_blue.addEventListener("change",tx_start_blue);
function tx_start_blue(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            start_blue.value=this.responseText;
        }
    };
    if(!start_blue.value){start_blue.value="00:00";}
    xhttp.open("GET","start_blue?stb="+start_blue.value,true); //
    xhttp.send();
}

//----------------start green-------------------

var start_green=document.querySelector(".startTimeG");
start_green.addEventListener("change",tx_start_green);
function tx_start_green(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            start_green.value=this.responseText;
        }
    };
    if(!start_green.value){start_green.value="00:00";}
    xhttp.open("GET","start_green?stg="+start_green.value,true); //
    xhttp.send();
}


//----------------start red-------------------
var start_red=document.querySelector(".startTimeR");
start_red.addEventListener("change",tx_start_red);
function tx_start_red(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            start_red.value=this.responseText;
        }
    };
    if(!start_red.value){start_red.value="00:00";}
    xhttp.open("GET","start_red?str="+start_red.value,true); //
    xhttp.send();
}

//----------------rise white-------------------

var rise_white=document.querySelector(".riseTimeW");
rise_white.addEventListener("change",tx_rise_white);
function tx_rise_white(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            rise_white.value=this.responseText;
        }
    };
    if(!rise_white.value){rise_white.value="00:00";}
    xhttp.open("GET","rise_white?rsw="+rise_white.value,true); //
    xhttp.send();
}

//----------------rise blue-------------------
var rise_blue=document.querySelector(".riseTimeB");
rise_blue.addEventListener("change",tx_rise_blue);
function tx_rise_blue(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            rise_blue.value=this.responseText;
        }
    };
    if(!rise_blue.value){rise_blue.value="00:00";}
    xhttp.open("GET","rise_blue?rsb="+rise_blue.value,true); //
    xhttp.send();
}

//----------------rise green-------------------

var rise_green=document.querySelector(".riseTimeG");
rise_green.addEventListener("change",tx_rise_green);
function tx_rise_green(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            rise_green.value=this.responseText;
        }
    };
    if(!rise_green.value){rise_green.value="00:00";}
    xhttp.open("GET","rise_green?rsg="+rise_green.value,true); //
    xhttp.send();
}

//----------------rise red-------------------
var rise_red=document.querySelector(".riseTimeR");
rise_red.addEventListener("change",tx_rise_red);
function tx_rise_red(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            rise_red.value=this.responseText;
        }
    };
    if(!rise_red.value){rise_red.value="00:00";}
    xhttp.open("GET","rise_red?rsr="+rise_red.value,true); //
    xhttp.send();
}

//----------------dawn white-------------------

var dawn_white=document.querySelector(".dawnTimeW");
dawn_white.addEventListener("change",tx_dawn_white);
function tx_dawn_white(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            dawn_white.value=this.responseText;
        }
    };
    if(!dawn_white.value){dawn_white.value="00:00";}
    xhttp.open("GET","dawn_white?dww="+dawn_white.value,true); //
    xhttp.send();
}

//----------------dawn blue-------------------

var dawn_blue=document.querySelector(".dawnTimeB");
dawn_blue.addEventListener("change",tx_dawn_blue);
function tx_dawn_blue(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            dawn_blue.value=this.responseText;
        }
    };
    if(!dawn_blue.value){dawn_blue.value="00:00";}
    xhttp.open("GET","dawn_blue?dwb="+dawn_blue.value,true); //
    xhttp.send();
}

//----------------dawn green-------------------

var dawn_green=document.querySelector(".dawnTimeG");
dawn_green.addEventListener("change",tx_dawn_green);
function tx_dawn_green(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            dawn_green.value=this.responseText;
        }
    };
    if(!dawn_green.value){dawn_green.value="00:00";}
    xhttp.open("GET","dawn_green?dwg="+dawn_green.value,true); //
    xhttp.send();
}

//----------------dawn red-------------------

var dawn_red=document.querySelector(".dawnTimeR");
dawn_red.addEventListener("change",tx_dawn_red);
function tx_dawn_red(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            dawn_red.value=this.responseText;
        }
    };
    if(!dawn_red.value){dawn_red.value="00:00";}
    xhttp.open("GET","dawn_red?dwr="+dawn_red.value,true); //
    xhttp.send();
}

//----------------stop white-------------------

var stop_white=document.querySelector(".stopTimeW");
stop_white.addEventListener("change",tx_stop_white);
function tx_stop_white(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            stop_white.value=this.responseText;
        }
    };
    if(!stop_white.value){stop_white.value="00:00";}
    xhttp.open("GET","stop_white?stw="+stop_white.value,true); //
    xhttp.send();
}


//----------------stop blue-------------------

var stop_blue=document.querySelector(".stopTimeB");
stop_blue.addEventListener("change",tx_stop_blue);
function tx_stop_blue(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            stop_blue.value=this.responseText;
        }
    };
    if(!stop_blue.value){stop_blue.value="00:00";}
    xhttp.open("GET","stop_blue?stb="+stop_blue.value,true); //
    xhttp.send();
}

//----------------stop green-------------------

var stop_green=document.querySelector(".stopTimeG");
stop_green.addEventListener("change",tx_stop_green);
function tx_stop_green(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            stop_green.value=this.responseText;
        }
    };
    if(!stop_green.value){stop_green.value="00:00";}
    xhttp.open("GET","stop_green?stg="+stop_green.value,true); //
    xhttp.send();
}


//----------------stop red-------------------

var stop_red=document.querySelector(".stopTimeR");
stop_red.addEventListener("change",tx_stop_red);
function tx_stop_red(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            stop_red.value=this.responseText;
        }
    };
    if(!stop_red.value){stop_red.value="00:00";}
    xhttp.open("GET","stop_red?str="+stop_red.value,true); //
    xhttp.send();
}

//------------ max bright white-------------------------
var bright_white=document.querySelector(".max_white");
bright_white.addEventListener("change",tx_bright_white);

function tx_bright_white(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            bright_white.value=this.responseText;
        }
    };
    if(!bright_white.value){bright_white.value="0";}
    if (bright_white.value<0) {bright_white.value=0;}
    if (bright_white.value>100) {bright_white.value=100;}
    xhttp.open("GET","bright_white?mbw="+bright_white.value,true); //
    xhttp.send();
}

//------------max bright blue-------------------------
var bright_blue=document.querySelector(".max_blue");
bright_blue.addEventListener("change",tx_bright_blue);

function tx_bright_blue(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            bright_blue.value=this.responseText;
        }
    };
    if(!bright_blue.value){bright_blue.value="0";}
    if (bright_blue.value>100) {bright_blue.value=100;}
    if (bright_blue.value<0) {bright_blue.value=0;}
    xhttp.open("GET","bright_blue?mbb="+bright_blue.value,true); ////////////////////////////////////
    xhttp.send();
}

//------------ max bright green-------------------------
var bright_green=document.querySelector(".max_green");
bright_green.addEventListener("change",tx_bright_green);

function tx_bright_green(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            bright_green.value=this.responseText;
        }
    };
    if(!bright_green.value){bright_green.value="0";}
    if (bright_green.value<0) {bright_green.value=0;}
    if (bright_green.value>100) {bright_green.value=100;}
    xhttp.open("GET","bright_green?mbg="+bright_green.value,true); ////////////////////////////////
    xhttp.send();
}

//------------max bright red-------------------------
var bright_red=document.querySelector(".max_red");
bright_red.addEventListener("change",tx_bright_red);

function tx_bright_red(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            bright_red.value=this.responseText;
        }
    };
    if(!bright_red.value){bright_red.value="0";}
    if (bright_red.value>100) {bright_red.value=100;}
    if (bright_red.value<0) {bright_red.value=0;}
    xhttp.open("GET","bright_red?mbr="+bright_red.value,true); //
    xhttp.send();
}


//------------ min bright white-------------------------
var min_white=document.querySelector(".min_white");
min_white.addEventListener("change",tx_min_white);


function tx_min_white(){

    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            min_white.value=this.responseText;
        }
    };
    if(!min_white.value){min_white.value="0";}
    if(min_white.value>100){min_white.value=100;}
    if(min_white.value<0){min_white.value=0;}
    xhttp.open("GET","min_white?minbw="+min_white.value,true); ////////////////////////////////
    xhttp.send();
}

//------------min bright blue-------------------------
var min_blue=document.querySelector(".min_blue");
min_blue.addEventListener("change",tx_min_blue);

function tx_min_blue(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            min_blue.value=this.responseText;
        }
    };
    if(!min_blue.value){min_blue.value="0";}
    if(min_blue.value>100){min_blue.value=100;}
    if(min_blue.value<0){min_blue.value=0;}
    xhttp.open("GET","min_blue?minbb="+min_blue.value,true); ///////////////////////////////////////
    xhttp.send();
}

//------------ min bright green-------------------------
var min_green=document.querySelector(".min_green");
min_green.addEventListener("change",tx_min_green);


function tx_min_green(){

    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            min_green.value=this.responseText;
        }
    };
    if(!min_green.value){min_green.value="0";}
    if(min_green.value>100){min_green.value=100;}
    if(min_green.value<0){min_green.value=0;}
    xhttp.open("GET","min_green?minbg="+min_green.value,true); //////////////////////////////
    xhttp.send();
}

//------------min bright red-------------------------
var min_red=document.querySelector(".min_red");
min_red.addEventListener("change",tx_min_red);

function tx_min_red(){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status==200){
            min_red.value=this.responseText;
        }
    };
    if(!min_red.value){min_red.value="0";}
    if(min_red.value>100){min_red.value=100;}
    if(min_red.value<0){min_red.value=0;}
    xhttp.open("GET","min_red?minbr="+min_red.value,true); //
    xhttp.send();
}


//---------------------refresh-----------              КОМЕНТИРОВАНО 1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// window.onload = function getData(){
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             var rx=JSON.parse(this.responseText);
//             var mhr;
//             var mmin;
// //start
//             var stwh;
//             var stwm;
//
//             var stbh;
//             var stbm;
//
//             var stgh;
//             var stgm;
//
//             var strh;
//             var strm;
// //rise
//             var rswh;
//             var rswm;
//
//             var rsbh;
//             var rsbm;
//
//             var rsgh;
//             var rsgm;
//
//             var rsrh;
//             var rsrm;
// //dawn
//             var dwh;
//             var dwm;
//
//             var dbh;
//             var dbm;
//
//             var dgh;
//             var dgm;
//
//             var drh;
//             var drm;
// //stop
//             var spwh;
//             var spwm;
//
//             var spbh;
//             var spbm;
//
//             var spgh;
//             var spgm;
//
//             var sprh;
//             var sprm;
//
// //show bright
//             var brwh = {value: 0};
//             var brbl = {value: 0};
//             var brrd = {value: 0};
//             var brgr = {value: 0};
//
//
// //------mclock--------------
//             mhr=""+rx.hrs;
//             if(mhr.length==1){mhr="0"+mhr;}
//             mmin=""+rx.min;
//             if(mmin.length==1){mmin="0"+mmin;}
//             mclock.value=mhr+":"+mmin;
//
// //------start_white-----------
//             stwh=""+rx.start_hw;
//             if(stwh.length==1){stwh="0"+stwh;}
//
//             stwm=""+rx.start_mw;
//             if(stwm.length==1){stwm="0"+stwm;}
//             start_white.value=stwh+":"+stwm;
//
// //--------start_blue--------------
//             stbh=""+rx.start_hb;
//             if(stbh.length==1){stbh="0"+stbh;}
//
//             stbm=""+rx.start_mb;
//             if(stbm.length==1){stbm="0"+stbm;}
//             start_blue.value=stbh+":"+stbm;
//
//
// //------start_green-----------
//             stgh=""+rx.start_hg;
//             if(stgh.length==1){stgh="0"+stgh;}
//
//             stgm=""+rx.start_mg;
//             if(stgm.length==1){stgm="0"+stgm;}
//             start_green.value=stgh+":"+stgm;
//
// //--------start_red--------------
//             strh=""+rx.start_hr;
//             if(strh.length==1){strh="0"+strh;}
//
//             strm=""+rx.start_mr;
//             if(strm.length==1){strm="0"+strm;}
//             start_red.value=strh+":"+strm;
//
//
// //--------rise_white--------------
//             rswh=""+rx.rise_hw;
//             if(rswh.length==1){rswh="0"+rswh;}
//
//             rswm=""+rx.rise_mw;
//             if(rswm.length==1){rswm="0"+rswm;}
//             rise_white.value=rswh+":"+rswm;
//
//
// //--------rise_blue--------------
//             rsbh=""+rx.rise_hb;
//             if(rsbh.length==1){rsbh="0"+rsbh;}
//
//             rsbm=""+rx.rise_mb;
//             if(rsbm.length==1){rsbm="0"+rsbm;}
//             rise_blue.value=rsbh+":"+rsbm;
//
// //--------rise_green--------------
//             rsgh=""+rx.rise_hg;
//             if(rsgh.length==1){rsgh="0"+rsgh;}
//
//             rsgm=""+rx.rise_mg;
//             if(rsgm.length==1){rsgm="0"+rsgm;}
//             rise_green.value=rsgh+":"+rsgm;
//
//
// //--------rise_red--------------
//             rsrh=""+rx.rise_hr;
//             if(rsrh.length==1){rsrh="0"+rsrh;}
//
//             rsrm=""+rx.rise_mr;
//             if(rsrm.length==1){rsrm="0"+rsrm;}
//             rise_red.value=rsrh+":"+rsrm;
//
//
// //--------dawn_white--------------
//             dwh=""+rx.dawn_hw;
//             if(dwh.length==1){dwh="0"+dwh;}
//
//             dwm=""+rx.dawn_mw;
//             if(dwm.length==1){dwm="0"+dwm;}
//             dawn_white.value=dwh+":"+dwm;
//
//
// //--------dawn_blue--------------
//             dbh=""+rx.dawn_hb;
//             if(dbh.length==1){dbh="0"+dbh;}
//
//             dbm=""+rx.dawn_mb;
//             if(dbm.length==1){dbm="0"+dbm;}
//             dawn_blue.value=dwh+":"+dbm;
//
// //--------dawn_green--------------
//             dgh=""+rx.dawn_hg;
//             if(dgh.length==1){dgh="0"+dgh;}
//
//             dgm=""+rx.dawn_mg;
//             if(dgm.length==1){dgm="0"+dgm;}
//             dawn_green.value=dgh+":"+dgm;
//
//
// //--------dawn_red--------------
//             drh=""+rx.dawn_hr;
//             if(drh.length==1){drh="0"+drh;}
//
//             drm=""+rx.dawn_mr;
//             if(drm.length==1){drm="0"+drm;}
//             dawn_red.value=drh+":"+drm;
//
// //--------stop_white--------------
//             spwh=""+rx.stop_hw;
//             if(spwh.length==1){spwh="0"+spwh;}
//
//             spwm=""+rx.stop_mw;
//             if(spwm.length==1){spwm="0"+spwm;}
//             stop_white.value=spwh+":"+spwm;
//
// //--------stop_blue--------------
//             spbh=""+rx.stop_hb;
//             if(spbh.length==1){spbh="0"+spbh;}
//
//             spbm=""+rx.stop_mb;
//             if(spbm.length==1){spbm="0"+spbm;}
//             stop_blue.value=spbh+":"+spbm;
//
// //--------stop_green--------------
//             spgh=""+rx.stop_hg;
//             if(spgh.length==1){spgh="0"+spgh;}
//
//             spgm=""+rx.stop_mg;
//             if(spgm.length==1){spgm="0"+spgm;}
//             stop_green.value=spgh+":"+spgm;
//
// //--------stop_red--------------
//             sprh=""+rx.stop_hr;
//             if(sprh.length==1){sprh="0"+sprh;}
//
//             sprm=""+rx.stop_mr;
//             if(sprm.length==1){sprm="0"+sprm;}
//             stop_red.value=sprh+":"+sprm;
//
//
// //------------max bright white-----
//
//             bright_white.value=""+rx.maxb_white;
//
//
// //------------ max bright blue-----
//
//             bright_blue.value=""+rx.maxb_blue;
//
// //------------max bright green-----
//
//             bright_green.value=""+rx.maxb_green;
//
//
// //------------ max bright red-----
//
//             bright_red.value=""+rx.maxb_red;
//
// //------------min bright white-----
//
//             min_white.value=""+rx.minb_white;
//
//
// //------------ min bright blue-----
//
//             min_blue.value=""+rx.minb_blue;
//
// //------------min bright green-----
//
//             min_green.value=""+rx.minb_green;
//
//
// //------------ min bright red-----
//
//             min_red.value=""+rx.minb_red;
//
//
//
//
//
// // white now
//             brwh.value=Math.round(rx.bright_wh/10.24);
// // blue now
//             brbl.value=Math.round(rx.bright_bl/10.24);
// // green now
//             brgr.value=Math.round(rx.bright_gr/10.24);
// // red now
//             brrd.value=Math.round(rx.bright_rd/10.24);
//
//
//
//         }
//     }
//
//     xhttp.open("GET", "/all", true);
//     xhttp.send();
// }








