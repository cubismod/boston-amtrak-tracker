import { fetchAllTrains } from 'amtrak';
import { createClient } from 'redis';
import { VehicleRedisSchema } from './sharedTypes.js';

async function getTrains() {
  const client = await createClient({
    url: process.env.BT_REDIS_URL,
    password: process.env.BT_REDIS_PASSWORD,
  })
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

  const trains = await fetchAllTrains();
  for (const [, val] of Object.entries(trains)) {
    for (const train of val) {
      if (
        train.origName.includes('Boston') ||
        train.destName.includes('Boston')
      ) {
        const redisTrain: VehicleRedisSchema = {
          action: 'update',
          current_status: train.trainState,
          direction_id: 0,
          id: train.trainID,
          latitude: train.lat,
          longitude: train.lon,
          route: `${train.routeName} from ${train.origName} to ${train.destName}`,
          update_time: train.updatedAt,
          approximate_speed: false,
          speed: train.velocity,
          stop: train.eventName,
        };
        console.log(train);
        const key = `amtrak-${train.trainID}`;
        await client.set(key, JSON.stringify(redisTrain), {
          expiration: {
            type: 'EX',
            value: 900,
          },
        });
        await client.sAdd('pos-data', key);
      }
    }
  }
}

async function main() {
  await getTrains();
  setTimeout(getTrains, 600000);
}

await main();
