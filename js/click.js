// MIT License
// Copyright (c) 2020-2023 Paweł Kuna

var directionsService_dict = {}
var directionsDisplay_dict = {}
var Markers_dict = {}
var startinfoWindow_dict = {}
var infoWindows_dict = {}
var startinfoWindow_dict = {}

// 3色を設定
// var color = ["red", "blue", "green", "ltblue", "yellow", "purple", "pink", "orange", "black", "gray", "white", "brown"]
// var color = ["red", "blue", "green", "yellow", "purple", "orange", "black", "gray", "white", "brown"]
var color = ["red", "blue", "yellow", "purple", "orange", "black", "gray", "white", "brown"]
// var color_code = ["#FF0000", "#0000FF", "#008000", "#ADD8E6", "#800080", "#FFC0CB", "#FFA500", "#000000", "#FFFFFF", "#808080", "#A52A2A"]
// var color_code = ["#FF0000", "#0000FF", "#008000", "#FFFF00", "#800080", "#FFA500", "#000000", "#808080", "#FFFFFF", "#A52A2A"]
var color_code = ["#FF0000", "#0000FF", "#FFA500", "#800080", "#00FFFF", "#FFC0CB", "#A52A2A", "#808080", "#00FF00", "#8B008B"]
var WAY_POINT_COUNT = 3;
var delayFactor = 0;
var strokeWeight_max = 4;
var strokeWeight_min = 2;

