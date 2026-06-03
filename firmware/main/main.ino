#include <WiFi.h>
#include <TFT_eSPI.h>
#include <lvgl.h>

// ===== DATOS WIFI =====
const char* ssid      = "DIGIFIBRA-YFAu";
const char* password  = "keEzh99K62Pf";
// ======================

TFT_eSPI tft = TFT_eSPI();

// LVGL draw buffer
static lv_disp_draw_buf_t draw_buf;
static lv_color_t *buf1 = NULL;

// UI objects
static lv_obj_t *label_title;
static lv_obj_t *chart;
static lv_chart_series_t *chart_ser;

// Mock sensor values
float temp = 22.5;
float hum = 50.0;
int co2 = 420;

unsigned long lastUpdate = 0;
const unsigned long UPDATE_INTERVAL = 2000;

int scr_w = 0;
int scr_h = 0;

// LVGL flush callback using TFT_eSPI
void my_disp_flush(lv_disp_drv_t *disp, const lv_area_t *area, lv_color_t *color_p) {
  int32_t x1 = area->x1;
  int32_t y1 = area->y1;
  int32_t x2 = area->x2;
  int32_t y2 = area->y2;
  int32_t w = (x2 - x1 + 1);
  int32_t h = (y2 - y1 + 1);

  tft.startWrite();
  tft.setAddrWindow(x1, y1, w, h);
  tft.pushColors((uint16_t*)color_p, w * h, true);
  tft.endWrite();

  lv_disp_flush_ready(disp);
}

void init_lvgl_ui() {
  lv_init();

  // allocate draw buffer (40 lines)
  int buf_lines = scr_w * 40;
  buf1 = (lv_color_t*)malloc(sizeof(lv_color_t) * buf_lines);
  lv_disp_draw_buf_init(&draw_buf, buf1, NULL, buf_lines);

  static lv_disp_drv_t disp_drv;
  lv_disp_drv_init(&disp_drv);
  disp_drv.hor_res = scr_w;
  disp_drv.ver_res = scr_h;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;
  lv_disp_drv_register(&disp_drv);

  // basic UI
  label_title = lv_label_create(lv_scr_act());
  lv_label_set_text(label_title, "SmartHome (LVGL)");
  lv_obj_align(label_title, LV_ALIGN_TOP_LEFT, 8, 4);

  chart = lv_chart_create(lv_scr_act());
  lv_obj_set_size(chart, scr_w - 16, 80);
  lv_obj_align(chart, LV_ALIGN_TOP_MID, 0, 28);
  lv_chart_set_type(chart, LV_CHART_TYPE_LINE);
  lv_chart_set_range(chart, 0, 500); // temperature *10
  chart_ser = lv_chart_add_series(chart, lv_palette_main(LV_PALETTE_RED), LV_CHART_AXIS_PRIMARY_Y);
  for (int i = 0; i < 30; i++) lv_chart_set_next_value(chart, chart_ser, (int)(temp * 10));
}

void setup() {
  Serial.begin(115200);
  tft.init();
  tft.setRotation(1);
  scr_w = tft.width();
  scr_h = tft.height();

  // try connecting WiFi briefly
  WiFi.begin(ssid, password);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 2000) delay(50);

  init_lvgl_ui();
}

void loop() {
  // LVGL tick and handler
  lv_timer_handler();
  delay(5);

  unsigned long now = millis();
  if (now - lastUpdate >= UPDATE_INTERVAL) {
    lastUpdate = now;

    // update mock sensor values
    temp += (random(-20, 21)) / 100.0;
    if (temp < -10) temp = -10;
    if (temp > 50) temp = 50;

    hum += (random(-50, 51)) / 100.0;
    if (hum < 0) hum = 0;
    if (hum > 100) hum = 100;

    co2 += random(-10, 11);
    if (co2 < 300) co2 = 300;

    // push new value into chart (temperature *10)
    lv_chart_set_next_value(chart, chart_ser, (int)(temp * 10));
  }
}