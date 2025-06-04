// Copyright 2015-2016 Espressif Systems (Shanghai) PTE LTD
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Default ESP32 Libraries (for create server http, camera)
#include "esp_http_server.h"
#include "esp_timer.h"
#include "esp_camera.h"
#include "img_converters.h"
#include "camera_index.h"
#include "Arduino.h"

// HTTP Post Libraries (for AWS)
#include "esp_http_client.h"
#include "Base64.h"
#include "mbedtls/base64.h"
#include <NTPClient.h>
#include <WiFiUdp.h>

// MicroSD Libraries
#include "FS.h"
#include "SD_MMC.h"
//#include "SD.h"
#include "SPI.h"

// Save parameter value permanently
#include <Preferences.h>

#include "fb_gfx.h"
#include "fd_forward.h"
#include "fr_forward.h"

String formattedDate1;
String dayStamp1;
String timeStamp1;
String imagename;

#define ENROLL_CONFIRM_TIMES 5
#define FACE_ID_SAVE_NUMBER 7

#define FACE_COLOR_WHITE  0x00FFFFFF
#define FACE_COLOR_BLACK  0x00000000
#define FACE_COLOR_RED    0x000000FF
#define FACE_COLOR_GREEN  0x0000FF00
#define FACE_COLOR_BLUE   0x00FF0000
#define FACE_COLOR_YELLOW (FACE_COLOR_RED | FACE_COLOR_GREEN)
#define FACE_COLOR_CYAN   (FACE_COLOR_BLUE | FACE_COLOR_GREEN)
#define FACE_COLOR_PURPLE (FACE_COLOR_BLUE | FACE_COLOR_RED)

typedef struct {
        size_t size; //number of values used for filtering
        size_t index; //current value index
        size_t count; //value count
        int sum;
        int * values; //array to be filled with values
} ra_filter_t;

typedef struct {
        httpd_req_t *req;
        size_t len;
} jpg_chunking_t;

#define PART_BOUNDARY "123456789000000000000987654321"
static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";

static ra_filter_t ra_filter;
httpd_handle_t stream_httpd = NULL;
httpd_handle_t camera_httpd = NULL;

static mtmn_config_t mtmn_config = {0};
static int8_t detection_enabled = 0;
static int8_t recognition_enabled = 0;
static int8_t is_enrolling = 0;
static face_id_list id_list = {0};

//custom variable
Preferences preferences;
static int8_t streamVideo_enabled = 1;
static String defaultEndPointPostImage = "https://xxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/";
static int defaultCaptureInterval = 60000;
static long last_capture_millis = 0;


void appendFile(fs::FS &fs, const char * path, const char * message);

static ra_filter_t * ra_filter_init(ra_filter_t * filter, size_t sample_size){
    memset(filter, 0, sizeof(ra_filter_t));

    filter->values = (int *)malloc(sample_size * sizeof(int));
    if(!filter->values){
        return NULL;
    }
    memset(filter->values, 0, sample_size * sizeof(int));

    filter->size = sample_size;
    return filter;
}

static int ra_filter_run(ra_filter_t * filter, int value){
    if(!filter->values){
        return value;
    }
    filter->sum -= filter->values[filter->index];
    filter->values[filter->index] = value;
    filter->sum += filter->values[filter->index];
    filter->index++;
    filter->index = filter->index % filter->size;
    if (filter->count < filter->size) {
        filter->count++;
    }
    return filter->sum / filter->count;
}

static void rgb_print(dl_matrix3du_t *image_matrix, uint32_t color, const char * str){
    fb_data_t fb;
    fb.width = image_matrix->w;
    fb.height = image_matrix->h;
    fb.data = image_matrix->item;
    fb.bytes_per_pixel = 3;
    fb.format = FB_BGR888;
    fb_gfx_print(&fb, (fb.width - (strlen(str) * 14)) / 2, 10, color, str);
}

static int rgb_printf(dl_matrix3du_t *image_matrix, uint32_t color, const char *format, ...){
    char loc_buf[64];
    char * temp = loc_buf;
    int len;
    va_list arg;
    va_list copy;
    va_start(arg, format);
    va_copy(copy, arg);
    len = vsnprintf(loc_buf, sizeof(loc_buf), format, arg);
    va_end(copy);
    if(len >= sizeof(loc_buf)){
        temp = (char*)malloc(len+1);
        if(temp == NULL) {
            return 0;
        }
    }
    vsnprintf(temp, len+1, format, arg);
    va_end(arg);
    rgb_print(image_matrix, color, temp);
    if(len > 64){
        free(temp);
    }
    return len;
}

static void draw_face_boxes(dl_matrix3du_t *image_matrix, box_array_t *boxes, int face_id){
    int x, y, w, h, i;
    uint32_t color = FACE_COLOR_YELLOW;
    if(face_id < 0){
        color = FACE_COLOR_RED;
    } else if(face_id > 0){
        color = FACE_COLOR_GREEN;
    }
    fb_data_t fb;
    fb.width = image_matrix->w;
    fb.height = image_matrix->h;
    fb.data = image_matrix->item;
    fb.bytes_per_pixel = 3;
    fb.format = FB_BGR888;
    for (i = 0; i < boxes->len; i++){
        // rectangle box
        x = (int)boxes->box[i].box_p[0];
        y = (int)boxes->box[i].box_p[1];
        w = (int)boxes->box[i].box_p[2] - x + 1;
        h = (int)boxes->box[i].box_p[3] - y + 1;
        fb_gfx_drawFastHLine(&fb, x, y, w, color);
        fb_gfx_drawFastHLine(&fb, x, y+h-1, w, color);
        fb_gfx_drawFastVLine(&fb, x, y, h, color);
        fb_gfx_drawFastVLine(&fb, x+w-1, y, h, color);
#if 0
        // landmark
        int x0, y0, j;
        for (j = 0; j < 10; j+=2) {
            x0 = (int)boxes->landmark[i].landmark_p[j];
            y0 = (int)boxes->landmark[i].landmark_p[j+1];
            fb_gfx_fillRect(&fb, x0, y0, 3, 3, color);
        }
#endif
    }
}

