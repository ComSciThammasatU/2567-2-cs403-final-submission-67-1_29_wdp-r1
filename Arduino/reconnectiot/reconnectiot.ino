#include "esp_camera.h"
#include <WiFi.h>
#include <WiFiManager.h>
#include <ESPmDNS.h>
#include "fd_forward.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <time.h>
#include <Arduino_BuiltIn.h>
#include "certs.h"

//include secsors
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <SHT21.h>
#include "Si115X.h"

//time
#include <NTPClient.h>
#include <WiFiUdp.h>

#define RXPin (12)
#define TXPin (13)

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

// Variables to save date and time
String formattedDate;
String dayStamp;
String timeStamp;

#include <Preferences.h>
extern Preferences preferences;


#define CAMERA_MODEL_AI_THINKER  // Has PSRAM

#include "camera_pins.h"

char ssidChar[64] = {
  0,
};
char passwordChar[64] = {
  0,
};


void setupApp();
void startCameraServer();
esp_err_t take_send_photo_with_WiFi(String macAddressLocal, String DeviceID);
esp_err_t take_send_photo(int num);
esp_err_t take_picture_store_only(String DeviceID);
//void initMicroSDCard();
void set_last_capture_millis(long mills);
long get_last_capture_millis();
int get_capture_interval();
int get_capture_interval();
void set_last_images_id(int id);
int get_last_images_id();

//String webAppHostName = "xxxx";
String webAppHostName = "esp32cam1";
long current_millis;
long last_capture_millis = 0;
bool isLaunchedNetwork = false;
bool isConnectedNetwork = false;
WiFiManager wm;

SHT21 sht;
Si115X si1151;

unsigned long lastDisplayTime = 0;

//setup gps 
static const uint32_t GPSBaud = 9600;
TinyGPSPlus gps;
HardwareSerial ss(2);

//varible to store data
float humidity;
float temp ;
float uv ;
float lat;
float lng;
String latt;
String lngg;
String tempp;
String humi;

//milli function to delay
unsigned long lastMillis = 0;
unsigned long previousMillis = 0;
const long interval = 5000;
const long interval1 = 60000;

// The MQTT topics that this device should publish/subscribe
#define AWS_IOT_PUBLISH_TOPIC   "esp32/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "esp32/sub"

WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

time_t now;
time_t nowish = 1510592825;

// Preferences preferences;

// preferences.begin("esp32cam", false);

void messageHandler(char* topic, byte* payload, unsigned int length) {
  Serial.print("incoming: ");
  Serial.println(topic);
 
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload);
  const char* message = doc["message"];
  Serial.println(message);
}

void connectAWS() {
  // WiFi.mode(WIFI_STA);

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
 
  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);
 
  // Create a message handler
  // client.setCallback(messageHandler);
 
  Serial.println("Connecting to AWS IOT");
 
  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }
 
  if (!client.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }
 
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
 
  Serial.println("AWS IoT Connected!");
}

void publishMessage(String dayStamp,String timeStamp,String lat,String lng,String humidity,String temp,float uv,String imagename) {
  StaticJsonDocument<200> doc;
  doc["imagename"] = imagename;
  doc["DATE"] = dayStamp;
  doc["Time"] = timeStamp;
  doc["Latitude"] = lat;
  doc["Longitude"] = lng;
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["UV"]= uv;

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
 
  bool result = client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);

  if (result) {
    Serial.println("✅ MQTT publish สำเร็จ");
  } else {
    Serial.println("❌ MQTT publish ล้มเหลว");
  }
}

void setup() {
  uint8_t conf[4];
  Serial.begin(115200);
  Wire.begin(14, 15);
  preferences.begin("esp32cam", false);
  if (!si1151.Begin())
    Serial.println("Si1151 is not ready!");
  else
    Serial.println("Si1151 is ready!");
  ss.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin, false);
  Serial.println(TinyGPSPlus::libraryVersion());
  Serial.setDebugOutput(true);
  Serial.println();

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // if PSRAM IC present, init with UXGA resolution and higher JPEG quality
  //                      for larger pre-allocated frame buffer.
  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

#if defined(CAMERA_MODEL_ESP_EYE)
  pinMode(13, INPUT_PULLUP);
  pinMode(14, INPUT_PULLUP);
