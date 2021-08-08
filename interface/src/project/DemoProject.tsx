import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { PROJECT_PATH } from '../api';
import { MenuAppBar } from '../components';
import { AuthenticatedRoute } from '../authentication';

import DemoInformation from './DemoInformation';
import GimbalStateRestController from "./GimbalStateRestController";
import LightStateRestController from './LightStateRestController';
import LightStateWebSocketController from './LightStateWebSocketController';
import LightMqttSettingsController from './LightMqttSettingsController';
import GimbalMqttSettingsController from './GimbalMqttSettingsController';
import GimbalStateWebSocketController from "./GimbalStateWebSocketController";

class DemoProject extends Component<RouteComponentProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <MenuAppBar sectionTitle="Demo Project">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          <Tab value={`/${PROJECT_PATH}/information`} label="Information" />
          <Tab value={`/${PROJECT_PATH}/gimbal`} label="Gimbal" />
          <Tab value={`/${PROJECT_PATH}/gimbal-socket`} label="Gimbal Socket" />
          <Tab value={`/${PROJECT_PATH}/rest`} label="REST Controller" />
          <Tab value={`/${PROJECT_PATH}/socket`} label="WebSocket Controller" />
          <Tab value={`/${PROJECT_PATH}/light-mqtt`} label="MQTT Controller" />
          <Tab value={`/${PROJECT_PATH}/gimbal-mqtt`} label="Gimbal MQTT Controller" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/information`} component={DemoInformation} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/gimbal`} component={GimbalStateRestController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/gimbal-socket`} component={GimbalStateWebSocketController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/rest`} component={LightStateRestController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/socket`} component={LightStateWebSocketController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/light-mqtt`} component={LightMqttSettingsController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/gimbal-mqtt`} component={GimbalMqttSettingsController} />
          <Redirect to={`/${PROJECT_PATH}/information`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default DemoProject;
