var directionsService_array = []
var directionsDisplay_array = []
// 3色を設定
var color = ["red", "green", "blue"]
var color_code = ["#FF0000", "#00FF00", "#0000FF"]
var WAY_POINT_COUNT = 3;
var delayFactor = 0;
function toSearch() {
  directionsService_array = []
  directionsDisplay_array = []
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


  // 出発地点の県の数だけ繰り返し
  // for (let i = 1; i <= n_starts; i++) {
  //   if (document.getElementById(`start${i}`).checked) {
  //     starts.push(document.getElementById(`start${i}`).value)
  //   }
  // }


  // starts.push(document.getElementById("start1").value, document.getElementById("start2").value);
  // let ends = [];
  // let n_ends = 6;
  // // 輸送先の県の数だけ繰り返し
  // for (let i = 1; i <= n_ends; i++) {
  //   if (document.getElementById(`end${i}`).checked) {
  //     ends.push(document.getElementById(`end${i}`).value)
  //   }
  // }
  // // もし一つも選択されていない場合は、全て選択とする。
  // if (ends.length == 0) {
  //   for (let i = 1; i <= n_ends; i++) {
  //     ends.push(document.getElementById(`end${i}`).value)
  //   }
  // }

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
  elements = document.getElementsByName('optimize');
  len = elements.length;
  checkValue = '';
  for (let i = 0; i < len; i++) {
    if (elements.item(i).checked) {
      checkValue = elements.item(i).value;
    }
  }
  var optimize_option = JSON.parse(checkValue.toLowerCase());
  // times.push(document.getElementById("time1").value, document.getElementById("time2").value, document.getElementById("time3").value);

  let flags = [];
  let flags_true = [];
  for (let i = 0; i < locations.length; i++) {
    if (!starts.includes(locations[i]["start_loc"]["pref"])) {
      flags.push(false)
      continue;
    }
    if (!ends.includes(locations[i]["end_loc"]["pref"])) {
      flags.push(false)
      continue;
    }
    if (!temps.includes(locations[i]["temp"])) {
      flags.push(false)
      continue;
    }
    if (!times.includes(locations[i]["time"])) {
      flags.push(false)
      continue;
    }
    if (!(locations[i]["end_loc"]["title"].match(location) || locations[i]["start_loc"]["title"].match(location))) {
      flags.push(false)
      continue;
    }
    flags_true.push(true)
    flags.push(true)
  }

  let text = document.getElementById('result').textContent; //宣言
  if (flags_true.length > 0) {
    document.getElementById('result').textContent = flags_true.length + "件、見つかりました。";
  } else {
    document.getElementById('result').textContent = "見つかりませんでした。";
  }


  Marker_array = []
  InfoWindow_array = []
  let start_titles = []
  for (let i = 0; i < locations.length; i++) {
    if (flags[i]) {

      // テーブルの作成
      var tableBody = document.getElementById("myTableBody");
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      
      var cellText = document.createTextNode("ルート：" + (i + 1));
      cell.appendChild(cellText);
      // var form = document.createElement("form");
      var input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("onchange", "clearRoute("+i+")");
      // input.setAttribute("onchange", "clearRoute()");
      cell.appendChild(input);
      // cell.appendChild(form);
      row.appendChild(cell);
      var cell = document.createElement("td");
      var cellText = document.createTextNode(locations[i]["start_loc"]["title"] + "（" + locations[i]["start_loc"]["pref"] + "）");
      cell.appendChild(cellText);
      row.appendChild(cell);
      for (way_id = 0; way_id < locations[i]["way_loc"].length; way_id++) {
        // 同期処理のため、実行速度的に速く回る
        // for (way_id = 0; way_id < waypoint_order.length; way_id++) {
        var cell = document.createElement("td");
        var cellText = document.createTextNode(locations[i]["way_loc"][way_id]["title"] + "（" + locations[i]["way_loc"][way_id]["pref"] + "）");
        // var cellText = document.createTextNode(locations[i]["way_loc"][waypoint_order[way_id]]["title"] + "（" + locations[i]["way_loc"][waypoint_order[way_id]]["pref"] + "）");
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      for (way_id = 0; way_id < WAY_POINT_COUNT - locations[i]["way_loc"].length; way_id++) {
        // for (way_id = 0; way_id < WAY_POINT_COUNT - waypoint_order.length; way_id++) {
        var cell = document.createElement("td");
        var cellText = document.createTextNode("なし");
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      var cell = document.createElement("td");
      var cellText = document.createTextNode(locations[i]["end_loc"]["title"] + "（" + locations[i]["end_loc"]["pref"] + "）");
      cell.appendChild(cellText);
      row.appendChild(cell);
      var cell = document.createElement("td");
      var cellText = document.createTextNode(locations[i]["time"] + "時");
      cell.appendChild(cellText);
      row.appendChild(cell);
      tableBody.appendChild(row);
      // //////////////////////////////////////////////////////////////////////////
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      // directionsDisplay.setMap(map);
      // directionsService_array.push(directionsService)
      // directionsDisplay_array.push(directionsDisplay)
      directionsDisplay.setMap(map)
      // directionsDisplay_array[directionsDisplay_array.length - 1].setMap(map)
      // 各地点を追加
      // var start = locations[i]["start_loc"]["title"];
      var start = locations[i]["start_loc"]["point"];
      // var end = locations[i]["end_loc"]["title"];
      var end = locations[i]["end_loc"]["point"];

      way = [];
      for (let way_id = 0; way_id < locations[i]["way_loc"].length; way_id++) {
        way.push({ location: locations[i]["way_loc"][way_id]["point"] });
      }
      // var way = locations[i]["way"];
      // [{ location: locations[i]["way_point1"] },
      // { location: locations[i]["way_point2"] },
      // { location: locations[i]["way_point3"] }];

      // スタート地点のマーカーの追加（存在しないときに追加・表示）
      if (!start_titles.includes(locations[i]["start_loc"]["title"])) {
        // マーカーの追加
        start_titles.push(locations[i]["start_loc"]["title"]);
        const start_marker = new google.maps.Marker({
          position: locations[i]["start_loc"]["point"],
          map: map,
          title: locations[i]["start_loc"]["title"],
          optimized: false,
          // 色の設定
          icon: 'http://maps.google.com/mapfiles/ms/icons/' + color[start_titles.length - 1] + '-dot.png'
        });
        start_marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent("ルート" + (i + 1) + "：出発地点<br>" + start_marker.getTitle());
          infoWindow.open(start_marker.getMap(), start_marker);
        });
      }
      // calculateAndDisplayRoute(directionsService_array[directionsService_array.length - 1], directionsDisplay_array[directionsDisplay_array.length - 1], start, end, way);
      calculateAndDisplayRoute(directionsService, directionsDisplay, start, end, way, start_titles.length, pay_option, optimize_option);


      const infoWindow = new google.maps.InfoWindow();
      const marker = new google.maps.Marker({
        position: locations[i]["end_loc"]["point"],
        map: map,
        title: locations[i]["end_loc"]["title"],
        optimized: false,
        icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      });

      // Add a click listener for each marker, and set up the info window.
      marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent("ルート" + (i + 1) + "：納品先<br>" + marker.getTitle() + "<br>" + "温度帯：" + locations[i]["temp"] + "<br>時間：" + locations[i]["time"] + "時");
        infoWindow.open(marker.getMap(), marker);
      });


      // 経由地点のマーカー
      for (let way_id = 0; way_id < locations[i]["way_loc"].length; way_id++) {
        const marker = new google.maps.Marker({
          position: locations[i]["way_loc"][way_id]["point"],
          map: map,
          title: locations[i]["way_loc"][way_id]["title"],
          optimized: false,
          icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
        });
        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent("ルート" + (i + 1) + "：経由地" + (way_id + 1) + "<br>" + marker.getTitle() + "<br>" + "温度帯：" + locations[i]["temp"] + "<br>時間：" + locations[i]["time"] + "時");
          infoWindow.open(marker.getMap(), marker);
        });
      }

      // //////////////////////////////////////////////////////////////////////////
      const service = new google.maps.DistanceMatrixService();
      // build request
      const origin1 = locations[i]["end_loc"]["point"];
      const origin2 = locations[i]["end_loc"]["title"];
      const destinationA = locations[i]["start_loc"]["title"];
      const destinationB = locations[i]["start_loc"]["title"];
      const request = {
        origins: [origin1],
        destinations: [destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };
      let distance, duration, result;
      service.getDistanceMatrix(request).then((response) => {
        // put response
        result = response.rows[0].elements[0];
        distance = result.distance.text;
        duration = result.duration.text;
        // document.getElementById("distance" + i).innerText = distance;
        // document.getElementById("duration" + i).innerText = duration;
        // document.getElementById("responce").innerText = JSON.stringify(
        //   response,
        //   null,
        //   2
        // );
      });
    }
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


