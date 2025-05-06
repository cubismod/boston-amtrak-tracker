/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface ScheduleEvent {
  action: string;
  time: string;
  route_id: string;
  route_type: number;
  headsign: string;
  stop: string;
  id: string;
  transit_time_min: number;
  trip_id?: string | null;
  alerting?: boolean;
  bikes_allowed?: boolean;
}
export interface VehicleRedisSchema {
  action: string;
  id: string;
  current_status: string;
  direction_id: number;
  latitude: number;
  longitude: number;
  speed?: number | null;
  stop?: string | null;
  route: string;
  update_time: string;
  approximate_speed?: boolean;
  occupancy_status?: string | null;
}