function toSearch() {
  directionsService_dict = {}
  directionsDisplay_dict = {}
  startMarker_dict = {}
  Markers_dict = {}
  startinfoWindow_dict = {}
  infoWindows_dict = {}
  initialize()
  // テーブルの削除
  var tableHeaderRowCount = 1;
  var table = document.getElementById('table');
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount);
  }
  // Table.innerHTML = "";

  var location = document.getElementById(`location`).value;
  var start_text = document.getElementById(`start_text`).value;
  var end_text = document.getElementById(`end_text`).value;

  let starts = [];
  var start_options = document.getElementById("start_locs").options;
  for (var i = 0, l = start_options.length; l > i; i++) {
    if (start_options[i].selected) {
      console.log("出発値＝" + start_options[i].value)
      starts.push(start_options[i].value)
    }
  }
  // もし一つも選択されていない場合は、全て選択とする。
  if (starts.length == 0) {
    for (var i = 0, l = start_options.length; l > i; i++) {
      starts.push(start_options[i].value)
    }
  }


  let ends = [];
  var ends_options = document.getElementById("end_locs").options;
  for (var i = 0, l = ends_options.length; l > i; i++) {
    if (ends_options[i].selected) {
      console.log("目的地＝" + ends_options[i].value)
      ends.push(ends_options[i].value)
    }
  }
  // もし一つも選択されていない場合は、全て選択とする。
  if (ends.length == 0) {
    for (var i = 0, l = ends_options.length; l > i; i++) {
      ends.push(ends_options[i].value)
    }
  }

  let temps = [];
  // 温度帯の個数
  let n_temps = 3;
  // 温度帯の数だけ繰り返し
  for (let i = 1; i <= n_temps; i++) {
    if (document.getElementById(`temp${i}`).checked) {
      temps.push(document.getElementById(`temp${i}`).value)
    }
  }
  // もし一つも選択されていない場合は、全て選択とする。
  if (temps.length == 0) {
    for (let i = 1; i <= n_temps; i++) {
      temps.push(document.getElementById(`temp${i}`).value)
    }
  }


  // temps.push(document.getElementById("temp1").value, document.getElementById("temp2").value, document.getElementById("temp3").value);
  let times = [];
  let n_times = 4;
  // 時間帯の数だけ繰り返し
  for (let i = 1; i <= n_times; i++) {
    if (document.getElementById(`time${i}`).checked) {
      times.push(parseInt(document.getElementById(`time${i}`).value))
    }
  }
  // もし一つも選択されていない場合は、全て選択とする。
  if (times.length == 0) {
    for (let i = 1; i <= n_times; i++) {
      times.push(parseInt(document.getElementById(`time${i}`).value))
    }
  }

  let elements = document.getElementsByName('pay');
  let len = elements.length;
  let checkValue = '';

  for (let i = 0; i < len; i++) {
    if (elements.item(i).checked) {
      checkValue = elements.item(i).value;
    }
  }
  var pay_option = JSON.parse(checkValue.toLowerCase());

  // ルート最適化
  // elements = document.getElementsByName('optimize');
  // len = elements.length;
  // checkValue = '';
  // for (let i = 0; i < len; i++) {
  //   if (elements.item(i).checked) {
  //     checkValue = elements.item(i).value;
  //   }
  // }
  // var optimize_option = JSON.parse(checkValue.toLowerCase());
  optimize_option = false;

  // times.push(document.getElementById("time1").value, document.getElementById("time2").value, document.getElementById("time3").value);

  let route_locs = [];
  let flags_true = [];
  for (let i = 0; i < locations.length; i++) {
    if (!starts.includes(locations[i]["start_loc"]["pref"])) {
      continue;
    }
    var flg_pref = false;
    for (let way_id = 0; way_id < locations[i]["way_loc"].length; way_id++) {
      if (ends.includes(locations[i]["way_loc"][way_id]["pref"])) {
        flg_pref = true;
      }
    }
    if ((ends.includes(locations[i]["end_loc"]["pref"]))) {
      flg_pref = true;
    }
    if (!flg_pref) {
      continue;
    }
    // if (!ends.includes(locations[i]["end_loc"]["pref"])) {
    //   continue;
    // }
    if (!temps.includes(locations[i]["temp"])) {
      continue;
    }
    if (!times.includes(locations[i]["time"])) {
      continue;
    }
    // 曖昧検索の絞り込み
    var flg_about_search = false;
    for (let way_id = 0; way_id < locations[i]["way_loc"].length; way_id++) {
      if (locations[i]["way_loc"][way_id]["title"].match(location)) {
        flg_about_search = true;
      }
    }
    if ((locations[i]["start_loc"]["title"].match(location))) {
      flg_about_search = true;
    }
    if ((locations[i]["end_loc"]["title"].match(location))) {
      flg_about_search = true;
    }
    if (!flg_about_search) {
      continue;
    }
    // if (!(locations[i]["end_loc"]["title"].match(location) || locations[i]["start_loc"]["title"].match(location))) {
    //   continue;
    // }
    // 曖昧フィルタの絞り込み
    var flg_text = false;
    for (let way_id = 0; way_id < locations[i]["way_loc"].length; way_id++) {
      if (locations[i]["way_loc"][way_id]["title"].match(end_text)) {
        flg_text = true;
      }
    }
    if ((locations[i]["end_loc"]["title"].match(end_text))) {
      flg_text = true;
    }
    if (!flg_text) {
      continue;
    }

    if (!(locations[i]["start_loc"]["title"].match(start_text))) {
      continue;
    }
    flags_true.push(true)
    route_locs.push(locations[i])
  }

  let text = document.getElementById('result').textContent; //宣言
  if (flags_true.length > 0) {
    document.getElementById('result').textContent = flags_true.length + "件、見つかりました。";
  } else {
    document.getElementById('result').textContent = "見つかりませんでした。";
  }

  let start_titles = []
  for (let i = 0; i < route_locs.length; i++) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    // directionsDisplay.setMap(map);
    // directionsService_dict.push(directionsService)
    // directionsDisplay_dict.push(directionsDisplay)
    directionsDisplay.setMap(map)
    // directionsDisplay_dict[directionsDisplay_dict.length - 1].setMap(map)

    // スタート地点のマーカーの追加（存在しないときに追加・表示）
    start_index = start_titles.indexOf(route_locs[i]["start_loc"]["title"]);
    if (start_index == -1) {
      // マーカーの追加
      start_titles.push(route_locs[i]["start_loc"]["title"]);
      start_index = start_titles.length - 1
      const svgMarker = {
        path: "M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0 M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z",
        fillColor: color_code[start_index],
        fillOpacity: 1,
        strokeWeight: 0.5,
        rotation: 0,
        scale: 1,
        anchor: new google.maps.Point(0, 20),
      };
      const start_marker = new google.maps.Marker({
        position: route_locs[i]["start_loc"]["point"],
        map: map,
        title: route_locs[i]["start_loc"]["title"],
        optimized: false,
        // label:route_locs[i]["start_loc"]["title"][0],
        // 色の設定
        // icon: 'http://maps.google.com/mapfiles/ms/icons/' + color[start_titles.length - 1] + '-dot.png'
        // icon: 'https://labs.google.com/ridefinder/images/mm_20_' + color[start_titles.length - 1] + '.png'
        icon: svgMarker
      });
      const start_infoWindow = new google.maps.InfoWindow();
      start_infoWindow.setContent("出発地点<br>" + start_marker.getTitle());
      start_marker.addListener("click", () => {
        start_infoWindow.close();
        start_infoWindow.open(start_marker.getMap(), start_marker);
      });
      startMarker_dict[start_index] = start_marker;
      startinfoWindow_dict[start_index] = start_infoWindow;
    }
    // calculateAndDisplayRoute(directionsService_dict[directionsService_dict.length - 1], directionsDisplay_dict[directionsDisplay_dict.length - 1], start, end, way);
    calculateAndDisplayRoute(directionsService, directionsDisplay, route_locs[i], i, start_index, pay_option, optimize_option);
    appendTable(route_locs[i], i, color_code[start_index]);

    markers = [];
    infoWindows = [];
    markers.push(startMarker_dict[start_index]);
    infoWindows.push(startinfoWindow_dict[start_index]);
    const svgMarker = {
      path: "M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z",
      fillColor: color_code[start_index],
      fillOpacity: 1,
      strokeWeight: 0.5,
      rotation: 0,
      scale: 1,
      anchor: new google.maps.Point(0, 20),
    };

    const marker = new google.maps.Marker({
      position: route_locs[i]["end_loc"]["point"],
      map: map,
      title: route_locs[i]["end_loc"]["title"],
      optimized: false,
      // icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      // icon: 'https://labs.google.com/ridefinder/images/mm_20_' + color[start_titles.length - 1] + '.png'
      icon: svgMarker
    });
    // Add a click listener for each marker, and set up the info window.
    const end_infoWindow = new google.maps.InfoWindow();
    end_infoWindow.setContent("ルート" + (i + 1) + "：納品先<br>" + marker.getTitle() + "<br>" + "温度帯：" + route_locs[i]["temp"] + "<br>時間：" + route_locs[i]["time"] + "時");
    marker.addListener("click", () => {
      end_infoWindow.close();
      end_infoWindow.open(marker.getMap(), marker);
    });
    markers.push(marker);
    infoWindows.push(end_infoWindow);

    // 経由地点のマーカー
    var svg_paths = ["M12 2l.642 .005l.616 .017l.299 .013l.579 .034l.553 .046c4.687 .455 6.65 2.333 7.166 6.906l.03 .29l.046 .553l.041 .727l.006 .15l.017 .617l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.455 4.687 -2.333 6.65 -6.906 7.166l-.29 .03l-.553 .046l-.727 .041l-.15 .006l-.617 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.687 -.455 -6.65 -2.333 -7.166 -6.906l-.03 -.29l-.046 -.553l-.041 -.727l-.006 -.15l-.017 -.617l-.004 -.318v-.648l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.455 -4.687 2.333 -6.65 6.906 -7.166l.29 -.03l.553 -.046l.727 -.041l.15 -.006l.617 -.017c.21 -.003 .424 -.005 .642 -.005zm.994 5.886c-.083 -.777 -1.008 -1.16 -1.617 -.67l-.084 .077l-2 2l-.083 .094a1 1 0 0 0 0 1.226l.083 .094l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l.293 -.293v5.586l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-8l-.006 -.114z",
      "M12 2l.642 .005l.616 .017l.299 .013l.579 .034l.553 .046c4.687 .455 6.65 2.333 7.166 6.906l.03 .29l.046 .553l.041 .727l.006 .15l.017 .617l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.455 4.687 -2.333 6.65 -6.906 7.166l-.29 .03l-.553 .046l-.727 .041l-.15 .006l-.617 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.687 -.455 -6.65 -2.333 -7.166 -6.906l-.03 -.29l-.046 -.553l-.041 -.727l-.006 -.15l-.017 -.617l-.004 -.318v-.648l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.455 -4.687 2.333 -6.65 6.906 -7.166l.29 -.03l.553 -.046l.727 -.041l.15 -.006l.617 -.017c.21 -.003 .424 -.005 .642 -.005zm1 5h-3l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h3v2h-2l-.15 .005a2 2 0 0 0 -1.844 1.838l-.006 .157v2l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h3l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007h-3v-2h2l.15 -.005a2 2 0 0 0 1.844 -1.838l.006 -.157v-2l-.005 -.15a2 2 0 0 0 -1.838 -1.844l-.157 -.006z",
      "M12 2l.642 .005l.616 .017l.299 .013l.579 .034l.553 .046c4.687 .455 6.65 2.333 7.166 6.906l.03 .29l.046 .553l.041 .727l.006 .15l.017 .617l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.455 4.687 -2.333 6.65 -6.906 7.166l-.29 .03l-.553 .046l-.727 .041l-.15 .006l-.617 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.687 -.455 -6.65 -2.333 -7.166 -6.906l-.03 -.29l-.046 -.553l-.041 -.727l-.006 -.15l-.017 -.617l-.004 -.318v-.648l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.455 -4.687 2.333 -6.65 6.906 -7.166l.29 -.03l.553 -.046l.727 -.041l.15 -.006l.617 -.017c.21 -.003 .424 -.005 .642 -.005zm1 5h-2l-.15 .005a2 2 0 0 0 -1.85 1.995a1 1 0 0 0 1.974 .23l.02 -.113l.006 -.117h2v2h-2l-.133 .007c-1.111 .12 -1.154 1.73 -.128 1.965l.128 .021l.133 .007h2v2h-2l-.007 -.117a1 1 0 0 0 -1.993 .117a2 2 0 0 0 1.85 1.995l.15 .005h2l.15 -.005a2 2 0 0 0 1.844 -1.838l.006 -.157v-2l-.005 -.15a1.988 1.988 0 0 0 -.17 -.667l-.075 -.152l-.019 -.032l.02 -.03a2.01 2.01 0 0 0 .242 -.795l.007 -.174v-2l-.005 -.15a2 2 0 0 0 -1.838 -1.844l-.157 -.006z"]
    for (let way_id = 0; way_id < route_locs[i]["way_loc"].length; way_id++) {
      const svgMarker = {
        path: svg_paths[way_id],
        fillColor: color_code[start_index],
        fillOpacity: 1,
        strokeWeight: 0.5,
        rotation: 0,
        scale: 1,
        anchor: new google.maps.Point(0, 20),
      };
      const marker = new google.maps.Marker({
        position: route_locs[i]["way_loc"][way_id]["point"],
        map: map,
        title: route_locs[i]["way_loc"][way_id]["title"],
        optimized: false,
        // icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
        // icon: 'https://labs.google.com/ridefinder/images/mm_20_' + color[start_titles.length - 1] + '.png'
        icon: svgMarker
      });
      const way_infoWindow = new google.maps.InfoWindow();
      way_infoWindow.setContent("ルート" + (i + 1) + "：経由地" + (way_id + 1) + "<br>" + marker.getTitle() + "<br>" + "温度帯：" + route_locs[i]["temp"] + "<br>時間：" + route_locs[i]["time"] + "時");
      marker.addListener("click", () => {
        way_infoWindow.close();
        way_infoWindow.open(marker.getMap(), marker);
      });
      markers.push(marker);
      infoWindows.push(way_infoWindow);
    }
    Markers_dict[i] = markers;
    infoWindows_dict[i] = infoWindows;
  }
}

