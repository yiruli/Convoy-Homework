

(function(){

"use strict";

window.onload = function(){

  menu();

};


function menu(){
    var menu = document.getElementById("menu");

    var item = ["Pickup Date", "Drop off Date", "Price", "Origin", "Destination", "Miles"];
    
    for(var i = 0; i<item.length; i++){
      
        var a = document.createElement("a");
        a.className = "dropdown-item";
        a.id = i;
        a.innerHTML = item[i];
        a.onclick = loadDoc;
        menu.appendChild(a);
    }

}


function loadDoc() {
  var item = ["Pickup Date", "Drop off Date", "Price", "Origin", "Destination", "Miles"];
  var query = ["pickupDate", "dropoffDate", "price", "origin", "destination", "miles"];

  var sortby = query[this.id];
  var sel = document.getElementById("select");
  sel.innerHTML = item[this.id];
  //alert(sortby);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      todo(this, sortby);
      
      var load = document.getElementById("loading");
      if (load.style.display != "none") {
        load.style.display = "none";
      } 

    }else{
      toggleLoadingMessage();
    }
  };
  xhttp.open("GET", "https://convoy-mock-api.herokuapp.com/offers?limit=3&sort="+sortby, true);
  xhttp.send();
}



function more_loadDoc() {
  var sortby=this.title;
  //alert("this.title: "+this.title);
  //alert("sortby: "+sortby);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      todo(this, sortby);
      
      var load = document.getElementById("loading");
      if (load.style.display != "none") {
        load.style.display = "none";
      } 

    }else{
      toggleLoadingMessage();
    }
  };
  xhttp.open("GET", "https://convoy-mock-api.herokuapp.com/offers?sort="+sortby, true);
  xhttp.send();
}



function toggleLoadingMessage() {
  var load = document.getElementById("loading");
  if (load.style.display === "none") {
    load.style.display = "block";
  } else {
    load.style.display = "none";
  }
}


function todo(xhttp, sortby){
    
    var show = document.getElementById("show");    
        //e.firstElementChild can be used. 
    var child = show.lastElementChild;  
    while (child) { 
        show.removeChild(child); 
        child = show.lastElementChild; 
    } 
    

    //data
    var data = JSON.parse(xhttp.responseText);




    //each offer's container
    var container = document.createElement("div");
    container.className = "container-fluid";

    for(var i = 0; i<data.length; i++){

        //each offer -- part 1: button requested
        var row_but = document.createElement("div");
        row_but.className = "row";

        var col_but = document.createElement("div");
        col_but.className = "col-sm-12";

        var mark = document.createElement("button");
        mark.innerHTML = "REQUESTED"
        mark.className = "request";
        mark.style.visibility = 'hidden';
        mark.style.marginBottom = "0px";
        mark.style.marginTop = "10px";
        mark.id = "button"+i;

        col_but.appendChild(mark);
        row_but.appendChild(col_but);

        //each offer -- part 2: details
        //row
        var row_detail = document.createElement("div");
        row_detail.className = "row showitem";
        row_detail.onclick = requested;
        row_detail.data = {       
          id_num: i     
        }
        //col_6
        var col_detail_6 = document.createElement("div");
        col_detail_6.className = "col-sm-6";

        //detail-line
        var line = document.createElement("div");
        line.className = "line";

        //detail-origin
        var start = document.createElement("span");
        start.className = "dot start";

        var location_o = document.createElement("div");
        location_o.className = "location";
        location_o.innerHTML = data[i].origin.city +", "+data[i].origin.state;

        var time_o = document.createElement("div");
        time_o.className = "time"
        time_o.innerHTML = getTime(data[i].origin.pickup.start, data[i].origin.pickup.end);
    
        //detail-destination
        var end = document.createElement("span");
        end.className = "dot end";

        var location_e = document.createElement("div");
        location_e.className = "location";
        location_e.innerHTML = data[i].destination.city +", "+data[i].destination.state;

        var time_e = document.createElement("div");
        time_e.className = "time";
        time_e.innerHTML = getTime(data[i].destination.dropoff.start, data[i].destination.dropoff.end);  


        col_detail_6.appendChild(line);
        col_detail_6.appendChild(start);
        col_detail_6.appendChild(location_o);
        col_detail_6.appendChild(time_o);
        col_detail_6.appendChild(end);
        col_detail_6.appendChild(location_e);
        col_detail_6.appendChild(time_e);

        //size
        //col_2
        var col_size_2 = document.createElement("div");
        col_size_2.className = "col-sm-2";
        

        var size = document.createElement("div");
        size.className = "size";
        size.innerHTML="53' Reefer";

        col_size_2.appendChild(size);

        //mile
        var col_mile_2 = document.createElement("div");
        col_mile_2.className = "col-sm-2";

        var mile = document.createElement("div");
        mile.className = "mile";
        var mile_num = data[i].miles;
        mile.innerHTML = mile_num.toLocaleString() + " miles";

        col_mile_2.appendChild(mile);

        //price
        var col_price_2 = document.createElement("div");
        col_price_2.className = "col-sm-2";

        var price = document.createElement("div");
        price.className = "price";
        var price_num = data[i].offer;
        price.innerHTML = "$" + price_num.toLocaleString();

        col_price_2.appendChild(price);


        row_detail.appendChild(col_detail_6);
        row_detail.appendChild(col_size_2);
        row_detail.appendChild(col_mile_2);
        row_detail.appendChild(col_price_2);

        container.appendChild(row_but);
        container.appendChild(row_detail);

    }


    var more = document.createElement("button");
    more.innerHTML = "Show More";
    more.title=sortby;
    more.onclick = more_loadDoc;
    more.className = "more";

    var showbox = document.createElement("div");
    showbox.className = "showbox";

    showbox.appendChild(container);

    show.appendChild(showbox);
    show.appendChild(more);
}

function requested(){
    //alert("clicked");
    //alert("button"+this.data.id_num);
    if(this.title!="clicked"){
        var mark = document.getElementById("button"+this.data.id_num);
        mark.style.visibility = "visible";
        mark.style.marginBottom = "10px";
        mark.style.marginTop = "17px";
        this.title = "clicked";
    }
}


function sameDay(d_start, d_end) {
    var d1 = new Date(d_start);
    var d2 = new Date(d_end);
    
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
      d1.getUTCMonth() === d2.getUTCMonth() &&
      d1.getUTCDate() === d2.getUTCDate();
}


function getTime(d_start, d_end){

    var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

    var d1 = new Date(d_start);
    var d2 = new Date(d_end);

    var day1 = weekday[d1.getUTCDay()];
    var month1 = d1.getUTCMonth();
    var date1 = d1.getUTCDate();

    var day2 = weekday[d2.getUTCDay()];
    var month2 = d2.getUTCMonth();
    var date2 = d2.getUTCDate();

    var startHour = d_start.substr(d_start.indexOf("T")+1, 5);
    var endtHour = d_end.substr(d_end.indexOf("T")+1, 5);

    if(sameDay(d_start, d_end)){
        return day1 + " " + month1 + "/" + date1 + " " + startHour + " - " + endtHour;
    } else {
        return day1 + " " + month1 + "/" + date1 + " " + startHour + " - " + day2 + " " + month2 + "/" + date2 + " " + endtHour;
    }

}


})();




