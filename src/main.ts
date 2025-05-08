import { fetchAllTrains } from 'amtrak';
import { createClient } from 'redis';
import { VehicleRedisSchema } from './sharedTypes.js';
import log from 'loglevel';
async function getTrains() {
  const client = await createClient({
    url: process.env.BT_REDIS_URL,
    password: process.env.BT_REDIS_PASSWORD,
  })
    .on('error', (err) => log.error('Redis Client Error', err))
    .connect();

  const trains = await fetchAllTrains();
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
        const redisTrain: VehicleRedisSchema = {
          action: 'update',
          current_status: train.trainState,
          direction_id: 0,
          id: train.trainID,
          latitude: train.lat,
          longitude: train.lon,
          route: `Amtrak ${train.routeName} from ${train.origName} to ${train.destName}`,
          update_time: updateTime.toISOString(),
          approximate_speed: false,
          speed: train.velocity,
          stop: train.eventName,
        };
        log.info(redisTrain);
        const key = `amtrak-${train.trainID}`;
        await client.set(key, JSON.stringify(redisTrain), {
          expiration: {
            type: 'EX',
            value: 600,
          },
        });
        await client.sAdd('pos-data', key);
        setTimeout(async () => {
          await client.sRem('pos-data', key);
        });
      }
    }
  }
}

async function main() {
  log.setDefaultLevel('INFO');
  await getTrains();
  setTimeout(getTrains, 600000); // 10 min
}

await main();
