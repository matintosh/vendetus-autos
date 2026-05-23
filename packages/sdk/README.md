# @vendetus/sdk

Typed TypeScript client for the [vendetus.autos](https://vendetus.autos) REST API.

```bash
npm install @vendetus/sdk
```

```ts
import { VendetusClient } from "@vendetus/sdk";

const client = new VendetusClient({
  apiKey: process.env.VENDETUS_API_KEY!,
});

const { cars } = await client.listMyCars({ status: "active" });
const updated = await client.updateCar(cars[0].id, { price: 22000 });
const stats = await client.getAnalytics(cars[0].id, { days: 7 });
```

## Methods

| Method | Returns |
|---|---|
| `listMyCars({ status?, limit? })` | `{ cars: Car[] }` |
| `getCar(id)` | `{ car: CarWithPhotos }` |
| `updateCar(id, patch)` | `{ car: Car }` |
| `listOffers(carId)` | `{ offers: Offer[] }` |
| `listComments(carId)` | `{ comments: Comment[] }` |
| `getAnalytics(carId, { days? })` | `AnalyticsResponse` |

## Get an API key

Generate at [app.vendetus.autos/integrations](https://app.vendetus.autos/integrations) (requires Pro or Dealer plan).

## Docs

Full reference: https://vendetus.autos/docs/sdk

## License

MIT