static int run_face_recognition(dl_matrix3du_t *image_matrix, box_array_t *net_boxes){
    dl_matrix3du_t *aligned_face = NULL;
    int matched_id = 0;

    aligned_face = dl_matrix3du_alloc(1, FACE_WIDTH, FACE_HEIGHT, 3);
    if(!aligned_face){
        //Serial.println("Could not allocate face recognition buffer");
        return matched_id;
    }
    if (align_face(net_boxes, image_matrix, aligned_face) == ESP_OK){
        if (is_enrolling == 1){
            int8_t left_sample_face = enroll_face(&id_list, aligned_face);

            if(left_sample_face == (ENROLL_CONFIRM_TIMES - 1)){
                //Serial.printf("Enrolling Face ID: %d\n", id_list.tail);
            }
            //Serial.printf("Enrolling Face ID: %d sample %d\n", id_list.tail, ENROLL_CONFIRM_TIMES - left_sample_face);
            rgb_printf(image_matrix, FACE_COLOR_CYAN, "ID[%u] Sample[%u]", id_list.tail, ENROLL_CONFIRM_TIMES - left_sample_face);
            if (left_sample_face == 0){
                is_enrolling = 0;
                //Serial.printf("Enrolled Face ID: %d\n", id_list.tail);
            }
        } else {
            matched_id = recognize_face(&id_list, aligned_face);
            if (matched_id >= 0) {
                //Serial.printf("Match Face ID: %u\n", matched_id);
                rgb_printf(image_matrix, FACE_COLOR_GREEN, "Hello Subject %u", matched_id);
            } else {
                //Serial.println("No Match Found");
                rgb_print(image_matrix, FACE_COLOR_RED, "Intruder Alert!");
                matched_id = -1;
            }
        }
    } else {
        //Serial.println("Face Not Aligned");
        //rgb_print(image_matrix, FACE_COLOR_YELLOW, "Human Detected");
    }

    dl_matrix3du_free(aligned_face);
    return matched_id;
}

static size_t jpg_encode_stream(void * arg, size_t index, const void* data, size_t len){
    jpg_chunking_t *j = (jpg_chunking_t *)arg;
    if(!index){
        j->len = 0;
    }
    if(httpd_resp_send_chunk(j->req, (const char *)data, len) != ESP_OK){
        return 0;
    }
    j->len += len;
    return len;
}

static esp_err_t capture_handler(httpd_req_t *req){
    camera_fb_t * fb = NULL;
    esp_err_t res = ESP_OK;
    int64_t fr_start = esp_timer_get_time();

    fb = esp_camera_fb_get();
    if (!fb) {
        //Serial.println("Camera capture failed");
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }

    httpd_resp_set_type(req, "image/jpeg");
    httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=capture.jpg");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");

    size_t out_len, out_width, out_height;
    uint8_t * out_buf;
    bool s;
    bool detected = false;
    int face_id = 0;
    if(!detection_enabled || fb->width > 400){
        size_t fb_len = 0;
        if(fb->format == PIXFORMAT_JPEG){
            fb_len = fb->len;
            res = httpd_resp_send(req, (const char *)fb->buf, fb->len);
        } else {
            jpg_chunking_t jchunk = {req, 0};
            res = frame2jpg_cb(fb, 80, jpg_encode_stream, &jchunk)?ESP_OK:ESP_FAIL;
            httpd_resp_send_chunk(req, NULL, 0);
            fb_len = jchunk.len;
        }
        esp_camera_fb_return(fb);
        int64_t fr_end = esp_timer_get_time();
        //Serial.printf("JPG: %uB %ums\n", (uint32_t)(fb_len), (uint32_t)((fr_end - fr_start)/1000));
        return res;
    }

    dl_matrix3du_t *image_matrix = dl_matrix3du_alloc(1, fb->width, fb->height, 3);
    if (!image_matrix) {
        esp_camera_fb_return(fb);
        //Serial.println("dl_matrix3du_alloc failed");
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }

    out_buf = image_matrix->item;
    out_len = fb->width * fb->height * 3;
    out_width = fb->width;
    out_height = fb->height;

    s = fmt2rgb888(fb->buf, fb->len, fb->format, out_buf);
    esp_camera_fb_return(fb);
    if(!s){
        dl_matrix3du_free(image_matrix);
        //Serial.println("to rgb888 failed");
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }

    box_array_t *net_boxes = face_detect(image_matrix, &mtmn_config);

    if (net_boxes){
        detected = true;
        if(recognition_enabled){
            face_id = run_face_recognition(image_matrix, net_boxes);
        }
        draw_face_boxes(image_matrix, net_boxes, face_id);
        free(net_boxes->score);
        free(net_boxes->box);
        free(net_boxes->landmark);
        free(net_boxes);
    }

    jpg_chunking_t jchunk = {req, 0};
    s = fmt2jpg_cb(out_buf, out_len, out_width, out_height, PIXFORMAT_RGB888, 90, jpg_encode_stream, &jchunk);
    dl_matrix3du_free(image_matrix);
    if(!s){
        //Serial.println("JPEG compression failed");
        return ESP_FAIL;
    }

    int64_t fr_end = esp_timer_get_time();
    //Serial.printf("FACE: %uB %ums %s%d\n", (uint32_t)(jchunk.len), (uint32_t)((fr_end - fr_start)/1000), detected?"DETECTED ":"", face_id);
    return res;
}