function callback(response) {
  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;

  for (var i = 0; i < origins.length; i++) {
    var results = response.rows[i].elements;
    for (var j = 0; j < results.length; j++) {
      var element = results[j];
      var distance = element.distance.text;
      var duration = element.duration.text;
      var from = origins[i];
      var to = destinations[j];
      return distance, duration;
    }
  }
}


function calculateAndDisplayRoute(directionsService, directionsDisplay, route_loc, i, count, pay_option, optimize_option) {
  way = [];
  for (let way_id = 0; way_id < route_loc["way_loc"].length; way_id++) {
    way.push({ location: route_loc["way_loc"][way_id]["point"] });
  }
  // ラインのオプション設定
  directionsDisplay.setOptions({
    suppressMarkers: true,
    suppressPolylines: false,
    suppressInfoWindows: false,
    draggable: true,
    preserveViewport: false,
    polylineOptions: { strokeColor: color_code[count], strokeWeight: strokeWeight_min },
  });
  var request = {
    origin: route_loc["start_loc"]["point"],
    destination: route_loc["end_loc"]["point"],
    waypoints: way,
    optimizeWaypoints: optimize_option,
    travelMode: 'DRIVING',
    avoidTolls: pay_option,
    avoidHighways: pay_option
  };
  delayFactor = 0
  m_get_directions_route(directionsService, directionsDisplay, request, i);
}


