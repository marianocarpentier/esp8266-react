#ifndef ServoMqttSettingsService_h
#define ServoMqttSettingsService_h

#include <HttpEndpoint.h>
#include <FSPersistence.h>
#include <SettingValue.h>

#define SERVO_BROKER_SETTINGS_FILE "/config/brokerSettingsServo.json"
#define SERVO_BROKER_SETTINGS_PATH "/rest/brokerSettingsServo"

class ServoMqttSettings {
 public:
  String mqttPath;
  String name;
  String uniqueId;

  static void read(ServoMqttSettings& settings, JsonObject& root) {
    root["mqtt_path"] = settings.mqttPath;
    root["name"] = settings.name;
    root["unique_id"] = settings.uniqueId;
  }

  static StateUpdateResult update(JsonObject& root, ServoMqttSettings& settings) {
    settings.mqttPath = root["mqtt_path"] | SettingValue::format("homeassistant/servo/#{unique_id}");
    settings.name = root["name"] | SettingValue::format("servo-#{unique_id}");
    settings.uniqueId = root["unique_id"] | SettingValue::format("servo-#{unique_id}");
    return StateUpdateResult::CHANGED;
  }
};

class ServoMqttSettingsService : public StatefulService<ServoMqttSettings> {
 public:
  ServoMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  void begin();

 private:
  HttpEndpoint<ServoMqttSettings> _httpEndpoint;
  FSPersistence<ServoMqttSettings> _fsPersistence;
};

#endif  // end ServoMqttSettingsService_h