static esp_err_t stream_handler(httpd_req_t *req){
    camera_fb_t * fb = NULL;
    esp_err_t res = ESP_OK;
    size_t _jpg_buf_len = 0;
    uint8_t * _jpg_buf = NULL;
    char * part_buf[64];
    dl_matrix3du_t *image_matrix = NULL;
    bool detected = false;
    int face_id = 0;
    int64_t fr_start = 0;
    int64_t fr_ready = 0;
    int64_t fr_face = 0;
    int64_t fr_recognize = 0;
    int64_t fr_encode = 0;

    static int64_t last_frame = 0;
    if(!last_frame) {
        last_frame = esp_timer_get_time();
    }

    res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
    if(res != ESP_OK){
        return res;
    }

    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    
    if(streamVideo_enabled == 0){
      return ESP_FAIL;
    }
    
    while(true){
      if(streamVideo_enabled == 0){
        break;
      }
      //Serial.println("streamVideo_enabled = " + streamVideo_enabled);
//        if(streamVideo_enabled == 1){
          detected = false;
          face_id = 0;
          fb = esp_camera_fb_get();
          if (!fb) {
              //Serial.println("Camera capture failed");
              res = ESP_FAIL;
          } else {
              fr_start = esp_timer_get_time();
              fr_ready = fr_start;
              fr_face = fr_start;
              fr_encode = fr_start;
              fr_recognize = fr_start;
              if(!detection_enabled || fb->width > 400){
                  if(fb->format != PIXFORMAT_JPEG){
                      bool jpeg_converted = frame2jpg(fb, 80, &_jpg_buf, &_jpg_buf_len);
                      esp_camera_fb_return(fb);
                      fb = NULL;
                      if(!jpeg_converted){
                          //Serial.println("JPEG compression failed");
                          res = ESP_FAIL;
                      }
                  } else {
                      _jpg_buf_len = fb->len;
                      _jpg_buf = fb->buf;
                  }
              } else {
  
                  image_matrix = dl_matrix3du_alloc(1, fb->width, fb->height, 3);
  
                  if (!image_matrix) {
                      //Serial.println("dl_matrix3du_alloc failed");
                      res = ESP_FAIL;
                  } else {
                      if(!fmt2rgb888(fb->buf, fb->len, fb->format, image_matrix->item)){
                          //Serial.println("fmt2rgb888 failed");
                          res = ESP_FAIL;
                      } else {
                          fr_ready = esp_timer_get_time();
                          box_array_t *net_boxes = NULL;
                          if(detection_enabled){
                              net_boxes = face_detect(image_matrix, &mtmn_config);
                          }
                          fr_face = esp_timer_get_time();
                          fr_recognize = fr_face;
                          if (net_boxes || fb->format != PIXFORMAT_JPEG){
                              if(net_boxes){
                                  detected = true;
                                  if(recognition_enabled){
                                      face_id = run_face_recognition(image_matrix, net_boxes);
                                  }
                                  fr_recognize = esp_timer_get_time();
                                  draw_face_boxes(image_matrix, net_boxes, face_id);
                                  free(net_boxes->score);
                                  free(net_boxes->box);
                                  free(net_boxes->landmark);
                                  free(net_boxes);
                              }
                              if(!fmt2jpg(image_matrix->item, fb->width*fb->height*3, fb->width, fb->height, PIXFORMAT_RGB888, 90, &_jpg_buf, &_jpg_buf_len)){
                                  //Serial.println("fmt2jpg failed");
                                  res = ESP_FAIL;
                              }
                              esp_camera_fb_return(fb);
                              fb = NULL;
                          } else {
                              _jpg_buf = fb->buf;
                              _jpg_buf_len = fb->len;
                          }
                          fr_encode = esp_timer_get_time();
                      }
                      dl_matrix3du_free(image_matrix);
                  }
              }
          }
          if(res == ESP_OK){
              res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
          }
          if(res == ESP_OK){
              size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
              res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
          }
          if(res == ESP_OK){
              res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
          }
          if(fb){
              esp_camera_fb_return(fb);
              fb = NULL;
              _jpg_buf = NULL;
          } else if(_jpg_buf){
              free(_jpg_buf);
              _jpg_buf = NULL;
          }
          if(res != ESP_OK){
              break;
          }
          int64_t fr_end = esp_timer_get_time();
  
          int64_t ready_time = (fr_ready - fr_start)/1000;
          int64_t face_time = (fr_face - fr_ready)/1000;
          int64_t recognize_time = (fr_recognize - fr_face)/1000;
          int64_t encode_time = (fr_encode - fr_recognize)/1000;
          int64_t process_time = (fr_encode - fr_start)/1000;
          
          int64_t frame_time = fr_end - last_frame;
          last_frame = fr_end;
          frame_time /= 1000;
          uint32_t avg_frame_time = ra_filter_run(&ra_filter, frame_time);
//          //Serial.printf("MJPG: %uB %ums (%.1ffps), AVG: %ums (%.1ffps), %u+%u+%u+%u=%u %s%d\n",
//              (uint32_t)(_jpg_buf_len),
//              (uint32_t)frame_time, 1000.0 / (uint32_t)frame_time,
//              avg_frame_time, 1000.0 / avg_frame_time,
//              (uint32_t)ready_time, (uint32_t)face_time, (uint32_t)recognize_time, (uint32_t)encode_time, (uint32_t)process_time,
//              (detected)?"DETECTED ":"", face_id
//          );
//        }else{
//          res = ESP_OK;
//          break;
//        }

    }

    last_frame = 0;
    return res;
}