function m_get_directions_route(directionsService, directionsDisplay, request, i) {
  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay_dict[i] = directionsDisplay;
      directionsService_dict[i] = directionsService;
      // response.routes[0].waypoint_order;
    } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
      delayFactor++;
      setTimeout(function () {
        m_get_directions_route(directionsService, directionsDisplay, request, i);
      }, delayFactor * 1000);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}


function isEmpty(obj) {
  for (let ob in obj) {
    return false;
  }
  return true;
}


function checkRoute(i) {
  // directionsDisplay_dict[0].setMap(null);
  // ラインのオプション設定
  let checkbox = document.getElementById('route' + i);
  var request_route = directionsDisplay_dict[i].directions.request;
  markers = Markers_dict[i];
  infoWindows = infoWindows_dict[i];
  // マーカーの初期化
  for (let marker of markers) {
    marker.setMap(null);
  }

  if (checkbox.checked) {
    directionsDisplay_dict[i].setOptions({
      suppressMarkers: true,
      suppressPolylines: false,
      suppressInfoWindows: false,
      draggable: true,
      preserveViewport: false,
      polylineOptions: { strokeColor: directionsDisplay_dict[i].polylineOptions.strokeColor, strokeWeight: strokeWeight_max },
    });
    var request = {
      origin: request_route.origin,
      destination: request_route.destination,
      waypoints: request_route.waypoints,
      optimizeWaypoints: request_route.optimizeWaypoints,
      travelMode: request_route.travelMode,
      avoidTolls: request_route.avoidTolls,
      avoidHighways: request_route.avoidHighways
    };
    delayFactor = 0

    for (let marker_i = 0; marker_i < markers.length; marker_i++) {
      markers[marker_i].icon.strokeWeight = 1.5;
      markers[marker_i].setMap(map);
      infoWindows[marker_i].open(markers[marker_i].getMap(), markers[marker_i]);
    }
    m_get_directions_route(directionsService_dict[i], directionsDisplay_dict[i], request, i);
  }
  else {
    directionsDisplay_dict[i].setOptions({
      suppressMarkers: true,
      suppressPolylines: false,
      suppressInfoWindows: false,
      draggable: true,
      preserveViewport: false,
      polylineOptions: { strokeColor: directionsDisplay_dict[i].polylineOptions.strokeColor, strokeWeight: strokeWeight_min },
    });
    var request = {
      origin: request_route.origin,
      destination: request_route.destination,
      waypoints: request_route.waypoints,
      optimizeWaypoints: request_route.optimizeWaypoints,
      travelMode: request_route.travelMode,
      avoidTolls: request_route.avoidTolls,
      avoidHighways: request_route.avoidHighways
    };
    delayFactor = 0

    for (let marker_i = 0; marker_i < markers.length; marker_i++) {
      markers[marker_i].icon.strokeWeight = 0.5;
      markers[marker_i].setMap(map);
      infoWindows[marker_i].close();
    }
    m_get_directions_route(directionsService_dict[i], directionsDisplay_dict[i], request, i);
  }
}

