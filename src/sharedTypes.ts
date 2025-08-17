/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type TrackAssignmentType = "historical" | "predicted";

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
  track_number?: string | null;
  track_confidence?: number | null;
  show_on_display?: boolean;
}
/**
 * Historical track assignment data for analysis
 */
export interface TrackAssignment {
  station_id: string;
  route_id: string;
  trip_id: string;
  headsign: string;
  direction_id: number;
  assignment_type: TrackAssignmentType;
  track_number?: string | null;
  scheduled_time: string;
  actual_time?: string | null;
  recorded_time: string;
  day_of_week: number;
  hour: number;
  minute: number;
}
/**
 * Track prediction for a specific trip
 */
export interface TrackPrediction {
  station_id: string;
  route_id: string;
  trip_id: string;
  headsign: string;
  direction_id: number;
  scheduled_time: string;
  track_number?: string | null;
  confidence_score: number;
  prediction_method: string;
  historical_matches: number;
  created_at: string;
}
/**
 * Statistics for track predictions to monitor accuracy
 */
export interface TrackPredictionStats {
  station_id: string;
  route_id: string;
  total_predictions: number;
  correct_predictions: number;
  accuracy_rate: number;
  last_updated: string;
  prediction_counts_by_track: {
    [k: string]: number;
  };
  average_confidence: number;
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
  carriages?: string[] | null;
  headsign?: string | null;
}
