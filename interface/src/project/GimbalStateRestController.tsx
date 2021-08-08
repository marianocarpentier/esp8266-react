import React, { Component } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { Typography, Box, Slider } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { ENDPOINT_ROOT } from '../api';
import { restController, RestControllerProps, RestFormLoader, RestFormProps, FormActions, FormButton, SectionContent, BlockFormControlLabel } from '../components';

import { ServoState } from './types';

export const SERVO_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "servoState";

type ServoStateRestControllerProps = RestControllerProps<ServoState>;

class ServoStateRestController extends Component<ServoStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title='REST Servo Controller' titleGutter>
        <RestFormLoader
          {...this.props}
          render={props => (
            <ServoStateRestControllerForm {...props} />
          )}
        />
      </SectionContent>
    )
  }

}

export default restController(SERVO_SETTINGS_ENDPOINT, ServoStateRestController);

type ServoStateRestControllerFormProps = RestFormProps<ServoState>;

function ServoStateRestControllerForm(props: ServoStateRestControllerFormProps) {
  const { data, saveData, setData } = props;
  const percentToAngle = (percent: number) => Math.round((180/100*percent));
  const angleToPercent = (angle: number) => Math.round((100/180*angle));

  return (
    <ValidatorForm onSubmit={saveData}>
      <Box bgcolor="primary.main" color="primary.contrastText" p={2} mt={2} mb={2}>
        <Typography variant="body1">
          The form below controls the Servo via the RESTful service exposed by the ESP device.
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
              });
          }}
          aria-labelledby="continuous-slider"
      />
      <FormActions>
        <FormButton startIcon={<SaveIcon />} variant="contained" color="primary" type="submit">
          Save
        </FormButton>
      </FormActions>
    </ValidatorForm>
  );
}