//cmd_handler old
static esp_err_t cmd_handler(httpd_req_t *req){
    char*  buf;
    size_t buf_len;
    char variable[32] = {0,};
    char value[70] = {0,};

    buf_len = httpd_req_get_url_query_len(req) + 1;
    if (buf_len > 1) {
        buf = (char*)malloc(buf_len);
        if(!buf){
            httpd_resp_send_500(req);
            return ESP_FAIL;
        }
        if (httpd_req_get_url_query_str(req, buf, buf_len) == ESP_OK) {
            if (httpd_query_key_value(buf, "var", variable, sizeof(variable)) == ESP_OK &&
                httpd_query_key_value(buf, "val", value, sizeof(value)) == ESP_OK) {
            } else {
                //Serial.printf("else 1");
                free(buf);
                httpd_resp_send_404(req);
                return ESP_FAIL;
            }
        } else {
            //Serial.printf("else 2");
            free(buf);
            httpd_resp_send_404(req);
            return ESP_FAIL;
        }
        free(buf);
    } else {
        //Serial.printf("else 3");
        httpd_resp_send_404(req);
        return ESP_FAIL;
    }
    int val;
    if(!strcmp(variable, "endpointPostImage")) {
      val = 0;
    }else{
      val = atoi(value);
    }
    
    
    sensor_t * s = esp_camera_sensor_get();
    int res = 0;

    if(!strcmp(variable, "framesize")) {
        if(s->pixformat == PIXFORMAT_JPEG) res = s->set_framesize(s, (framesize_t)val);
        preferences.putInt("framesizeImg", val);
    }else if(!strcmp(variable, "quality")) {
      res = s->set_quality(s, val);
      preferences.putInt("qualityImg", val);
    }else if(!strcmp(variable, "contrast")) res = s->set_contrast(s, val);
    else if(!strcmp(variable, "brightness")) res = s->set_brightness(s, val);
    else if(!strcmp(variable, "saturation")) res = s->set_saturation(s, val);
    else if(!strcmp(variable, "gainceiling")) res = s->set_gainceiling(s, (gainceiling_t)val);
    else if(!strcmp(variable, "colorbar")) res = s->set_colorbar(s, val);
    else if(!strcmp(variable, "awb")) res = s->set_whitebal(s, val);
    else if(!strcmp(variable, "agc")) res = s->set_gain_ctrl(s, val);
    else if(!strcmp(variable, "aec")) res = s->set_exposure_ctrl(s, val);
    else if(!strcmp(variable, "hmirror")) res = s->set_hmirror(s, val);
    else if(!strcmp(variable, "vflip")) res = s->set_vflip(s, val);
    else if(!strcmp(variable, "awb_gain")) res = s->set_awb_gain(s, val);
    else if(!strcmp(variable, "agc_gain")) res = s->set_agc_gain(s, val);
    else if(!strcmp(variable, "aec_value")) res = s->set_aec_value(s, val);
    else if(!strcmp(variable, "aec2")) res = s->set_aec2(s, val);
    else if(!strcmp(variable, "dcw")) res = s->set_dcw(s, val);
    else if(!strcmp(variable, "bpc")) res = s->set_bpc(s, val);
    else if(!strcmp(variable, "wpc")) res = s->set_wpc(s, val);
    else if(!strcmp(variable, "raw_gma")) res = s->set_raw_gma(s, val);
    else if(!strcmp(variable, "lenc")) res = s->set_lenc(s, val);
    else if(!strcmp(variable, "special_effect")) res = s->set_special_effect(s, val);
    else if(!strcmp(variable, "wb_mode")) res = s->set_wb_mode(s, val);
    else if(!strcmp(variable, "ae_level")) res = s->set_ae_level(s, val);
    else if(!strcmp(variable, "face_detect")) {
        detection_enabled = val;
        if(!detection_enabled) {
            recognition_enabled = 0;
        }
    }
    else if(!strcmp(variable, "face_enroll")) is_enrolling = val;
    else if(!strcmp(variable, "face_recognize")) {
        recognition_enabled = val;
        if(recognition_enabled){
            detection_enabled = val;
        }
    }else if(!strcmp(variable, "toggle-stream")) {
        streamVideo_enabled = val;
    }else if(!strcmp(variable, "endpointPostImage")) {
        preferences.putString("EPPostImg", String(value));
//        end_point_post_image = String(value);
    }else if(!strcmp(variable, "capture_interval")) {
        preferences.putInt("captInterval", val);
        last_capture_millis = millis();
    }
    else {
        res = -1;
    }

    if(res){
        return httpd_resp_send_500(req);
    }

    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    return httpd_resp_send(req, NULL, 0);
}