function appendTable(route_loc, i, route_color) {
  // テーブルの作成
  var tableBody = document.getElementById("myTableBody");
  var row = document.createElement("tr");
  row.setAttribute("class", "item");
  var cell = document.createElement("td");
  var input = document.createElement("input");
  cell.setAttribute("style", "width:3px")
  input.setAttribute("type", "checkbox");
  input.setAttribute("onchange", "checkRoute(" + i + ")");
  input.setAttribute("id", "route" + i);
  cell.appendChild(input);
  row.appendChild(cell);

  var cell = document.createElement("td");
  var cellText = document.createTextNode("ルート：" + ('000' + (i + 1)).slice(-3));
  cell.appendChild(cellText);
  cell.style.color = route_color;
  // cell.appendChild(input);
  // var form = document.createElement("form");
  // cell.appendChild(form);
  row.appendChild(cell);
  var cell = document.createElement("td");
  var cellText = document.createTextNode(route_loc["start_loc"]["title"] + "（" + route_loc["start_loc"]["pref"] + "）");
  cell.appendChild(cellText);
  row.appendChild(cell);
  for (way_id = 0; way_id < route_loc["way_loc"].length; way_id++) {
    // 同期処理のため、実行速度的に速く回る
    // for (way_id = 0; way_id < waypoint_order.length; way_id++) {
    var cell = document.createElement("td");
    var cellText = document.createTextNode(route_loc["way_loc"][way_id]["title"] + "（" + route_loc["way_loc"][way_id]["pref"] + "）");
    // var cellText = document.createTextNode(route_loc["way_loc"][waypoint_order[way_id]]["title"] + "（" + route_loc["way_loc"][waypoint_order[way_id]]["pref"] + "）");
    cell.appendChild(cellText);
    row.appendChild(cell);
  }
  for (way_id = 0; way_id < WAY_POINT_COUNT - route_loc["way_loc"].length; way_id++) {
    // for (way_id = 0; way_id < WAY_POINT_COUNT - waypoint_order.length; way_id++) {
    var cell = document.createElement("td");
    var cellText = document.createTextNode("なし");
    cell.appendChild(cellText);
    row.appendChild(cell);
  }
  var cell = document.createElement("td");
  var cellText = document.createTextNode(route_loc["end_loc"]["title"] + "（" + route_loc["end_loc"]["pref"] + "）");
  cell.appendChild(cellText);
  row.appendChild(cell);
  var cell = document.createElement("td");
  var cellText = document.createTextNode(route_loc["time"] + "時");
  cell.appendChild(cellText);
  row.appendChild(cell);
  tableBody.appendChild(row);
  // //////////////////////////////////////////////////////////////////////////
}