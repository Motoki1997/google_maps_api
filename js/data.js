
var locations = [
    {
        start_loc: { pref: "神奈川県", title: "厚木XDセンター", point: { lat: 35.4206969, lng: 139.3575007 } },
        end_loc: { pref: "東京都", title: "オリンピック昭島", point: { lat: 35.7204062, lng: 139.3776546 } },
        way_loc: [  { pref: "埼玉県", title: "三越伊勢丹フードサービス", point: { lat: 35.8224575, lng: 139.474855 } },
                { pref: "東京都", title: "新宿ベジフル", point: { lat: 35.7056593, lng: 139.6914469 } },
                { pref: "神奈川県", title: "ライフ川崎物流センター", point: { lat: 35.5175856, lng: 139.7398085 } }
        ], 
        temp: "冷蔵", time: 10
    },
    {
        start_loc: { pref: "神奈川県", title: "厚木XDセンター", point: { lat: 35.4206969, lng: 139.3575007 } },
        end_loc: { pref: "神奈川県", title: "三菱食品", point: { lat: 35.3829628, lng: 139.6275597 } },
        way_loc: [  { pref: "埼玉県", title: "三越伊勢丹フードサービス", point: { lat: 35.8224575, lng: 139.474855 } },
        ], 
        temp: "冷蔵", time: 10
    },
    {
        start_loc: { pref: "埼玉県", title: "羽生ALC", point: { lat: 36.1701774, lng: 139.6003859 } },
        end_loc: { pref: "青森県", title: "ユニバース八戸", point: { lat: 40.514429, lng: 141.4544112 } },
        way_loc: [], 
        temp: "冷蔵", time: 10
    },
    // { start_pref: "神奈川県", start_title: "厚木XDセンター", start_point: { lat: 35.4206969, lng: 139.3575007 }, end_pref: "神奈川県", end_title: "三菱食品", end_point: { lat: 35.3829628, lng: 139.6275597 }, way: [{ lat: 35.8224575, lng: 139.474855 }], temp: "冷蔵", time: 10 },
    // { start_pref: "神奈川県", start_title: "厚木XDセンター", start_point: { lat: "35.4206969", lng: "139.3575007" }, end_pref: "埼玉県", end_title: "三越伊勢丹フードサービス", lat2: "35.8224575", lng2: "139.474855", temp: "定温", time: 10 },
    // { start_pref: "神奈川県", start_title: "厚木XDセンター", start_point: { lat: "35.4206969", lng: "139.3575007" }, end_pref: "東京都", end_title: "新宿ベジフル", lat2: "35.7056593", lng2: "139.6914469", temp: "冷凍", time: 12 },
    // { start_pref: "神奈川県", start_title: "厚木XDセンター", start_point: { lat: "35.4206969", lng: "139.3575007" }, end_pref: "神奈川県", end_title: "ライフ川崎物流センター", lat2: "35.5175856", lng2: "139.7398085", temp: "定温", time: 12 },
    // { start_pref: "埼玉県", start_title: "羽生ALC", start_point: { lat: 36.1701774, lng: 139.6003859 }, end_pref: "青森県", end_title: "ユニバース八戸", end_point: { lat: 40.514429, lng: 141.4544112 }, way: [], temp: "冷凍", time: 12 },
    // { start_pref: "埼玉県", start_title: "羽生ALC", start_point: { lat: "36.1701774", lng: "139.6003859" }, end_pref: "青森県", end_title: "ユニバース青森", lat2: "40.7644619", lng2: "140.7508913", temp: "冷凍", time: 10 },
    // { start_pref: "埼玉県", start_title: "羽生ALC", start_point: { lat: "36.1701774", lng: "139.6003859" }, end_pref: "岩手県", end_title: "ユニバース盛岡", lat2: "39.7079419", lng2: "141.0283231", temp: "定温", time: 15 },
    // { start_pref: "埼玉県", start_title: "羽生ALC", start_point: { lat: "36.1701774", lng: "139.6003859" }, end_pref: "新潟県", end_title: "山津水産", lat2: "37.8844661", lng2: "139.1278366", temp: "冷蔵", time: 15 },
    // { start_pref: "埼玉県", start_title: "羽生ALC", start_point: { lat: "36.1701774", lng: "139.6003859" }, end_pref: "新潟県", end_title: "食材流通部", lat2: "37.902254", lng2: "139.0214989", temp: "冷蔵", time: 15 },
];