// new code

// === HANDLER: ส่งชื่อภาพล่าสุด ===
esp_err_t name_handler(httpd_req_t *req) {
    String imagenameNow = preferences.getString("imagename", "none.jpg");
    httpd_resp_set_type(req, "text/plain");
    return httpd_resp_send(req, imagenameNow.c_str(), imagenameNow.length());
}

// esp_err_t cmd_handler(httpd_req_t *req) {
//     char variable[32] = {0}, value[128] = {0};
//     size_t buf_len;

//     buf_len = httpd_req_get_url_query_len(req) + 1;
//     if (buf_len > 1) {
//         char *buf = (char *)malloc(buf_len);
//         if (!buf) return ESP_ERR_NO_MEM;
//         if (httpd_req_get_url_query_str(req, buf, buf_len) == ESP_OK) {
//             httpd_query_key_value(buf, "var", variable, sizeof(variable));
//             httpd_query_key_value(buf, "val", value, sizeof(value));
//         }
//         free(buf);
//     }

//     if (!strcmp(variable, "endpointPostImage")) {
//         preferences.putString("EPPostImg", String(value));
//     }

//     httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
//     httpd_resp_send(req, NULL, 0);
//     return ESP_OK;
// }


static esp_err_t status_handler(httpd_req_t *req){
    static char json_response[1024];

    sensor_t * s = esp_camera_sensor_get();
    char * p = json_response;
    *p++ = '{';
  
    p+=sprintf(p, "\"framesize\":%u,", s->status.framesize);
    p+=sprintf(p, "\"quality\":%u,", s->status.quality);
    p+=sprintf(p, "\"brightness\":%d,", s->status.brightness);
    p+=sprintf(p, "\"contrast\":%d,", s->status.contrast);
    p+=sprintf(p, "\"saturation\":%d,", s->status.saturation);
    p+=sprintf(p, "\"sharpness\":%d,", s->status.sharpness);
    p+=sprintf(p, "\"special_effect\":%u,", s->status.special_effect);
    p+=sprintf(p, "\"wb_mode\":%u,", s->status.wb_mode);
    p+=sprintf(p, "\"awb\":%u,", s->status.awb);
    p+=sprintf(p, "\"awb_gain\":%u,", s->status.awb_gain);
    p+=sprintf(p, "\"aec\":%u,", s->status.aec);
    p+=sprintf(p, "\"aec2\":%u,", s->status.aec2);
    p+=sprintf(p, "\"ae_level\":%d,", s->status.ae_level);
    p+=sprintf(p, "\"aec_value\":%u,", s->status.aec_value);
    p+=sprintf(p, "\"agc\":%u,", s->status.agc);
    p+=sprintf(p, "\"agc_gain\":%u,", s->status.agc_gain);
    p+=sprintf(p, "\"gainceiling\":%u,", s->status.gainceiling);
    p+=sprintf(p, "\"bpc\":%u,", s->status.bpc);
    p+=sprintf(p, "\"wpc\":%u,", s->status.wpc);
    p+=sprintf(p, "\"raw_gma\":%u,", s->status.raw_gma);
    p+=sprintf(p, "\"lenc\":%u,", s->status.lenc);
    p+=sprintf(p, "\"vflip\":%u,", s->status.vflip);
    p+=sprintf(p, "\"hmirror\":%u,", s->status.hmirror);
    p+=sprintf(p, "\"dcw\":%u,", s->status.dcw);
    p+=sprintf(p, "\"colorbar\":%u,", s->status.colorbar);
    p+=sprintf(p, "\"face_detect\":%u,", detection_enabled);
    p+=sprintf(p, "\"face_enroll\":%u,", is_enrolling);
    p+=sprintf(p, "\"face_recognize\":%u,", recognition_enabled);
    p+=sprintf(p, "\"end_point_post_image\": \"%s\",", preferences.getString("EPPostImg", defaultEndPointPostImage).c_str());
    p+=sprintf(p, "\"capture_interval\":%d", preferences.getInt("captInterval", 0));

    *p++ = '}';
    *p++ = 0;
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    return httpd_resp_send(req, json_response, strlen(json_response));
}

static esp_err_t index_handler(httpd_req_t *req){
    httpd_resp_set_type(req, "text/html");
    httpd_resp_set_hdr(req, "Content-Encoding", "gzip");
    sensor_t * s = esp_camera_sensor_get();
    if (s->id.PID == OV3660_PID) {
        return httpd_resp_send(req, (const char *)index_ov3660_html_gz, index_ov3660_html_gz_len);
    }
    return httpd_resp_send(req, (const char *)index_ov2640_html_gz, index_ov2640_html_gz_len);
}

