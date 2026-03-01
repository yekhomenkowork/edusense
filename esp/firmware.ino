#include <FS.h>
#include <LittleFS.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <PubSubClient.h>
#include <ESP8266WebServer.h>
#include <ElegantOTA.h>
#include <DHT.h>
#include <ESP8266httpUpdate.h>
#include <ESP8266HTTPClient.h>

// --- Налаштування адмінки ESP ---
const char* www_user = "admin";
const char* www_pass = "admin123";
const String FW_VERSION = "1.0.1"; // Версія ПЗ

// --- Змінні системи ---
char server_ip[40]   = "192.168.1.104";
int  api_port        = 80;
int  mqtt_port       = 1883;
char school_name[40] = "";
char school_user[40] = "";
char school_pass[40] = "";
char device_id[40]   = "";
char device_desc[100]= "";

// Прапорці команд та таймери
bool pendingOTA = false; 
unsigned long lastMsg = 0;
unsigned long lastReconnect = 0;

// --- Прапорці підписок ---
bool sub_basic = false; 
bool sub_monitoring = false;
bool sub_security = false;
bool sub_announcements = false;

unsigned long lastSubCheck = 0;
const unsigned long SUB_CHECK_INTERVAL = 86400000; // 24 години у мілісекундах

ESP8266WebServer server(80);
WiFiClient espClient;
PubSubClient mqttClient(espClient);
DHT dht(4, DHT11); // Пін D2 (GPIO4)

