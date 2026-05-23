# Node CLI — bulk price update

Updates the price on every active car matching a make/model pattern.

## Setup

```bash
cd examples/node-cli
npm install @vendetus/sdk
```

Set env:

```
export VENDETUS_API_KEY=pcsk_...
```

## Run

```bash
# Bump all Volkswagen Golf prices by 5%
node src/index.js --match "Golf" --multiplier 1.05

# Dry-run
node src/index.js --match "Golf" --multiplier 1.05 --dry
```