void startCameraServer(){
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();

    httpd_uri_t index_uri = {
        .uri       = "/",
        .method    = HTTP_GET,
        .handler   = index_handler,
        .user_ctx  = NULL
    };

    httpd_uri_t status_uri = {
        .uri       = "/status",
        .method    = HTTP_GET,
        .handler   = status_handler,
        .user_ctx  = NULL
    };

    httpd_uri_t cmd_uri = {
        .uri       = "/control",
        .method    = HTTP_GET,
        .handler   = cmd_handler,
        .user_ctx  = NULL
    };

    httpd_uri_t capture_uri = {
        .uri       = "/capture",
        .method    = HTTP_GET,
        .handler   = capture_handler,
        .user_ctx  = NULL
    };

   httpd_uri_t stream_uri = {
        .uri       = "/stream",
        .method    = HTTP_GET,
        .handler   = stream_handler,
        .user_ctx  = NULL
    };
    //new code
    httpd_uri_t name_uri = {
        .uri       = "/imagename",
        .method    = HTTP_GET,
        .handler   = name_handler,
        .user_ctx  = NULL
    };


    ra_filter_init(&ra_filter, 20);
    
    mtmn_config.type = FAST;
    mtmn_config.min_face = 80;
    mtmn_config.pyramid = 0.707;
    mtmn_config.pyramid_times = 4;
    mtmn_config.p_threshold.score = 0.6;
    mtmn_config.p_threshold.nms = 0.7;
    mtmn_config.p_threshold.candidate_number = 20;
    mtmn_config.r_threshold.score = 0.7;
    mtmn_config.r_threshold.nms = 0.7;
    mtmn_config.r_threshold.candidate_number = 10;
    mtmn_config.o_threshold.score = 0.7;
    mtmn_config.o_threshold.nms = 0.7;
    mtmn_config.o_threshold.candidate_number = 1;
    
    face_id_init(&id_list, FACE_ID_SAVE_NUMBER, ENROLL_CONFIRM_TIMES);
    
    //Serial.printf("Starting web server on port: '%d'\n", config.server_port);
    if (httpd_start(&camera_httpd, &config) == ESP_OK) {
        httpd_register_uri_handler(camera_httpd, &index_uri);
        httpd_register_uri_handler(camera_httpd, &cmd_uri);
        httpd_register_uri_handler(camera_httpd, &status_uri);
        httpd_register_uri_handler(camera_httpd, &capture_uri);
        httpd_register_uri_handler(camera_httpd, &cmd_uri);
        httpd_register_uri_handler(camera_httpd, &name_uri);
    }

    config.server_port += 1;
    config.ctrl_port += 1;
    //Serial.printf("Starting stream server on port: '%d'\n", config.server_port);
    if (httpd_start(&stream_httpd, &config) == ESP_OK) {
        httpd_register_uri_handler(stream_httpd, &stream_uri);
    }

    preferences.begin("esp32", false);
//    preferences.putInt("captInterval", capture_interval);
}



//____________________________ Take Photo to AWS ____________________________

esp_err_t _http_event_handler(esp_http_client_event_t *evt)
{
  switch (evt->event_id) {
    case HTTP_EVENT_ERROR:
      //Serial.println("HTTP_EVENT_ERROR");
      break;
    case HTTP_EVENT_ON_CONNECTED:
      //Serial.println("HTTP_EVENT_ON_CONNECTED");
      break;
    case HTTP_EVENT_HEADER_SENT:
      //Serial.println("HTTP_EVENT_HEADER_SENT");
      break;
    case HTTP_EVENT_ON_HEADER:
//      //Serial.println();
//      //Serial.printf("HTTP_EVENT_ON_HEADER, key=%s, value=%s", evt->header_key, evt->header_value);
      break;
    case HTTP_EVENT_ON_DATA:
      //Serial.println();
      //Serial.printf("HTTP_EVENT_ON_DATA, len=%d", evt->data_len);
      if (!esp_http_client_is_chunked_response(evt->client)) {
        // Write out data
        // printf("%.*s", evt->data_len, (char*)evt->data);
      }
      break;
    case HTTP_EVENT_ON_FINISH:
      //Serial.println("");
      //Serial.println("HTTP_EVENT_ON_FINISH");
      break;
    case HTTP_EVENT_DISCONNECTED:
      //Serial.println("HTTP_EVENT_DISCONNECTED");
      break;
  }
  return ESP_OK;
}

//____________________________ Original Code ____________________________

