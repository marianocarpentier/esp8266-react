#ifndef ServoStateService_h
#define ServoStateService_h

#include <ServoMqttSettingsService.h>
#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketTxRx.h>
#include <Servo.h>

#define SERVO_PIN D2

#define DEFAULT_SERVO_ANGLE 90

#define SERVO_SETTINGS_ENDPOINT_PATH "/rest/servoState"
#define SERVO_SETTINGS_SOCKET_PATH "/ws/servoState"

class ServoState {
 public:
  Servo servo;
  int servoAngle;

  static void read(ServoState& settings, JsonObject& root) {
    Serial.write("\nCurrent angle: "+settings.servoAngle);
    root["servo_angle"] = settings.servoAngle;
  }

  static StateUpdateResult update(JsonObject& root, ServoState& servoState) {
    int newState = root["servo_angle"] | DEFAULT_SERVO_ANGLE;
    if (servoState.servoAngle != newState) {
      servoState.servoAngle = newState;
      String jsonStr;
      serializeJson(root, jsonStr);
      Serial.write("\nChanged ");
      Serial.print( jsonStr);
      return StateUpdateResult::CHANGED;
    }
    Serial.write("\nUnchanged");
    return StateUpdateResult::UNCHANGED;
  }

  static void haRead(ServoState& settings, JsonObject& root) {
    root["servo_angle"] = settings.servoAngle;
  }

  static StateUpdateResult haUpdate(JsonObject& root, ServoState& servoState) {
    Serial.write("\nhaUpdated\n");
    String jsonStr;
    serializeJson(root, jsonStr);
    Serial.print(jsonStr);
    Serial.write("\n");
    int requestedAngle = root["servo_angle"];
    int newAngle = -1;
    if (requestedAngle >= 0 && requestedAngle <= 180) {
      Serial.write("\nServo Angle\n"+requestedAngle);
      newAngle = requestedAngle;
    } else {
      Serial.write("\nServo Angle Error\n");
      return StateUpdateResult::ERROR;
    }
    // change the new state, if required
    if (servoState.servoAngle != newAngle) {
      servoState.servoAngle = newAngle;
      String jsonStr2;
      serializeJson(root, jsonStr2);
      Serial.write("\nChanged ");
      Serial.print( jsonStr2);
      return StateUpdateResult::CHANGED;
    }
    return StateUpdateResult::UNCHANGED;
  }
};

class ServoStateService : public StatefulService<ServoState> {
 public:
  ServoStateService(AsyncWebServer* server,
                    SecurityManager* securityManager,
                    AsyncMqttClient* mqttClient,
                    ServoMqttSettingsService* servoMqttSettingsService);
  void begin();

 private:
  HttpEndpoint<ServoState> _httpEndpoint;
  MqttPubSub<ServoState> _mqttPubSub;
  WebSocketTxRx<ServoState> _webSocket;
  AsyncMqttClient* _mqttClient;
  ServoMqttSettingsService* _servoMqttSettingsService;

  void registerConfig();
  void onConfigUpdated();
};

#endif