#endif

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t* s = esp_camera_sensor_get();
  // initial sensors are flipped vertically and colors are a bit saturated
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1);        // flip it back
    s->set_brightness(s, 1);   // up the brightness just a bit
    s->set_saturation(s, -2);  // lower the saturation
  }
  // drop down frame size for higher initial frame rate
  s->set_framesize(s, FRAMESIZE_QVGA);

#if defined(CAMERA_MODEL_M5STACK_WIDE) || defined(CAMERA_MODEL_M5STACK_ESP32CAM)
  s->set_vflip(s, 1);
  s->set_hmirror(s, 1);
#endif

  //  initMicroSDCard();
  wm.setConfigPortalBlocking(false);
  set_last_capture_millis(0);
  setupApp();

  //Turn off white light on device
  //  pinMode (LED_BUILTIN, OUTPUT);
  //  digitalWrite(LED_BUILTIN, LOW);

  //  take_send_photo();
  //  network();
  // สร้าง Task2 โดยใช้ฟังก์ชัน func2_Task()
  //network = function, Task1 = task variable, 10000 = stack size, NULL =
}




void network() {

  isLaunchedNetwork = true;
  bool res;

  //  Serial.print("network ssidChar = ");
  //  Serial.println(ssidChar);

  set_last_capture_millis(0);

  if (strcmp(ssidChar, "")) {
    Serial.println("use ssid saved");
    WiFi.begin(ssidChar, passwordChar);

    while (WiFi.status() != WL_CONNECTED) {
      takeAPhoto();
    }

  } else {
    String nameOfWiFiManager = "ESP32 Manager (" + webAppHostName + ")";
    res = wm.autoConnect(nameOfWiFiManager.c_str(), "password");
    if (!res) {
      Serial.println("Failed to connect");
    }
    //WiFi.status() = 255 != WL_CONNECTED
    //WiFi.status() = 3 = WL_CONNECTED
    while (WiFi.status() != WL_CONNECTED) {
      //      wm.autoConnect("ESP32 Manager", "password");
      //      Serial.println(WiFi.status());
      wm.process();
      takeAPhoto();
      delay(500);
    }
  }
  //wm.resetSettings();
  set_last_capture_millis(0);
  //  }

  //  Serial.println("");
  //  Serial.println("WiFi connected = ");
  //  Serial.println(WiFi.status());

  set_last_capture_millis(millis());
  startCameraServer();

  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");

  if (!MDNS.begin(webAppHostName.c_str())) {
    Serial.println("Error setting up MDNS responder!");
  }

  Serial.println("mDNS responder started");
  Serial.println("TCP server started");
  // Add service to MDNS-SD
  MDNS.addService("http", "tcp", 80);

  isConnectedNetwork = true;
  WiFi.SSID().toCharArray(ssidChar, 64);
  WiFi.psk().toCharArray(passwordChar, 64);
  Serial.print("ssidChar = ");
  Serial.println(ssidChar);
  Serial.print("passwordChar = ");
  Serial.println(passwordChar);
  // connectAWS();
}

void takeAPhoto() {

  current_millis = millis();
  if (current_millis - get_last_capture_millis() > get_capture_interval()) {
    if (WiFi.status() == WL_CONNECTED) {
      //    set_last_capture_millis(current_millis);
      
      //old code
      //take_send_photo_with_WiFi(WiFi.macAddress(), webAppHostName);
      
      //new code
      take_picture_store_only(webAppHostName);
      String imagename = preferences.getString("imagename", "none");

      connectAWS();
        if(client.connect(THINGNAME)){
            publishMessage(dayStamp, timeStamp, latt, lngg, humi, tempp, uv, imagename);
            Serial.println("ชื่อภาพล่าสุด: " + imagename);
            client.disconnect();
            if (!client.connected()){
              Serial.print("iot disconnect!!!!!!!!!!!");
            }
        }
    } else if (WiFi.status() != WL_CONNECTED) {
      //    set_last_capture_millis(current_millis);
      int id = get_last_images_id();
      id++;
      take_send_photo(id);
      set_last_images_id(id);
    }
    set_last_capture_millis(current_millis);
  }
}


