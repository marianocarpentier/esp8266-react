export interface LightState {
  led_on: boolean;
}

export interface ServoState {
  servo_angle: number;
  servo_percent: number;
}

export interface MqttSettings {
  unique_id : string;
  name: string;
  mqtt_path : string;
}