import { fetchAllTrains } from 'amtrak';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import { VehicleRedisSchema } from './sharedTypes.js';
import log from 'loglevel';
import fs from 'fs';
import { koaSwagger, SwaggerOptions } from 'koa2-swagger-ui';
import path from 'path';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    route: string;
    headsign: string;
    status: string;
    speed: number;
    stop: string;
    updateTime: string;
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

let trainData: VehicleRedisSchema[] = [];

async function updateTrains() {
  const trains = await fetchAllTrains();
  const newTrainData: VehicleRedisSchema[] = [];

  for (const [, val] of Object.entries(trains)) {
    for (const train of val) {
      if (
        train.origName.includes('Boston') ||
        train.destName.includes('Boston') ||
        train.routeName.includes('Hartford') ||
        train.origName.includes('Pittsfield') ||
        train.destName.includes('Pittsfield') ||
        train.routeName.includes('Vermonter')
      ) {
        const updateTime = new Date(train.updatedAt);
        const trainRecord: VehicleRedisSchema = {
          action: 'update',
          current_status: train.trainState,
          direction_id: 0,
          id: train.trainID,
          latitude: train.lat,
          longitude: train.lon,
          route: train.routeName,
          update_time: updateTime.toISOString(),
          approximate_speed: false,
          speed: train.velocity,
          stop: train.eventName,
          headsign: `Amtrak ${train.routeName} from ${train.origName} to ${train.destName}`,
        };
        newTrainData.push(trainRecord);
      }
    }
  }

  trainData = newTrainData;
  log.info(`Updated ${trainData.length} trains`);
}

function createGeoJSON(): GeoJSONFeatureCollection {
  const features: GeoJSONFeature[] = trainData.map((train) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [train.longitude, train.latitude],
    },
    properties: {
      id: train.id,
      route: train.route,
      headsign: train.headsign,
      status: train.current_status,
      speed: train.speed,
      stop: train.stop,
      updateTime: train.update_time,
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
  };
}

async function main() {
  log.setDefaultLevel('INFO');

  const app = new Koa();
  const router = new Router();

  app.use(cors());

  // Load OpenAPI specification
  const openApiSpec = fs.readFileSync(
    path.join(process.cwd(), 'openapi.json'),
    'utf8',
  );

  const swaggerOptions: SwaggerOptions = {
    url: '/openapi.json',
  };

  // Configure Swagger UI
  app.use(koaSwagger({ swaggerOptions: swaggerOptions }));
  router.get('/', (ctx) => {
    ctx.redirect('/docs');
  });
  router.get('/docs', koaSwagger({ swaggerOptions: swaggerOptions }));
  router.get('/openapi.json', (ctx) => {
    ctx.body = openApiSpec;
    ctx.type = 'application/json';
  });

  router.get('/trains', (ctx) => {
    ctx.body = trainData;
    ctx.type = 'application/json';
  });

  router.get('/trains/geojson', (ctx) => {
    ctx.body = createGeoJSON();
    ctx.type = 'application/json';
  });

  router.get('/health', (ctx) => {
    ctx.body = {
      status: 'ok',
      lastUpdate: trainData.length > 0 ? trainData[0]?.update_time : null,
    };
    ctx.type = 'application/json';
  });

  app.use(router.routes()).use(router.allowedMethods());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    log.info(`Server running on port ${port}`);
  });

  await updateTrains();
  setInterval(updateTrains, 600000); // 10 min
}

await main();