// --- Веб-інтерфейс ---
const char INDEX_HTML[] PROGMEM = R"=====(
<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1'>
<title>EduSense System</title>
<style>
    body { font-family: 'Segoe UI', sans-serif; background: #f4f7f6; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 1000px; margin: auto; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    h2 { color: #1a73e8; font-size: 1.4em; margin: 0 0 15px 0; border-bottom: 2px solid #f0f2f5; padding-bottom: 10px; }
    .stat { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f2f5; align-items: center; }
    .val { font-weight: bold; font-size: 1.1em; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.85em; font-weight: bold; background: #eee; }
    .online { background: #e6f4ea; color: #1e8e3e; }
    .offline { background: #fce8e6; color: #d93025; }
    .hidden { display: none; }
    input, select { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
    .btn { width: 100%; padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; color: white; margin-top: 10px; transition: 0.2s; }
    .btn-blue { background: #1a73e8; } .btn-blue:hover { background: #1557b0; }
    .btn-green { background: #27ae60; } .btn-green:hover { background: #1e8449; }
    .btn-gray { background: #6c757d; } .btn-gray:hover { background: #5a6268; }
    .btn-red { background: #d93025; } .btn-red:hover { background: #b3261e; }
</style></head>
<body>
<div class='container'>
    <div id='view_dash' class='hidden'>
        <h1 style='text-align:center; color:#1a73e8;'>📊 <span id='d_sch'>--</span></h1>
        <div class='grid'>
            <div class='card'>
                <h2>📊 Live Sensors</h2>
                <div class='stat'><span>Температура:</span> <span class='val'><span id='t'>--</span> °C</span></div>
                <div class='stat'><span>Вологість:</span> <span class='val'><span id='h'>--</span> %</span></div>
                <div class='stat'><span>Якість повітря (Gas):</span> <span class='val' id='g'>--</span></div>
                <div class='stat'><span>MQTT Статус:</span> <span id='m_st' class='badge'>OFFLINE</span></div>
            </div>
            <div class='card'>
                <h2>🛠 Hardware & Info</h2>
                <div class='stat'><span>Сенсор мікроклімату (Темп/Волог):</span> <span id='t_st' class='badge'>Перевірка...</span></div>
                <div class='stat'><span>Сенсор якості повітря (Газ):</span> <span id='g_st' class='badge'>Перевірка...</span></div>
                <div class='stat'><span>Free RAM:</span> <span class='val'><span id='ram'>--</span> KB</span></div>
                <div class='stat'><span>Uptime:</span> <span class='val'><span id='up'>--</span> min</span></div>
                <div class='stat'><span>Версія ПЗ:</span> <span class='val' id='fw_v'>--</span></div>
                <button id='btn_ota' class='btn btn-blue' onclick='checkOta()'>🔄 Перевірити оновлення</button>
            </div>
            <div class='card'>
                <h2>💳 Активні Підписки</h2>
                <div class='stat'><span>Базова система:</span> <span id='sub_bas' class='badge'>--</span></div>
                <div class='stat'><span>Моніторинг аудиторій:</span> <span id='sub_mon' class='badge'>--</span></div>
                <div class='stat'><span>Охоронна система:</span> <span id='sub_sec' class='badge'>--</span></div>
                <div class='stat'><span>Система оголошень:</span> <span id='sub_ann' class='badge'>--</span></div>
            </div>
        </div>
        <div class='card' style='margin-top:20px; text-align:center;'>
            <p style='margin-bottom: 20px;'>ID Пристрою: <b id='d_id'>--</b> | Опис: <b id='d_dsc'>--</b></p>
            <div style='display:flex; gap:15px; justify-content:center; flex-wrap:wrap;'>
                <button class='btn btn-gray' style='width:250px;' onclick='if(confirm("Перереєструвати пристрій? Wi-Fi залишиться підключеним.")) location.href="/reconfigure"'>🔄 Зареєструвати знову</button>
                <button class='btn btn-red' style='width:250px;' onclick='if(confirm("УВАГА! Це повністю видалить налаштування мережі Wi-Fi. Продовжити?")) location.href="/factory_reset"'>⚠️ Повне скидання</button>
            </div>
        </div>
    </div>

    <div id='view_setup' class='hidden card' style='max-width:500px; margin:auto;'>
        <div id='step1'>
            <h2>Крок 1: Шлюз</h2>
            <label>IP сервера API</label>
            <input id='srv' placeholder='192.168.1.104' value='{srv}'>
            <label>Порт API</label>
            <input id='prt' type='number' placeholder='80' value='{prt}'>
            <button class='btn btn-blue' onclick='loadSchools()'>Далі</button>
        </div>
        <div id='step2' class='hidden'>
            <h2>Крок 2: Реєстрація</h2>
            <label>Заклад</label><select id='sch_list'></select>
            <input id='u' placeholder='Логін закладу'>
            <input id='p' type='password' placeholder='Пароль закладу'>
            <input id='did' placeholder='Ідентифікатор пристрою (напр. ESP-01-test)'>
            <input id='dsc' placeholder='Опис пристрою (напр. Кабінет фізики)'>
            <button class='btn btn-green' onclick='verify()'>Активувати</button>
            <p id='err' style='color:red; text-align:center; font-weight:bold; margin-top:10px;'></p>
        </div>
    </div>
</div>

<script>
    const isConf = {conf};
    if(isConf) {
        document.getElementById('view_dash').classList.remove('hidden');
        setInterval(refresh, 2000); refresh();
    } else {
        document.getElementById('view_setup').classList.remove('hidden');
    }

    function refresh() {
        fetch('/data').then(r => r.json()).then(d => {
            document.getElementById('t').innerText = d.t;
            document.getElementById('h').innerText = d.h;
            document.getElementById('g').innerText = d.g;
            document.getElementById('ram').innerText = d.ram;
            document.getElementById('up').innerText = d.up;
            document.getElementById('d_sch').innerText = d.sch;
            document.getElementById('d_id').innerText = d.did;
            document.getElementById('d_dsc').innerText = d.dsc;
            document.getElementById('fw_v').innerText = d.fw;
            
            const m = document.getElementById('m_st');
            m.innerText = d.m ? 'ONLINE' : 'OFFLINE';
            m.className = 'badge ' + (d.m ? 'online' : 'offline');

            const t_st = document.getElementById('t_st');
            t_st.innerText = d.t_ok ? 'Підключено' : 'Відключено';
            t_st.className = 'badge ' + (d.t_ok ? 'online' : 'offline');

            const g_st = document.getElementById('g_st');
            g_st.innerText = d.g_ok ? 'Підключено' : 'Відключено';
            g_st.className = 'badge ' + (d.g_ok ? 'online' : 'offline');

            // Оновлення бейджів підписок
            const setSub = (id, isActive) => {
                const el = document.getElementById(id);
                el.innerText = isActive ? 'Активно' : 'Неактивно';
                el.className = 'badge ' + (isActive ? 'online' : 'offline');
            };
            setSub('sub_bas', d.s_bas);
            setSub('sub_mon', d.s_mon);
            setSub('sub_sec', d.s_sec);
            setSub('sub_ann', d.s_ann);
        });
    }

    async function checkOta() {
        const btn = document.getElementById('btn_ota');
        btn.innerText = 'Перевірка...';
        btn.disabled = true;
        try {
            const res = await fetch('/do_ota');
            const text = await res.text();
            alert(text);
            if (text.includes("Оновлено")) location.reload();
        } catch(e) {
            alert("Помилка зв'язку із сервером оновлень!");
        }
        btn.innerText = '🔄 Перевірити оновлення';
        btn.disabled = false;
    }

    function loadSchools() {
        const ip = document.getElementById('srv').value;
        const port = document.getElementById('prt').value;
        fetch(`http://${ip}:${port}/api/schools`).then(r => r.json()).then(data => {
            const sel = document.getElementById('sch_list');
            sel.innerHTML = data.map(n => `<option value='${n}'>${n}</option>`).join('');
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
        }).catch(() => alert('Сервер недоступний. Перевірте IP та Порт.'));
    }

    async function verify() {
        const ip = document.getElementById('srv').value;
        const port = document.getElementById('prt').value;
        const body = {
            name: document.getElementById('sch_list').value,
            user: document.getElementById('u').value,
            password: document.getElementById('p').value
        };
        
        try {
            const res = await fetch(`http://${ip}:${port}/api/verify_school`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            if (res.ok) {
                const q = `srv=${ip}&prt=${port}&sch=${body.name}&u=${body.user}&p=${body.password}&did=${document.getElementById('did').value}&dsc=${document.getElementById('dsc').value}`;
                fetch('/save?' + q).then(() => { alert('Пристрій успішно активовано!'); location.reload(); });
            } else {
                document.getElementById('err').innerText = 'Невірний логін або пароль школи!';
            }
        } catch(e) {
            document.getElementById('err').innerText = 'Помилка зв\'язку з сервером!';
        }
    }
</script></body></html>
)=====";

// --- Системні функції ---

void saveParams() {
    File f = LittleFS.open("/config.json", "w");
    StaticJsonDocument<512> doc;
    doc["srv"] = server_ip; doc["prt"] = api_port;
    doc["sch"] = school_name; doc["u"] = school_user;
    doc["p"] = school_pass; doc["did"] = device_id; doc["dsc"] = device_desc;
    
    // Збереження статусів підписок
    doc["s_bas"] = sub_basic; 
    doc["s_mon"] = sub_monitoring; 
    doc["s_sec"] = sub_security; 
    doc["s_ann"] = sub_announcements;
    
    serializeJson(doc, f); f.close();
}

void loadParams() {
    if (LittleFS.begin() && LittleFS.exists("/config.json")) {
        File f = LittleFS.open("/config.json", "r");
        StaticJsonDocument<512> doc;
        deserializeJson(doc, f);
        strcpy(server_ip, doc["srv"] | "192.168.1.104");
        api_port = doc["prt"] | 80;
        strcpy(school_name, doc["sch"] | "");
        strcpy(school_user, doc["u"] | "");
        strcpy(school_pass, doc["p"] | "");
        strcpy(device_id, doc["did"] | "");
        strcpy(device_desc, doc["dsc"] | "");

        // Завантаження статусів підписок
        sub_basic = doc["s_bas"] | false;
        sub_monitoring = doc["s_mon"] | false;
        sub_security = doc["s_sec"] | false;
        sub_announcements = doc["s_ann"] | false;
        
        f.close();
    }
}

bool isAuthorized() {
    if (!server.authenticate(www_user, www_pass)) { server.requestAuthentication(); return false; }
    return true;
}

// === Функція для кодування кирилиці та пробілів у URL ===
String urlEncode(String str) {
    String encoded = "";
    for (int i = 0; i < str.length(); i++) {
        char c = str.charAt(i);
        if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            encoded += c;
        } else {
            char buf[4];
            sprintf(buf, "%%%02X", (unsigned char)c);
            encoded += buf;
        }
    }
    return encoded;
}

// === Функція-слухач MQTT команд ===
void mqttCallback(char* topic, byte* payload, unsigned int length) {
    String msg;
    for (int i = 0; i < length; i++) {
        msg += (char)payload[i];
    }
    Serial.print("Отримано команду з MQTT ["); Serial.print(topic); Serial.print("]: "); Serial.println(msg);
    
    if (msg == "UPDATE_FW") {
        Serial.println("Отримано наказ на оновлення з сервера! Плануємо OTA...");
        pendingOTA = true; 
    }
}

// === Функція перевірки підписок на сервері ===
void checkSubscriptions() {
    if (WiFi.status() == WL_CONNECTED && strlen(school_name) > 0) {
        WiFiClient client;
        HTTPClient http;
        
        // Використовуємо urlEncode для правильної передачі кирилиці
        String url = "http://" + String(server_ip) + ":" + String(api_port) + "/api/subscriptions?school=" + urlEncode(String(school_name));
        
        Serial.print("Перевірка підписок: "); Serial.println(url);
        
        http.begin(client, url);
        int httpCode = http.GET();
        
        if (httpCode == HTTP_CODE_OK) {
            String payload = http.getString();
            StaticJsonDocument<256> doc;
            deserializeJson(doc, payload);
            
            sub_basic = doc["basic"] | true;
            sub_monitoring = doc["monitoring"] | false;
            sub_security = doc["security"] | false;
            sub_announcements = doc["announcements"] | false;
            
            Serial.println("Підписки успішно оновлено!");
            saveParams(); 
        } else {
            Serial.printf("Помилка перевірки підписок: %d\n", httpCode);
        }
        http.end();
    }
}

void setup() {
    Serial.begin(115200);
    dht.begin();
    loadParams();

    WiFiManager wm;
    wm.autoConnect("EduSense-Setup");
    ElegantOTA.begin(&server);

    server.on("/", []() {
        if (!isAuthorized()) return;
        String s = FPSTR(INDEX_HTML);
        s.replace("{srv}", server_ip);
        s.replace("{prt}", String(api_port));
        s.replace("{conf}", strlen(school_name) > 0 ? "true" : "false");
        server.send(200, "text/html", s);
    });

    server.on("/data", []() {
        if (!isAuthorized()) return;
        StaticJsonDocument<512> doc;
        
        float t = dht.readTemperature();
        float h = dht.readHumidity();
        bool t_ok = !isnan(t) && !isnan(h);
        int gas = analogRead(A0);
        bool g_ok = (gas > 5); 

        doc["t"] = t_ok ? t : 0;
        doc["h"] = t_ok ? h : 0;
        doc["t_ok"] = t_ok;
        doc["g"] = gas;
        doc["g_ok"] = g_ok;

        doc["m"] = mqttClient.connected();
        doc["ram"] = ESP.getFreeHeap() / 1024;
        doc["up"] = millis() / 60000;
        
        doc["sch"] = school_name;
        doc["did"] = device_id;
        doc["dsc"] = device_desc;
        doc["fw"] = FW_VERSION; 
        
        // Передаємо статуси підписок у веб-інтерфейс
        doc["s_bas"] = sub_basic;
        doc["s_mon"] = sub_monitoring;
        doc["s_sec"] = sub_security;
        doc["s_ann"] = sub_announcements;
        
        String b; serializeJson(doc, b);
        server.send(200, "application/json", b);
    });

    server.on("/save", []() {
        if (!isAuthorized()) return;
        strcpy(server_ip, server.arg("srv").c_str());
        api_port = server.arg("prt").toInt();
        strcpy(school_name, server.arg("sch").c_str());
        strcpy(school_user, server.arg("u").c_str());
        strcpy(school_pass, server.arg("p").c_str());
        strcpy(device_id, server.arg("did").c_str());
        strcpy(device_desc, server.arg("dsc").c_str());
        saveParams();
        server.send(200, "text/plain", "OK");
        delay(1000); ESP.restart();
    });

    server.on("/do_ota", []() {
        if (!isAuthorized()) return;
        WiFiClient client;
        String url = "http://" + String(server_ip) + ":" + String(api_port) + "/api/ota";
        ESPhttpUpdate.rebootOnUpdate(false); 
        t_httpUpdate_return ret = ESPhttpUpdate.update(client, url, FW_VERSION);

        switch (ret) {
            case HTTP_UPDATE_FAILED: server.send(500, "text/plain", "Помилка: " + ESPhttpUpdate.getLastErrorString()); break;
            case HTTP_UPDATE_NO_UPDATES: server.send(200, "text/plain", "У вас встановлена найсвіжіша версія!"); break;
            case HTTP_UPDATE_OK: server.send(200, "text/plain", "Оновлено успішно! Перезавантаження..."); delay(1000); ESP.restart(); break;
        }
    });

    server.on("/reconfigure", []() {
        if (!isAuthorized()) return;
        server.send(200, "text/plain", "Видалення реєстрації... Wi-Fi збережено.");
        delay(500); LittleFS.remove("/config.json"); ESP.restart();
    });

    server.on("/factory_reset", []() {
        if (!isAuthorized()) return;
        server.send(200, "text/plain", "Повне скидання системи...");
        delay(500); LittleFS.remove("/config.json"); WiFi.disconnect(true, true); ESP.eraseConfig(); ESP.restart();
    });

    server.begin();
    mqttClient.setServer(server_ip, mqtt_port); 
    mqttClient.setCallback(mqttCallback);
}

void loop() {
    // 1. ПЕРЕВІРКА ПІДПИСОК (раз на добу або при старті)
    if (lastSubCheck == 0 || millis() - lastSubCheck > SUB_CHECK_INTERVAL) {
        checkSubscriptions();
        lastSubCheck = millis();
    }

    // 2. ПЕРЕВІРКА ПРАПОРЦЯ КОМАНД (Push OTA)
    if (pendingOTA) {
        pendingOTA = false;
        Serial.println(">>> ЗАПУСК АВТОМАТИЧНОГО OTA ОНОВЛЕННЯ <<<");
        WiFiClient client;
        String url = "http://" + String(server_ip) + ":" + String(api_port) + "/api/ota";
        ESPhttpUpdate.rebootOnUpdate(true); 
        t_httpUpdate_return ret = ESPhttpUpdate.update(client, url, FW_VERSION);
        if (ret == HTTP_UPDATE_FAILED) {
            Serial.printf("Помилка OTA (%d): %s\n", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
        }
    }

    server.handleClient();
    ElegantOTA.loop();
    
    // 3. З'ЄДНАННЯ MQTT ТА ПІДПИСКА НА КОМАНДИ
    if (!mqttClient.connected() && WiFi.status() == WL_CONNECTED && strlen(school_user) > 0) {
        if (millis() - lastReconnect > 5000) {
            lastReconnect = millis();
            Serial.print("Підключення до MQTT...");
            if (mqttClient.connect(device_id, school_user, school_pass)) {
                Serial.println("Успішно!");
                String school_cmd = "edusense/" + String(school_name) + "/cmd";
                mqttClient.subscribe(school_cmd.c_str());
                String device_cmd = "edusense/" + String(school_name) + "/" + String(device_id) + "/cmd";
                mqttClient.subscribe(device_cmd.c_str());
            } else {
                Serial.println("Не вдалося.");
            }
        }
    }
    mqttClient.loop();

    // 4. ВІДПРАВКА ДАНИХ ДАТЧИКІВ (тільки якщо є підписка на моніторинг або за замовчуванням)
    if (mqttClient.connected() && (millis() - lastMsg > 15000)) {
        lastMsg = millis();
        String topic_base = "edusense/" + String(school_name) + "/" + String(device_id);
        
        float t = dht.readTemperature();
        if(!isnan(t)) {
            mqttClient.publish((topic_base + "/temp").c_str(), String(t).c_str());
            mqttClient.publish((topic_base + "/hum").c_str(), String(dht.readHumidity()).c_str());
        }
        mqttClient.publish((topic_base + "/gas").c_str(), String(analogRead(A0)).c_str());
    }
}
