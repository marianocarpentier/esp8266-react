import React, { Component } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';

import {Typography, Box, Slider} from '@material-ui/core';
import { WEB_SOCKET_ROOT } from '../api';
import { WebSocketControllerProps, WebSocketFormLoader, WebSocketFormProps, webSocketController } from '../components';
import { SectionContent } from '../components';

import { ServoState } from './types';

export const SERVO_SETTINGS_WEBSOCKET_URL = WEB_SOCKET_ROOT + "servoState";

type ServoStateWebSocketControllerProps = WebSocketControllerProps<ServoState>;

class ServoStateWebSocketController extends Component<ServoStateWebSocketControllerProps> {

  render() {
    return (
      <SectionContent title='WebSocket Controller' titleGutter>
        <WebSocketFormLoader
          {...this.props}
          render={props => (
            <ServoStateWebSocketControllerForm {...props} />
          )}
        />
      </SectionContent>
    )
  }

}

export default webSocketController(SERVO_SETTINGS_WEBSOCKET_URL, 100, ServoStateWebSocketController);

type ServoStateWebSocketControllerFormProps = WebSocketFormProps<ServoState>;

function ServoStateWebSocketControllerForm(props: ServoStateWebSocketControllerFormProps) {
  const { data, saveData, setData } = props;

    const percentToAngle = (percent: number) => Math.round((180/100*percent));
    const angleToPercent = (angle: number) => Math.round((100/180*angle));

  return (
    <ValidatorForm onSubmit={saveData}>
      <Box bgcolor="primary.main" color="primary.contrastText" p={2} mt={2} mb={2}>
        <Typography variant="body1">
          The switch below controls the Servo via the WebSocket. It will automatically update whenever the LED state changes.
        </Typography>
      </Box>
        <Slider
            value={data.servo_percent??angleToPercent(data.servo_angle)}
            onChange={(e, newValue) => {
                const percent:number = Array.isArray(newValue) ? newValue[0] : newValue;
                const angle = percentToAngle(percent);
                // debugger;
                setData({
                    servo_angle: angle,
                    servo_percent: percent
                }, saveData);
            }}
            aria-labelledby="continuous-slider"
        />
    </ValidatorForm>
  );
}
