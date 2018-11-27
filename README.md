# KPC8

`KPC8` is a ERC20 token for K-Pay Coin.

## Prerequisits

In order to run the ERC20 token in your local development, you have to install

- Ganache
- NodeJS version 8 or above
- Chrome/Firefox
- MetaMask

## Setup Development Environment

Install `truffle`
```bash
npm install -g truffle
```

## Run and Deploy Contracts to Local

Start Ganache

Compile contracts
```bash
truffle compile
```

Deploy contracts
```bash
truffle migrate
```

Run the WebUI for testing
```bash
npm run dev
```

## Deploy Contract to Ropsten

```
export MNENOMIC="xxx xxx xxx the 12 words"
export INFURA_API_KEY="project id in infura.io"
truffle migrate --network ropsten
```

## Deploy Contract to MainNet
```
export MNENOMIC="xxx xxx xxx the 12 words"
export INFURA_API_KEY="project id in infura.io"
truffle migrate --network main
```




# KCP8 Specs

* It is a standard ERC20 token
* It is `Mintable`, the total supply can be **increased** by the Owner only.
* It is `Burnable`, the total supply can be **decrased** by the Owner only.