void loop() {
  

  current_millis = millis();

  if (current_millis - last_capture_millis > 1000) {
    //  if(current_millis - get_last_capture_millis() > get_capture_interval()) {

    if (WiFi.status() != WL_CONNECTED && isConnectedNetwork) {
      Serial.print("WiFi.status() != WL_CONNECTED && isConnectedNetwork");
      Serial.println();
      isLaunchedNetwork = false;
    }

    if (WiFi.status() != WL_CONNECTED && !isLaunchedNetwork) {
      Serial.print("WiFi.status() != WL_CONNECTED && !isLaunchedNetwork");
      Serial.println();

      network();
    }

    // takeAPhoto();

    // Initialize a NTPClient to get time
    timeClient.begin();
    timeClient.setTimeOffset(25200);


    last_capture_millis = current_millis;
    //    set_last_capture_millis(current_millis);
    }

    while(!timeClient.update()) {
    timeClient.forceUpdate();
  }
  formattedDate = timeClient.getFormattedDate();
  //Serial.println(formattedDate);
  int splitT = formattedDate.indexOf("T");
  dayStamp = formattedDate.substring(0, splitT);
  timeStamp = formattedDate.substring(splitT+1, formattedDate.length()-1);

  humidity = sht.getHumidity();
  humi = String(humidity, 2);
  temp = sht.getTemperature();
  tempp = String(temp, 2);
  uv = si1151.ReadHalfWord_UV();
  lat = gps.location.lat();
  latt = String(lat, 6);
  lng = gps.location.lng();
  lngg = String(lng, 6);

  while (ss.available() > 0)
    if (gps.encode(ss.read())){
       //displayInfo();
    }

  // if (millis() > 5000 && gps.charsProcessed() < 10) {
  //   Serial.println(F("No GPS detected: check wiring."));
  //   while (true);
  // }
  takeAPhoto();

  client.loop();
}

void displayInfo() {
  if (gps.location.isValid() && gps.location.lat() == 0 && gps.location.lng() == 0 && (millis() - lastDisplayTime >= 5000)) {
    // Extract date
    Serial.print("DATE: ");
    Serial.println(dayStamp);
    Serial.print("HOUR: ");
    Serial.println(timeStamp);
    Serial.print(F("Location: "));
    Serial.print(F("You are in the building\n"));
    Serial.print("\ntemp: ");  // print readings
    Serial.print(temp);
    Serial.print("  humidity: ");
    Serial.println(humidity);
    Serial.print("IR: ");
    Serial.println(si1151.ReadHalfWord());
    Serial.print("VISIBLE: ");
    Serial.println(si1151.ReadHalfWord_VISIBLE());
    Serial.print("UV: ");
    Serial.println(si1151.ReadHalfWord_UV());
    lastDisplayTime = millis();
    Serial.println();
  }

  else if (gps.location.isValid() && (millis() - lastDisplayTime >= 5000)) {
    // Extract date
  Serial.print("DATE: ");
  Serial.println(dayStamp);
  Serial.print("HOUR: ");
  Serial.println(timeStamp);
    Serial.print(F("Location: "));
    Serial.print(gps.location.lat(), 6);
    Serial.print(F(", "));
    Serial.print(gps.location.lng(), 6);
    Serial.print("\ntemp: ");  // print readings
    Serial.print(temp);
    Serial.print("  humidity: ");
    Serial.println(humidity);
    Serial.print("IR: ");
    Serial.println(si1151.ReadHalfWord());
    Serial.print("VISIBLE: ");
    Serial.println(si1151.ReadHalfWord_VISIBLE());
    Serial.print("UV: ");
    Serial.println(si1151.ReadHalfWord_UV());
    lastDisplayTime = millis();
    Serial.println();
  } else {
    if (millis() - lastDisplayTime >= 5000){
      // Extract date
  Serial.print("DATE: ");
  Serial.println(dayStamp);
  Serial.print("HOUR: ");
  Serial.println(timeStamp);
      Serial.print(F("Location: "));
      Serial.print(F("You are in the building\n"));
      Serial.print("temp: ");  // print readings
      Serial.print(temp);
      Serial.print("  humidity: ");
      Serial.println(humidity);
      Serial.print("IR: ");
      Serial.println(si1151.ReadHalfWord());
      Serial.print("VISIBLE: ");
      Serial.println(si1151.ReadHalfWord_VISIBLE());
      Serial.print("UV: ");
      Serial.println(si1151.ReadHalfWord_UV());
      lastDisplayTime = millis();
      Serial.println();
    }
    
  }
}