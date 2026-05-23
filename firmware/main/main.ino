#include <WiFi.h>

// ===== DATOS WIFI =====
const char* ssid      = "DIGIFIBRA-YFAu";
const char* password  = "keEzh99K62Pf";
// ======================

#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

void setup() {

  tft.init();

  tft.fillScreen(TFT_BLACK);

  tft.setTextColor(TFT_GREEN);

  tft.setTextSize(2);

  tft.drawString("Pantalla OK", 40, 100);
}

void loop() {

}