import express from 'express';
import { Controller, Route } from './types';


export const registerEndpoints = (controllers: Controller[] = [], app: express.Application) => {
  controllers.forEach(controller => {
    controller.routing.forEach((route: Route) => {
      app[route.method](route.path, route.handler.bind(controller));
    });
  });
};