function calculateAndDisplayRoute(directionsService, directionsDisplay, start, end, way, count, pay_option, optimize_option) {
  // ラインのオプション設定
  directionsDisplay.setOptions({
    suppressMarkers: true,
    suppressPolylines: false,
    suppressInfoWindows: false,
    draggable: true,
    preserveViewport: false,
    polylineOptions: { strokeColor: color_code[count - 1] },
  });
  var request = {
    origin: start,
    destination: end,
    waypoints: way,
    optimizeWaypoints: optimize_option,
    travelMode: 'DRIVING',
    avoidTolls: pay_option,
    avoidHighways: pay_option
  };
  delayFactor = 0
  m_get_directions_route(directionsService, directionsDisplay, request);
}
function m_get_directions_route(directionsService, directionsDisplay, request) {
  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay_array.push(directionsDisplay);
      directionsService_array.push(directionsService);
      // response.routes[0].waypoint_order;
    } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
      delayFactor++;
      setTimeout(function () {
        m_get_directions_route(directionsService, directionsDisplay, request);
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


function clearRoute(i) {
  // directionsDisplay_array[0].setMap(null);
    // ラインのオプション設定
    directionsDisplay_array[0].setOptions({
      suppressMarkers: true,
      suppressPolylines: false,
      suppressInfoWindows: false,
      draggable: true,
      preserveViewport: false,
      // polylineOptions: { strokeColor: color_code[count - 1] },
    });
    var request = {
      origin: "東京駅",
      destination: "名古屋駅",
      // waypoints: way,
      // optimizeWaypoints: optimize_option,
      travelMode: 'DRIVING',
      // avoidTolls: pay_option,
      // avoidHighways: pay_option
    };
    delayFactor = 0
    m_get_directions_route(directionsService_array[0], directionsDisplay_array[0], request);
}