esp_err_t take_send_photo_with_WiFi(String macAddressLocal, String DeviceID)
{
//  if(streamVideo_enabled == 1){
//    streamVideo_enabled = 0;
//  }
  //Serial.println("WiFi Taking picture...");
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
 
  fb = esp_camera_fb_get();
  /*if (!fb) {
    //Serial.println("Camera capture failed");
    return ESP_FAIL;
  }*/
  
   
  int image_buf_size = 4000 * 1000;                                                  
 uint8_t *image = (uint8_t *)ps_calloc(image_buf_size, sizeof(char));

 size_t length=fb->len;

 size_t olen;

 //Serial.print("length is ");
 //Serial.println(length);
 
 int err1 = mbedtls_base64_encode(image, image_buf_size, &olen, fb->buf, length);

 // const char* imageChar = (char*) image;
//  
 // int str_len = imageChar.length() + 1;
//  char image_char[str_len];
//  image.toCharArray(image_char, str_len);

  esp_http_client_handle_t http_client;
  
  esp_http_client_config_t config_client = {0};

   WiFiUDP ntpUDP;
   NTPClient timeClient(ntpUDP, "pool.ntp.org");
   timeClient.begin();
   //timeClient.update();
   timeClient.setTimeOffset(25200);
   while(!timeClient.update()) {
      timeClient.forceUpdate();
    }
    formattedDate1 = timeClient.getFormattedDate();
    //Serial.println(formattedDate);
    int splitT = formattedDate1.indexOf("T");
    dayStamp1 = formattedDate1.substring(0, splitT);
    timeStamp1 = formattedDate1.substring(splitT+1, formattedDate1.length()-1);
    timeStamp1 = timeStamp1.substring(0,2) + timeStamp1.substring(3,5) + timeStamp1.substring(6,8);
   String Time = "";
//   while(Time.length() < 10){
//    Time =  String(timeClient.getEpochTime());
//   }
   Time =  String("D"+dayStamp1+"T"+timeStamp1);
   //Time =  String(timeClient.getEpochTime());
   //Time =  String(timeClient.getEpochTime());
   imagename = DeviceID + Time;
   //imagename = Time;
   Serial.println(imagename);
   //String MAC = String(macAddressLocal);
//   String DeviceID = "openhousetu";
   //Serial.print("Time: " );  Serial.print(Time);
   //Serial.print("DeviceID: ");  Serial.print(DeviceID);
   //Serial.print(" MAC: ");  Serial.print(MAC);

   //old code
//   timestampFromDevice
   //String post_url2 = String(preferences.getString("EPPostImg", defaultEndPointPostImage)) + DeviceID + "/" + imagename; // Location where images are POSTED

  //new code
  String post_url2 = String(preferences.getString("EPPostImg", defaultEndPointPostImage));


//   //Serial.println("uuu = " + end_point_post_image);
   //Serial.println();
   Serial.println("Endpoint url = " + post_url2);
//   //Serial.println();
   char post_url3[post_url2.length() + 1];
   post_url2.toCharArray(post_url3, sizeof(post_url3));
  
  config_client.url = post_url3;
  config_client.event_handler = _http_event_handler;
  config_client.method = HTTP_METHOD_POST;

  http_client = esp_http_client_init(&config_client);

   esp_http_client_set_post_field(http_client, (const char *)fb->buf, fb->len);
  
  //old code
  esp_http_client_set_header(http_client, "Content-Type", "image/jpg");

  //new code
  esp_http_client_set_header(http_client, "X-Filename", imagename.c_str());

  esp_err_t err = esp_http_client_perform(http_client);
  if (err == ESP_OK) {
    //Serial.print("esp_http_client_get_status_code: ");
    //Serial.println(esp_http_client_get_status_code(http_client));
  }

  esp_http_client_cleanup(http_client);

  esp_camera_fb_return(fb);
}

//new code
//-----------------------------------------------------------------------

esp_err_t take_picture_store_only(String DeviceID) {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return ESP_FAIL;
  }

  // ตั้งชื่อภาพ
  WiFiUDP ntpUDP;
  NTPClient timeClient(ntpUDP, "pool.ntp.org");
  timeClient.begin();
  timeClient.setTimeOffset(25200);
  while(!timeClient.update()) timeClient.forceUpdate();

  String formattedDate = timeClient.getFormattedDate();
  int splitT = formattedDate.indexOf("T");
  String day = formattedDate.substring(0, splitT);
  String time = formattedDate.substring(splitT + 1);
  time = time.substring(0,2) + time.substring(3,5) + time.substring(6,8);
  String imageName = DeviceID + "D" + day + "T" + time;

  Serial.println("📸 Image taken: " + imageName);
  preferences.putString("imagename", imageName);

  esp_camera_fb_return(fb);
  return ESP_OK;  // เพิ่มบรรทัดนี้ให้ตรงกับ type ที่ประกาศไว้
}


//------------------------------------------------------------------------
esp_err_t take_send_photo(int num)
{
  //Serial.println("SD Card Taking picture...");

  uint8_t cardType = SD_MMC.cardType();
  if (cardType == CARD_NONE) {
    //Serial.println("No MicroSD Card found");
    return ESP_FAIL;
  }
 
  // Setup frame buffer
  camera_fb_t  * fb = esp_camera_fb_get();
 
  if (!fb) {
    //Serial.println("Camera capture failed");
    return ESP_FAIL;
  }
  
//  WiFiUDP ntpUDP;
//  NTPClient timeClient(ntpUDP, "pool.ntp.org");
//  timeClient.begin();
//  timeClient.update();
  String timestamp = "" + String(num);
//  while(timestamp.length() < 10){
//    timestamp =  String(timeClient.getEpochTime());
//  }

  String fileName = timestamp + ".jpg";
  String path = "/" + fileName;
  String newLineFileName = fileName + "\n";
  // appendFile(SD_MMC, "/log.txt", newLineFileName.c_str());
  
  // Save picture to microSD card
  fs::FS &fs = SD_MMC;
//  
  // File file = fs.open(path.c_str(), FILE_WRITE);
  // if (!file) {
  //   //Serial.println("Failed to open file in write mode");
  // }
  // else {
  //   file.write(fb->buf, fb->len); // payload (image), payload length
  //   //Serial.printf("Saved file to path: %s\n", path.c_str());
  // }
  // Close the file
  // file.close();
 
  // Return the frame buffer back to the driver for reuse
  esp_camera_fb_return(fb);
}

//____________________________ Customize Code ____________________________

// esp_err_t get_presigned_url(String &presigned_url, String object_name) {
//     // สร้าง URL พร้อม query parameter ที่ต้องการ
//     // String url = "https://mx6r1gha82.execute-api.us-east-1.amazonaws.com/createpresignedurl?object_name=" + object_name; // ใช้ object_name เท่านั้น

//     esp_http_client_config_t config = {};
//     String url = "https://mx6r1gha82.execute-api.us-east-1.amazonaws.com/createpresignedurl?object_name=" + object_name; // ใช้ object_name
//     config.url = url.c_str();  // แปลง String เป็น const char*
//     config.method = HTTP_METHOD_GET;
//     Serial.println(config.url);


