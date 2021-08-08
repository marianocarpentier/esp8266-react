#include <ServoMqttSettingsService.h>

ServoMqttSettingsService::ServoMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    _httpEndpoint(ServoMqttSettings::read,
                  ServoMqttSettings::update,
                  this,
                  server,
                  SERVO_BROKER_SETTINGS_PATH,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _fsPersistence(ServoMqttSettings::read, ServoMqttSettings::update, this, fs, SERVO_BROKER_SETTINGS_FILE) {
}

void ServoMqttSettingsService::begin() {
  _fsPersistence.readFromFS();
}
