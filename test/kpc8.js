const KPC8 = artifacts.require("KPC8");

const DP = 18;
const SDP = 10 ** DP;

function getInteger(bigNumber, decimalPlaces) {
  return bigNumber.dividedToIntegerBy(10 ** decimalPlaces);
}

contract('kpc8', function (accounts) {

  it("should be deployed", async function () {
    let token = await KPC8.deployed();
    assert.isTrue(!!token);
  });

  it("should be able to get ETH balance", async function () {
    var ethBalance = await web3.eth.getBalance(accounts[0]);
    // console.log(ethBalance);
    assert.isTrue(ethBalance.gt(0));
  })

  it("should work correctly with totalSupply", async function () {
    let token = await KPC8.deployed();
    var totalSupply = await token.totalSupply();
    assert.isTrue(totalSupply.gt(0));
  })

  it("should work correctly with balanceOf", async function () {
    let token = await KPC8.deployed();
    var balance = await token.balanceOf.call(accounts[0]);
    assert.isTrue(balance > 0);
  });

  it("should be minter", async function() {
    let token = await KPC8.deployed();
    let result = await token.isMinter(accounts[0]);
    assert.isTrue(result);

    let falseResult = await token.isMinter(accounts[1]);
    assert.isFalse(falseResult);

    await token.addMinter(accounts[1])

    let result2 = await token.isMinter(accounts[1]);
    assert.isTrue(result2);
  })

  it("should be mintable", async function() {
    let account_one = accounts[0];
    let amount = '1000000000000000000'; // 1 token

    let token = await KPC8.deployed();
    let oldSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);
    let oldBalance = (await token.balanceOf(account_one)).dividedToIntegerBy(SDP);

    await token.mint(account_one, amount);
    //await token.mint.call(account_one, amount, { from: account_one });

    let newBalance = (await token.balanceOf(account_one)).dividedToIntegerBy(SDP);
    let newSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);

    assert.isTrue(newBalance.minus(oldBalance).toNumber() == 1, "Should added 1 token for the account");
    assert.isTrue(newSupply.minus(oldSupply).toNumber() == 1, "Should added 1 token for the totalSupply");
  })


  it("should not be mintable for non-Minter", async function() {
    
    let non_minter_account = accounts[5];
    let amount = '1000000000000000000'; // 1 token

    let token = await KPC8.deployed();
    let oldSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);
    let oldBalance = (await token.balanceOf(non_minter_account)).dividedToIntegerBy(SDP);

    let falseResult = await token.isMinter(non_minter_account);
    assert.isFalse(falseResult);

    KPC8.defaults({
      from: non_minter_account
    });

    try {
      await token.mint(non_minter_account, amount);
      assert.isTrue(false, "Expection expected");
    } catch (ex) {}
    KPC8.defaults({
      from: accounts[0]
    });

    let newBalance = (await token.balanceOf(non_minter_account)).dividedToIntegerBy(SDP);
    let newSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);

    assert.isTrue(newBalance.minus(oldBalance).toNumber() == 0, "Should not added 1 token for the account");
    assert.isTrue(newSupply.minus(oldSupply).toNumber() == 0, "Should not added 1 token for totalSupply");
  })

  it("should send coin correctly", async () => {

    // Get initial balances of first and second account.
    let account_one = accounts[0];
    let account_two = accounts[1];

    let amount = '1000000000000000000'; // transfer 1 token


    let instance = await KPC8.deployed();
    let meta = instance;

    let oldBalances = [
      (await meta.balanceOf.call(account_one)).dividedBy(SDP),
      (await meta.balanceOf.call(account_two)).dividedBy(SDP)
    ]

    //console.log(`Old balances: ${oldBalances[0]}, ${oldBalances[1]}`);
    //console.log(oldBalances);


    await meta.transfer(account_two, amount, {
      from: account_one
    });

    let newBalances = [
      (await meta.balanceOf.call(account_one)).dividedBy(SDP),
      (await meta.balanceOf.call(account_two)).dividedBy(SDP)
    ]

    //console.log(newBalances);

    //console.log(`New balances: ${newBalances[0]}, ${newBalances[1]}`);

    assert.equal(oldBalances[0].minus(newBalances[0]).toNumber(), 1, "Account One should be correct");
    assert.equal(newBalances[1].minus(oldBalances[1]).toNumber(), 1, "Account Two should be correct");
    let oldSum = oldBalances[0].plus(oldBalances[1]);
    let newSum = newBalances[0].plus(newBalances[1]);
    assert.isTrue(oldSum.eq(newSum), "Total should be equal"); // total should be equal


  });

  it("should isBurner", async function() {
    let token = await KPC8.deployed();
    assert.isTrue(await token.isBurner(accounts[0]));
    assert.isFalse(await token.isBurner(accounts[1]));

    await token.addBurner(accounts[1]);
    assert.isTrue(await token.isBurner(accounts[1]));
  })

  it("should burn coins", async function() {
    let token = await KPC8.deployed();
    let amount = '1000000000000000000'; // 1 token
    
    let oldBalance = (await token.balanceOf(accounts[0])).dividedToIntegerBy(SDP);
    let oldSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);

    await token.burn(amount);

    let newBalance = (await token.balanceOf(accounts[0])).dividedToIntegerBy(SDP);
    let newSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);

    assert.isTrue(oldSupply.minus(newSupply).toNumber() == 1, "Total supply should down by 1");
    assert.isTrue(oldBalance.minus(newBalance).toNumber() == 1, "The account should down by 1");

  })


  it("should not be burnable for non-burner", async function() {
    
    let non_burner_account = accounts[5];
    let amount = '1000000000000000000'; // 1 token

    let token = await KPC8.deployed();
    let oldSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);
    let oldBalance = (await token.balanceOf(non_burner_account)).dividedToIntegerBy(SDP);

    let falseResult = await token.isMinter(non_burner_account);
    assert.isFalse(falseResult);

    KPC8.defaults({
      from: non_burner_account
    });

    try {
      await token.burn(amount);
      assert.isTrue(false, "Expection expected");
    } catch (ex) {}
    KPC8.defaults({
      from: accounts[0]
    });

    let newBalance = (await token.balanceOf(non_burner_account)).dividedToIntegerBy(SDP);
    let newSupply = (await token.totalSupply()).dividedToIntegerBy(SDP);

    assert.isTrue(newBalance.minus(oldBalance).toNumber() == 0, "Should not added 1 token for the account");
    assert.isTrue(newSupply.minus(oldSupply).toNumber() == 0, "Should not added 1 token for totalSupply");
  })


});