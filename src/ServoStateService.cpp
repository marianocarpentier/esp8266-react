#include <ServoStateService.h>

ServoStateService::ServoStateService(AsyncWebServer* server, 
                                     SecurityManager* securityManager,
                                     AsyncMqttClient* mqttClient,
                                     ServoMqttSettingsService* servoMqttSettingsService) :
    _httpEndpoint(ServoState::read,
                  ServoState::update,
                  this,
                  server,
                  SERVO_SETTINGS_ENDPOINT_PATH),
    _mqttPubSub(ServoState::haRead, ServoState::haUpdate, this, mqttClient),
    _webSocket(ServoState::read,
               ServoState::update,
               this,
               server,
               SERVO_SETTINGS_SOCKET_PATH,
               securityManager,
               AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttClient(mqttClient),
    _servoMqttSettingsService(servoMqttSettingsService) {

  // configure servo's output
  _state.servo.attach(SERVO_PIN); 

  // configure MQTT callback
  _mqttClient->onConnect(std::bind(&ServoStateService::registerConfig, this));

  // configure update handler for when the servo settings change
  _servoMqttSettingsService->addUpdateHandler([&](const String& originId) { registerConfig(); }, false);

  // configure settings service update handler to update servo state
  addUpdateHandler([&](const String& originId) { onConfigUpdated(); }, false);
}

void ServoStateService::begin() {
  _state.servoAngle = DEFAULT_SERVO_ANGLE;
  onConfigUpdated();
}

void ServoStateService::onConfigUpdated() {
  _state.servo.write(_state.servoAngle);
}

void ServoStateService::registerConfig() {
  if (!_mqttClient->connected()) {
    return;
  }
  String configTopic;
  String subTopic;
  String pubTopic;

  DynamicJsonDocument doc(256);
  _servoMqttSettingsService->read([&](ServoMqttSettings& settings) {
    configTopic = settings.mqttPath + "/config";
    subTopic = settings.mqttPath + "/set";
    pubTopic = settings.mqttPath + "/state";
    doc["~"] = settings.mqttPath;
    doc["name"] = settings.name;
    doc["unique_id"] = settings.uniqueId;
  });
  doc["cmd_t"] = "~/set";
  doc["stat_t"] = "~/state";
  doc["schema"] = "json";
  doc["brightness"] = false;

  String payload;
  serializeJson(doc, payload);
  _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());

  _mqttPubSub.configureTopics(pubTopic, subTopic);
}
