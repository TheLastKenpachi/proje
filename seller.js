var fiokok = [ ];
if (game_data.village.name.includes(game_data.player.name) === false && fiokok.includes(game_data.player.name)){
    falunev_csere1();
    function falunev_csere1(){
        var falunev_xhr = new XMLHttpRequest();
        var falunev_payload = `name=${encodeURIComponent(game_data.player.name)}&h=${game_data.csrf}`
        falunev_xhr.open("POST", `/game.php?village=${game_data.village.id}&screen=main&action=change_name`, true);
        falunev_xhr.setRequestHeader("Upgrade-Insecure-Requests", "1");
        falunev_xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
        falunev_xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        falunev_xhr.send(falunev_payload);
    }
}
var buildings = game_data.village.buildings;
if(+buildings.market > 0){
    if(document.URL.match("mode=exchange")){start_pp();}
    else{self.location = game_data.link_base_pure.replace(/screen\=\w*/i, "screen=market&mode=exchange");}
}
else {
    if (document.URL.match("screen=main") === null){self.location = game_data.link_base_pure.replace(/screen\=\w*/i, "screen=main");}
    else{buildi();}}
function buildi(){
    auto_building_finish();
    var build_counter = {};
    build_counter.main = 0;
    build_counter.storage = 0;
    build_counter.market = 0;
    if (+game_data.village.buildings.main < 3){build_counter.main = 3 - (+game_data.village.buildings.main);}
    if (+game_data.village.buildings.storage < 2){build_counter.storage = 2 - (+game_data.village.buildings.storage);}
    if (+game_data.village.buildings.market < 1){build_counter.market = 1 - (+game_data.village.buildings.market);}
    start_build();
    function start_build(){
        var del = Math.floor((Math.random()*1500)+1000);
        if(+build_counter.main > 0){build("main");}
        else if(+build_counter.storage > 0){build("storage");}
        else if(+build_counter.market > 0){build("market");}
        else {setTimeout(function(){self.location = game_data.link_base_pure.replace(/screen\=\w*/i, "screen=market&mode=exchange");},del);}
    }
    function build(building){
        var delay = Math.floor((Math.random()*2000)+2500);
        var data = {};
        data["id"] = building;
        data["force"] = 1;
        data["destroy"] = 0;
        data["source"] = game_data.village.id;
        data.h = game_data.csrf;
        TribalWars.post("main", {ajaxaction: "upgrade_building", type: "main", "":""}, data,
                        //success
                        function(rx){if(rx){
            BuildingMain.init_buildqueue("main");
            BuildingMain.update_all(rx);
            if(building === "main"){build_counter.main = build_counter.main - 1;}
            if(building === "storage"){build_counter.storage = build_counter.storage - 1;}
            if(building === "market"){build_counter.market = build_counter.market - 1;}
            start_build();
        }}
                        ,
                        //fail
                        function(ry) {
            if (ry){setTimeout(build(building),delay);}
        })
    }
    function auto_building_finish(){
        (async () => {
            'use strict';
            //****************************** Configuration ******************************//
            var mediumDelay = 300;
            var delayRange = 100;
            //*************************** End Configuration ***************************//

            var intervalRange = Math.floor((Math.random() * mediumDelay) + delayRange );
            setInterval(function(){intervalRange = Math.floor((Math.random() * mediumDelay) + delayRange );},200);
            // Loop
            setInterval(() => {
                var tr1 = $('[id="buildqueue"]').find('tr').eq(1);
                var text1 = tr1.find('td').eq(1).find('span').eq(0).text().split(" ").join("").split("\n").join("");
                var timeSplit1 = text1.split(':');

                // Free completition
                if (timeSplit1[0] * 60 * 60 + timeSplit1[1] * 60 + timeSplit1[2] * 1 < 3 * 60) {
                    tr1.find('td').eq(2).find('a').eq(2).click();
                }

                function quest_helper_request(){
                    var quest_finished = document.getElementById("questlog")?.getElementsByClassName("finished")?.length;
                    if (quest_finished > 0) {
                        var quest_id = +document.getElementById("questlog")?.getElementsByClassName("finished")[0].id.split("_")[1];
                        quest_finish_request(quest_id);
                    }

                    function quest_finish_request(quest){
                        Quests.getQuest(quest).complete();
                        //var data = {};
                        //data.h = game_data.csrf;
                        //TribalWars.post("api", {ajaxaction: "quest_complete", quest:quest, skip:false}, data)
                    }
                }
                quest_helper_request();

                // Completed mission
                //$('[class="btn btn-confirm-yes"]').click();

                // Daily rewards
                //var dailyreward = document.getElementsByClassName("btn btn-default").length;
                //var scavunlock = document.getElementsByClassName("btn btn-default unlock-button").length;
                //if (dailyreward > 0 && scavunlock === 0){var b=0; document.getElementsByClassName("btn btn-default")[b].click();}
                //if (scavunlock > 0){var c=scavunlock - 1; document.getElementsByClassName("btn btn-default")[c].click();}
            }, intervalRange);

        })();
    }
}
function start_pp(){
    createInput();
    function createInput() {
        "use strict";
        const userInputParent = document.getElementById("premium_exchange_form"); // Parent element
        // Create input for setting how much res should be bought
        const divScript = document.createElement("div");
        divScript.setAttribute("id", "divScript");
        userInputParent.parentNode.insertBefore(divScript, userInputParent);
        document.getElementById("divScript").innerHTML = '<p>Ennyit vegyen nyersit: <input id="stackInput"><span id="stackText"></span></p><p>Ennyi pp-ért vegyen: <input id="stackInput_pp"><span id="stackText_pp"></span> &nbsp;&nbsp;&nbsp;<input id="calc_vevo_nyersi" type="checkbox" />&nbsp;Meghatározott tőzsdekészlet: <input id="var_tozsde_cap" value=0><span id="stackText_var_tozsde_cap"></p><p>PP kell: <label id="pp_text"></label> <p>nyersi kell: <label id="nyersi_text"></label> </p><p><input type=\"checkbox\" name=\"wood\" id=\"woodCheck\"> Wood <input type=\"checkbox\" " + "name=\"stone\" id=\"stoneCheck\"> Stone <input type=\"checkbox\" name=\"iron\" id=\"ironCheck\"> Iron</p><p><button id="start_buy" class="btn">BUY</button> <button id="start_buy_pp" class="btn">BUY PP</button> <button id="start_buy_all" class="btn">BUY ALL</button> <button id="start_sell" class="btn">SELL</button> <button id="start_sell_all" class="btn">SELL ALL</button> </p><table class="vis modemenu" style="position: relative;"> <tbody> <tr> <td style="min-width: 120px; text-align: center; vertical-align: middle;" colspan="2"><b>Időzítő</b> (tőzsde tranzakció 800ms)</td> </tr> <tr> <td style="min-width: 120px; text-align: center; vertical-align: middle;">Idő</td> <td style="min-width: 120px;"><input id="timer_ido" size="50" type="text" placeholder="10:00:00:000" /></td> </tr> <tr> <td style="min-width: 120px; text-align: center; vertical-align: middle;"><button id="timer_start" class="btn">Időzít</button></td> <td style="min-width: 120px; text-align: center; vertical-align: middle;"> Vesz nyersi<label class="switch"> <input id="timer_buy_res" type="checkbox" /> <span class="slider round"></span></label> &nbsp;Vesz PP<label class="switch"> <input id="timer_buy_pp" type="checkbox" /> <span class="slider round"></span></label> &nbsp;Vesz mind <label class="switch"> <input id="timer_buy_all" type="checkbox" /> <span class="slider round"></span></label> &nbsp;Elad nyersi <label class="switch"> <input id="timer_sell_res" type="checkbox" /> <span class="slider round"></span></label> &nbsp;Elad mind <label class="switch"> <input id="timer_sell_all" type="checkbox" /> <span class="slider round"></span></label> </td> </tr> <tr> <td style="min-width: 120px; text-align: center; vertical-align: middle;">Státusz</td> <td style="min-width: 120px; text-align: center; vertical-align: middle;"><label id="timer_status"></label></td> </tr> </tbody></table>';
    }
    document.getElementById("timer_status").innerText = "NINCS IDŐZÍTVE";
    document.getElementById("start_buy").addEventListener("click", function () {
        var checked_wood = document.getElementById("woodCheck").checked;
        var checked_stone = document.getElementById("stoneCheck").checked;
        var checked_iron = document.getElementById("ironCheck").checked;
        var stack_input = +document.getElementById("stackInput").value;
        if (checked_wood || checked_stone || checked_iron){
            if (checked_wood){buy("wood", stack_input);}
            if (checked_stone){buy("stone", stack_input);}
            if (checked_iron){buy("iron", stack_input);}
        }
    });
    document.getElementById("start_buy_pp").addEventListener("click", function () {
        var checked_wood = document.getElementById("woodCheck").checked;
        var checked_stone = document.getElementById("stoneCheck").checked;
        var checked_iron = document.getElementById("ironCheck").checked;
        if (checked_wood || checked_stone || checked_iron){
            if (checked_wood){buy_pp_amount("wood");}
            if (checked_stone){buy_pp_amount("stone");}
            if (checked_iron){buy_pp_amount("iron");}
        }
    });
    document.getElementById("start_buy_all").addEventListener("click", function () {
        var checked_wood = document.getElementById("woodCheck").checked;
        var checked_stone = document.getElementById("stoneCheck").checked;
        var checked_iron = document.getElementById("ironCheck").checked;
        if (checked_wood || checked_stone || checked_iron){
            if (checked_wood){buy_all("wood");}
            if (checked_stone){buy_all("stone");}
            if (checked_iron){buy_all("iron");}
        }
    });
    document.getElementById("start_sell").addEventListener("click", function () {
        var checked_wood = document.getElementById("woodCheck").checked;
        var checked_stone = document.getElementById("stoneCheck").checked;
        var checked_iron = document.getElementById("ironCheck").checked;
        var stack_input = +document.getElementById("stackInput").value;
        if (checked_wood || checked_stone || checked_iron){
            if (checked_wood){sell("wood", stack_input);}
            if (checked_stone){sell("stone", stack_input);}
            if (checked_iron){sell("iron", stack_input);}
        }
    });
    document.getElementById("start_sell_all").addEventListener("click", function () {
        var checked_wood = document.getElementById("woodCheck").checked;
        var checked_stone = document.getElementById("stoneCheck").checked;
        var checked_iron = document.getElementById("ironCheck").checked;
        if (checked_wood || checked_stone || checked_iron){
            if (checked_wood){sell_all("wood");}
            if (checked_stone){sell_all("stone");}
            if (checked_iron){sell_all("iron");}
        }
    });
    document.getElementById("woodCheck").addEventListener("click", function () {
        document.getElementById("stoneCheck").checked = false;
        document.getElementById("ironCheck").checked = false;
    });
    document.getElementById("stoneCheck").addEventListener("click", function () {
        document.getElementById("woodCheck").checked = false;
        document.getElementById("ironCheck").checked = false;
    });
    document.getElementById("ironCheck").addEventListener("click", function () {
        document.getElementById("woodCheck").checked = false;
        document.getElementById("stoneCheck").checked = false;
    });

    document.getElementById("timer_buy_res").addEventListener("click", function () {
        document.getElementById("timer_buy_pp").checked = false;
        document.getElementById("timer_buy_all").checked = false;
        document.getElementById("timer_sell_res").checked = false;
        document.getElementById("timer_sell_all").checked = false;
    });
    document.getElementById("timer_buy_pp").addEventListener("click", function () {
        document.getElementById("timer_buy_res").checked = false;
        document.getElementById("timer_buy_all").checked = false;
        document.getElementById("timer_sell_res").checked = false;
        document.getElementById("timer_sell_all").checked = false;
    });
    document.getElementById("timer_buy_all").addEventListener("click", function () {
        document.getElementById("timer_buy_pp").checked = false;
        document.getElementById("timer_buy_res").checked = false;
        document.getElementById("timer_sell_res").checked = false;
        document.getElementById("timer_sell_all").checked = false;
    });
    document.getElementById("timer_sell_res").addEventListener("click", function () {
        document.getElementById("timer_buy_pp").checked = false;
        document.getElementById("timer_buy_all").checked = false;
        document.getElementById("timer_buy_res").checked = false;
        document.getElementById("timer_sell_all").checked = false;
    });
    document.getElementById("timer_sell_all").addEventListener("click", function () {
        document.getElementById("timer_buy_pp").checked = false;
        document.getElementById("timer_buy_all").checked = false;
        document.getElementById("timer_sell_res").checked = false;
        document.getElementById("timer_buy_res").checked = false;
    });
    document.getElementById("timer_start").addEventListener("click", function () {
        timer();
    });
    setInterval(calc_cost, 200);
    function calc_cost(){
        var checked_wood = document.getElementById("woodCheck").checked;
        var checked_stone = document.getElementById("stoneCheck").checked;
        var checked_iron = document.getElementById("ironCheck").checked;
        var stack_input = +document.getElementById("stackInput").value;
        var pp_input = +document.getElementById("stackInput_pp").value;
        var var_tozsde_cap = +document.getElementById("var_tozsde_cap").value;
        var pp_output = document.getElementById("pp_text");
        var stack_output = document.getElementById("nyersi_text");
        if (checked_wood || checked_stone || checked_iron){
            if (checked_wood){
                pp_output.innerHTML = Math.ceil(PremiumExchange.calculateCost("wood",stack_input)) + " pp";
                calc_pp("wood");
            }
            if (checked_stone){
                pp_output.innerHTML = Math.ceil(PremiumExchange.calculateCost("stone",stack_input)) + " pp";
                calc_pp("stone");
            }
            if (checked_iron){
                pp_output.innerHTML = Math.ceil(PremiumExchange.calculateCost("iron",stack_input)) + " pp";
                calc_pp("iron");
            }
        }
        function calc_pp(res){
            var stock = +eval("PremiumExchange.data.stock." + res);
            var capac = +eval("PremiumExchange.data.capacity." + res);
            var price = parseInt(document.getElementById("premium_exchange_rate_" + res).children[0].innerText);
            var canBuy = stock;
            var pp = +document.getElementById("stackInput_pp").value;
            var nyersi_i; var nyersi_up; var final_nyers; var amnt;
            if (document.getElementById("calc_vevo_nyersi").checked === false){
                for (let i = 0; i<99999; i++){
                    nyersi_i = i * 63;
                    nyersi_up = Math.round(PremiumExchange.calculateCost(res,nyersi_i));
                    if (nyersi_up === pp && nyersi_i < canBuy){
                        final_nyers = nyersi_i;
                        stack_output.innerHTML = final_nyers + "  " + res;
                        break;
                    }
                    else if (nyersi_i >= canBuy){
                        amnt = canBuy;
                        stack_output.innerHTML = amnt + "  " + res;
                        break;
                    }
                }
            }
            if (document.getElementById("calc_vevo_nyersi").checked === true){
                var tozsde_pp_kell = Math.ceil(PremiumExchange.calculateCost(res, Math.abs(var_tozsde_cap - stock))) - pp;
                for (let i = 0; i<99999; i++){
                    nyersi_i = i * 63;
                    nyersi_up = Math.ceil(PremiumExchange.calculateCost(res,nyersi_i));
                    if (nyersi_up === tozsde_pp_kell){
                        final_nyers =  Math.abs(var_tozsde_cap - stock) - nyersi_i;
                        stack_output.innerHTML = final_nyers + "  " + res;
                        document.getElementById("stackInput").value = final_nyers;
                        break;
                    }
                }
            }
        }
    }
    function buy(res, amnt) {
        var response = PremiumExchange.showConfirmationDialog.toString();
        var splitted = response.split("TribalWars._ah={")[1];
        var splitted_split = splitted.split(":");
        var keya = splitted_split[0].toString();
        var key_value;
        var trust_value = splitted_split[1].split("}")[0];
        if (trust_value === "!r"){key_value = false;}
        else if (trust_value === "r"){key_value = true;}
        var isBuying = true;
        let data = {};
        data["buy_" + res] = amnt;
        data.h = game_data.csrf;
        TribalWars.post("market", {ajaxaction: "exchange_begin"}, data, function(r) {
            if (r[0].error) {
                isBuying = false;
                return;
            }
            let rate_hash = r[0].rate_hash;
            let buy_amnt = r[0].amount;
            data["rate_" + res] = rate_hash;
            data["buy_" + res] = buy_amnt;
            data["mb"] = 1;
            data.h = game_data.csrf;
            TribalWars._ah = {[keya]: key_value};
            TribalWars.post("market", {ajaxaction: "exchange_confirm"}, data, function(r) {
                isBuying = false;
                if (r.success) {
                    var temp = new Date();
                    document.getElementById("timer_status").innerText = "TRANZAKCIÓ TELJESÍTVE: " + temp.getHours() + ":" +temp.getMinutes() + ":" +temp.getSeconds() + ":" + temp.getMilliseconds();
                    UI.SuccessMessage("Bought " + buy_amnt + " " + res + "!");
                    $("#market_status_bar").replaceWith(r.data.status_bar);
                }
            })
        })
    }
    function sell(res, amnt) {
        var response = PremiumExchange.showConfirmationDialog.toString();
        var splitted = response.split("TribalWars._ah={")[1];
        var splitted_split = splitted.split(":");
        var keya = splitted_split[0].toString();
        var key_value;
        var trust_value = splitted_split[1].split("}")[0];
        if (trust_value === "!r"){key_value = false;}
        else if (trust_value === "r"){key_value = true;}
        var isBuying = true;
        let data = {};
        data["sell_" + res] = amnt;
        data.h = game_data.csrf;
        TribalWars.post("market", {ajaxaction: "exchange_begin"}, data, function(r) {
            if (r[0].error) {
                isBuying = false;
                return;
            }
            let rate_hash = r[0].rate_hash;
            let buy_amnt = -r[0].amount;
            data["rate_" + res] = rate_hash;
            data["sell_" + res] = buy_amnt;
            data["mb"] = 1;
            data.h = game_data.csrf;
            TribalWars._ah = {[keya]: key_value};
            TribalWars.post("market", {ajaxaction: "exchange_confirm"}, data, function(r) {
                isBuying = false;
                if (r.success) {
                    var temp = new Date();
                    document.getElementById("timer_status").innerText = "TRANZAKCIÓ TELJESÍTVE: " + temp.getHours() + ":" +temp.getMinutes() + ":" +temp.getSeconds() + ":" + temp.getMilliseconds();
                    UI.SuccessMessage("Sold " + buy_amnt + " " + res + "!");
                    $("#market_status_bar").replaceWith(r.data.status_bar);
                }
            })
        })
    }
    function buy_all(res) {
        TribalWars.get("market", {
            ajax: "exchange_data"
        }, function(data) {
            function calculateCost(e, a) {
                var r = data.stock[e],
                    t = data.capacity[e];
                return (1 + (data.tax.buy)) * (calculateMarginalPrice(r, t) + calculateMarginalPrice(r - a, t)) * a / 2
            }
            function calculateMarginalPrice(e, a) {
                var r = data.constants;
                return r.resource_base_price - r.resource_price_elasticity * e / (a + r.stock_size_modifier)
            }
            function calculateRateForOnePoint(e) {
                for (var a = data.stock[e], r = data.capacity[e], t = (data.tax.buy, calculateMarginalPrice(a, r)), i = Math.floor(1 / t), c = calculateCost(e, i), n = 0; c > 1 && n < 50; ) i--,
                    n++,
                    c = calculateCost(e, i);
                return i
            }
            var stock = data.stock[res];
            var capac = data.capacity[res];
            var price = calculateRateForOnePoint(res);
            var canBuy = stock - price;
            var pp = +game_data.player.pp;
            for (let i = 0; i<99999; i++){
                var nyersi_i = i * 63;
                var nyersi_up = Math.ceil(calculateCost(res,nyersi_i));
                if (nyersi_up === pp && nyersi_i < canBuy){
                    var final_nyers = nyersi_i;
                    buy(res, final_nyers);
                    break;
                }
                else if (nyersi_i >= canBuy){
                    var amnt = canBuy;
                    buy(res, amnt);
                    break;
                }
            }
        }
                      )
    }
    function sell_all(res) {
        TribalWars.get("market", {
            ajax: "exchange_data"
        }, function(data) {
            function calculateCost(e, a) {
                var r = data.stock[e],
                    t = data.capacity[e];
                return (1 + (data.tax.buy)) * (calculateMarginalPrice(r, t) + calculateMarginalPrice(r - a, t)) * a / 2
            }
            function calculateMarginalPrice(e, a) {
                var r = data.constants;
                return r.resource_base_price - r.resource_price_elasticity * e / (a + r.stock_size_modifier)
            }
            function calculateRateForOnePoint(e) {
                for (var a = data.stock[e], r = data.capacity[e], t = (data.tax.buy, calculateMarginalPrice(a, r)), i = Math.floor(1 / t), c = calculateCost(e, i), n = 0; c > 1 && n < 50; ) i--,
                    n++,
                    c = calculateCost(e, i);
                return i
            }
            var stock = data.stock[res];
            var capac = data.capacity[res];
            var price = calculateRateForOnePoint(res);
            var invillage = parseInt(document.getElementById(res).innerText);
            var merchAvail = data.merchants;
            var canSell = capac - stock - price;
            if ((merchAvail * 1000) < canSell){canSell = (merchAvail - 2) * 1000;}
            if (invillage < canSell){canSell = invillage - 2000;}
            for (let i = 0; i<99999; i++){
                var nyersi_i = i * 63;
                var nyersi_up = Math.ceil(calculateCost(res,nyersi_i));
                if (nyersi_i > canSell){
                    var final_nyers = nyersi_i - 65;
                    if (final_nyers > price){
                        sell(res, final_nyers);
                    }
                    break;
                }
            }
        }
                      )
    }
    function buy_pp_amount(res) {
        TribalWars.get("market", {
            ajax: "exchange_data"
        }, function(data) {
            function calculateCost(e, a) {
                var r = data.stock[e],
                    t = data.capacity[e];
                return (1 + (data.tax.buy)) * (calculateMarginalPrice(r, t) + calculateMarginalPrice(r - a, t)) * a / 2
            }
            function calculateMarginalPrice(e, a) {
                var r = data.constants;
                return r.resource_base_price - r.resource_price_elasticity * e / (a + r.stock_size_modifier)
            }
            function calculateRateForOnePoint(e) {
                for (var a = data.stock[e], r = data.capacity[e], t = (data.tax.buy, calculateMarginalPrice(a, r)), i = Math.floor(1 / t), c = calculateCost(e, i), n = 0; c > 1 && n < 50; ) i--,
                    n++,
                    c = calculateCost(e, i);
                return i
            }
            var stock = data.stock[res];
            var capac = data.capacity[res];
            var price = calculateRateForOnePoint(res);
            var canBuy = stock;
            var pp = +document.getElementById("stackInput_pp").value;
            for (let i = 0; i<99999; i++){
                var nyersi_i = i * 63;
                var nyersi_up = Math.ceil(calculateCost(res,nyersi_i));
                if (nyersi_up === pp && nyersi_i < canBuy){
                    var final_nyers = nyersi_i;
                    buy(res, final_nyers);
                    break;
                }
                else if (nyersi_i >= canBuy){
                    var amnt = canBuy;
                    buy(res, amnt);
                    break;
                }
            }
        }
                      )
    }
    function timer(){
        var checked_wood = document.getElementById("woodCheck").checked;
        var checked_stone = document.getElementById("stoneCheck").checked;
        var checked_iron = document.getElementById("ironCheck").checked;
        var stack_input = +document.getElementById("stackInput").value;
        var stackInput_pp = +document.getElementById("stackInput_pp").value;
        var timer_ido = document.getElementById("timer_ido").value;
        var timer_buy_res = document.getElementById("timer_buy_res").checked;
        var timer_buy_pp = document.getElementById("timer_buy_pp").checked;
        var timer_buy_all = document.getElementById("timer_buy_all").checked;
        var timer_sell_res = document.getElementById("timer_sell_res").checked;
        var timer_sell_all = document.getElementById("timer_sell_all").checked;
        document.getElementById("timer_status").innerText = "IDŐZÍTVE: " + timer_ido;
        var ress;
        if (checked_wood || checked_stone || checked_iron){
            if (checked_wood){ress = "wood";}
            if (checked_stone){ress = "stone";}
            if (checked_iron){ress = "iron";}
        }
        var time = new Date();
        time.setTime(Timing.getCurrentServerTime());
        var timer_time = new Date();
        timer_time.setFullYear(time.getFullYear());
        timer_time.setMonth(time.getMonth());
        timer_time.setDate(time.getDate());
        timer_time.setHours(+timer_ido.split(":")[0]);
        timer_time.setMinutes(+timer_ido.split(":")[1]);
        timer_time.setSeconds (+timer_ido.split(":")[2]);
        timer_time.setMilliseconds(+timer_ido.split(":")[3]);
        function timer_start(){
            time.setTime(Timing.getCurrentServerTime());
            var idozites_ido = timer_time.getTime();
            var jelenlegi_ido = time.getTime();
            if (Date.now() >= idozites_ido){
                if (timer_buy_res === true){buy(ress,stack_input);}
                if (timer_buy_pp === true){buy_pp_amount(ress);}
                if (timer_buy_all === true){buy_all(ress);}
                if (timer_sell_res === true){sell(ress,stack_input);}
                if (timer_sell_all === true){sell_all(ress);}
                clearInterval(timer_interval);
                return;
            }
        }
        var timer_interval = setInterval(timer_start, 5);
    }
}
