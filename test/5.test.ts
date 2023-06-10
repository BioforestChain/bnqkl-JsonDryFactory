const sourceData = {
  error: null,
  result: {
    b6voys2xWztv2qwjLRUvGpscogEZrdoBx: {
      accountInfo: {
        address: "b6voys2xWztv2qwjLRUvGpscogEZrdoBx",
        publicKey: "9441a85901fffdbba5ef7998b45785926efea630b575c065a08ef58029f45723",
        accountStatus: 0,
        isDelegate: false,
        isAcceptVote: false,
        producedblocks: 0,
        missedblocks: 0,
        numberOfTransactions: 2,
        voteInfo: { round: 0, vote: 0n },
        equityInfo: {
          round: 0,
          equity: 0n,
          fixedEquity: 0n,
        },
        lastRoundInfo: {
          round: 0,
          assetNumber: 0n,
          txCount: 0,
        },
        height: 1,
      },
      accountAssets: {
        address: "b6voys2xWztv2qwjLRUvGpscogEZrdoBx",
        publicKey: "9441a85901fffdbba5ef7998b45785926efea630b575c065a08ef58029f45723",
        assets: {
          SEVEJ: {
            BFT: {
              sourceChainMagic: "SEVEJ",
              assetType: "BFT",
              sourceChainName: "bfchain",
              assetNumber: 27182818284590338n,
            },
          },
        },
        paidFee: 54n,
        votingRewards: 0n,
        forgingRewards: 0n,
        height: 1,
      },
    },
    bK7uHw6DQUg1udYueH5x4aZUhB5BKELMVQ: {
      accountInfo: {
        address: "bK7uHw6DQUg1udYueH5x4aZUhB5BKELMVQ",
        publicKey: undefined,
        accountStatus: 0,
        isDelegate: false,
        isAcceptVote: false,
        producedblocks: 0,
        missedblocks: 0,
        numberOfTransactions: 0,
        voteInfo: { round: 0, vote: 0n },
        equityInfo: {
          round: 0,
          equity: 0n,
          fixedEquity: 0n,
        },
        lastRoundInfo: {
          round: 0,
          assetNumber: 0n,
          txCount: 0,
        },
        height: 1,
      },
      accountAssets: {
        address: "bK7uHw6DQUg1udYueH5x4aZUhB5BKELMVQ",
        publicKey: undefined,
        assets: {
          SEVEJ: {
            BFT: {
              sourceChainMagic: "SEVEJ",
              assetType: "BFT",
              sourceChainName: "bfchain",
              assetNumber: 60n,
            },
          },
        },
        paidFee: 0n,
        votingRewards: 0n,
        forgingRewards: 0n,
        height: 1,
      },
    },
    zzz: 1,
  },
};

import { JSONDryFactory } from "@bfchain/json-dry-factory";
const jsonDry = new JSONDryFactory("qaq");
import { deepStrictEqual } from "assert";
const dirtyData1 = jsonDry.toDirty(sourceData);
debugger;
const targetData1 = jsonDry.unDirty(dirtyData1);

const dirtyData2 = JSON.parse(JSON.stringify(jsonDry.toDirty(sourceData)));
const targetData2 = jsonDry.unDirty(dirtyData2);
deepStrictEqual(targetData1, targetData2);
console.log("all test passed");
// deepStrictEqual(dirtyData2[0], dirtyData[0], "dirtyData[0]");
// deepStrictEqual(dirtyData2[1], dirtyData[1], "dirtyData[1]");
