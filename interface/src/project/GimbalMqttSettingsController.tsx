import React, { Component } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import { Typography, Box } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { ENDPOINT_ROOT } from '../api';
import { restController, RestControllerProps, RestFormLoader, RestFormProps, FormActions, FormButton, SectionContent } from '../components';

import { MqttSettings } from './types';

export const SERVO_BROKER_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "brokerSettingsServo";

type ServoMqttSettingsControllerProps = RestControllerProps<MqttSettings>;

class GimbalMqttSettingsController extends Component<ServoMqttSettingsControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title='MQTT Controller' titleGutter>
        <RestFormLoader
          {...this.props}
          render={props => (
            <ServoMqttSettingsControllerForm {...props} />
          )}
        />
      </SectionContent>
    )
  }

}

export default restController(SERVO_BROKER_SETTINGS_ENDPOINT, GimbalMqttSettingsController);

type ServoMqttSettingsControllerFormProps = RestFormProps<MqttSettings>;

function ServoMqttSettingsControllerForm(props: ServoMqttSettingsControllerFormProps) {
  const { data, saveData, handleValueChange } = props;
  return (
    <ValidatorForm onSubmit={saveData}>
      <Box bgcolor="primary.main" color="primary.contrastText" p={2} mt={2} mb={2}>
        <Typography variant="body1">
          The LED is controllable via MQTT with the demo project designed to work with Home Assistant's auto discovery feature.
        </Typography>
      </Box>
      <TextValidator
        validators={['required']}
        errorMessages={['Unique ID is required']}
        name="unique_id"
        label="Unique ID"
        fullWidth
        variant="outlined"
        value={data.unique_id}
        onChange={handleValueChange('unique_id')}
        margin="normal"
      />
      <TextValidator
        validators={['required']}
        errorMessages={['Name is required']}
        name="name"
        label="Name"
        fullWidth
        variant="outlined"
        value={data.name}
        onChange={handleValueChange('name')}
        margin="normal"
      />
      <TextValidator
        validators={['required']}
        errorMessages={['MQTT Path is required']}
        name="mqtt_path"
        label="MQTT Path"
        fullWidth
        variant="outlined"
        value={data.mqtt_path}
        onChange={handleValueChange('mqtt_path')}
        margin="normal"
      />
      <FormActions>
        <FormButton startIcon={<SaveIcon />} variant="contained" color="primary" type="submit">
          Save
        </FormButton>
      </FormActions>
    </ValidatorForm>
  );
}