//     esp_http_client_handle_t client = esp_http_client_init(&config);
//     esp_err_t err = esp_http_client_perform(client);

//     if (err == ESP_OK) {
//         // อ่าน presigned URL จาก body ของ response
//         char buffer[256];
//         int content_length = esp_http_client_read(client, buffer, sizeof(buffer) - 1);
        
//         if (content_length > 0) {
//             buffer[content_length] = '\0';  // เติม null terminator เพื่อสร้างสตริงที่ถูกต้อง
//             presigned_url = String(buffer); // เก็บ URL ที่อ่านได้ลงใน presigned_url
//             Serial.println(presigned_url);

//         } else {
//             esp_http_client_cleanup(client);
//             return ESP_FAIL;  // ถ้าอ่านไม่ได้หรือ response ไม่มีข้อมูล
//         }
//     } else {
//         // การจัดการข้อผิดพลาดกรณีเชื่อมต่อหรือเรียก request ไม่สำเร็จ
//         esp_http_client_cleanup(client);
//         return ESP_FAIL;
//     }

//     esp_http_client_cleanup(client);
//     return ESP_OK;
// }

// esp_err_t take_send_photo_with_WiFi(String macAddressLocal, String DeviceID) {
//     camera_fb_t * fb = NULL;
//     esp_err_t res = ESP_OK;
//     Serial.println("Start capture!!!");

//     // ถ่ายภาพ
//     fb = esp_camera_fb_get();
//     if (!fb) {
//         Serial.println("Camera capture failed");
//         return ESP_FAIL;
//     }

//     // สร้างชื่อไฟล์จาก timestamp
//     WiFiUDP ntpUDP;
//     NTPClient timeClient(ntpUDP, "pool.ntp.org");
//     timeClient.begin();
//     timeClient.setTimeOffset(25200); // Time offset for your time zone
//     while(!timeClient.update()) {
//         timeClient.forceUpdate();
//     }
    
//     String timestamp = timeClient.getFormattedDate(); // สร้าง timestamp
//     timestamp.replace(":", "");  // ลบเครื่องหมาย : ออกจาก timestamp เพื่อทำเป็นชื่อไฟล์
//     String object_name = DeviceID + "_" + timestamp + ".jpg";  // สร้างชื่อไฟล์ภาพ

//     // เรียกฟังก์ชัน get_presigned_url เพื่อรับ URL สำหรับอัปโหลด
//     String presigned_url; // สร้างตัวแปรสำหรับเก็บ Presigned URL
//     if (get_presigned_url(presigned_url, object_name) != ESP_OK) {
//         Serial.println("Failed to get presigned URL");
//         esp_camera_fb_return(fb);  // คืนพื้นที่หน่วยความจำ
//         return ESP_FAIL;
//     }
// //-------------------------------------------------------
//     // ตั้งค่า HTTP client เพื่อส่งภาพไปยัง presigned URL
//     esp_http_client_config_t config_client = {0};  // กำหนดค่าเริ่มต้นให้เป็น 0
//     config_client.url = presigned_url.c_str();
//     config_client.method = HTTP_METHOD_PUT; 

    
//     esp_http_client_handle_t http_client = esp_http_client_init(&config_client);
//     // กำหนดเนื้อหาที่ส่งและหัวข้อของ HTTP Request
//     esp_http_client_set_post_field(http_client, (const char *)fb->buf, fb->len);
//     esp_http_client_set_header(http_client, "Content-Type", "image/jpeg");

//     // ส่งภาพไปยัง Presigned URL
//     esp_err_t err = esp_http_client_perform(http_client);
//     if (err == ESP_OK) {
//         Serial.println("Image uploaded successfully.");
//     } else {
//         Serial.printf("Error in uploading: %d\n", err);
//     }

//     esp_http_client_cleanup(http_client);
//     esp_camera_fb_return(fb);

//     return err;
// }

//____________________________ SD Card ____________________________

void initMicroSDCard() {
  // Start the MicroSD card

  //Serial.println("Mounting MicroSD Card");
  if (!SD_MMC.begin()) {
    //Serial.println("MicroSD Card Mount Failed");
    return;
  }
  uint8_t cardType = SD_MMC.cardType();
  if (cardType == CARD_NONE) {
    //Serial.println("No MicroSD Card found");
    return;
  }

  //Serial.println("MicroSD Card Mount Successful!");

//  int qualityImg = preferences.getInt("qualityImg", 0);
  sensor_t * s = esp_camera_sensor_get();
  s->set_quality(s, 10);

}

//____________________________ Setup ____________________________
void setupApp(){
  initMicroSDCard();
  preferences.begin("esp32", false);

//  int qualityImg = preferences.getInt("qualityImg", 0);
//  sensor_t * s = esp_camera_sensor_get();
//  s->set_quality(s, 10);
  sensor_t * s = esp_camera_sensor_get();
  int framesizeImg = preferences.getInt("framesizeImg", 0);
  s->set_framesize(s, (framesize_t)framesizeImg);
}

//____________________________ Getter & Setter ____________________________

void set_last_capture_millis(long mills){
  last_capture_millis = mills;
}

long get_last_capture_millis(){
  return last_capture_millis;
}

int get_capture_interval(){
  return preferences.getInt("captInterval", defaultCaptureInterval);
}

void set_last_images_id(int id){
  preferences.putInt("lastImgID", id);
}

int get_last_images_id(){
  return preferences.getInt("lastImgID", 0);
}
