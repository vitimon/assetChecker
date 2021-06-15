const fetch = require("node-fetch")

const coinsAPI = 'https://nodes.wavesexplorer.com/assets/balance/'
const assetAPI = 'https://waves.guarda.co/assets/details/'
const ordersAPI = `https://matcher.waves.exchange/matcher/orderbook/`
const matcherFee = 0.003

//função para coleta de dados nas apis
async function getData(address){
    let response = await fetch(address)

    if (response.ok) {
        let json = response.json()
        return json
    }else {
        console.log("Error at getData func - DEURUIM") //ainda tentando descobrir em que parte causa erro quando a coleta de dados é grande
}

}
//função que verifica orderbook
function bids4price(bids,decimals,result,index=0){
    if(!bids[index]){
        return(result)
    }else{
        let normAmount = bids[index].amount/10**decimals
        let normPrice = bids[index].price/10**(16-decimals)    
        if (result.maxBid < normPrice){result.maxBid = normPrice}
        result.wavesDepth += normAmount*normPrice
        return(bids4price(bids,decimals,result,index+1))
    }
    
}

//endereços para testes
const testAddress = '3PH2vS8qzdGf66hDskiRMk3vrUuZBUzpSau'    //meu endereço
const nodeBR ='3P1xU8QSBk2gDQkepGYu24tTfwj4FgS7avv'          //Node brasileiro do time Waves - faz um lease lá!
const wavesnode = '3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs'      //node gringo com uma quntidade massiva de moedas que ainda não consiguimos tratar
const aliasMiner ='3PQqCXNPoTRsHRK2nZyXWENaZwLmxrUZPBi'      //node com varios aliases

const eggToken = 'JCGDtrVy64cCJ1wCKfCaiNQMnyYwii71TbE5QeAHfxgF'
const chudoToken = '7J1Z2tDArjNKqASNTssgdgD9brK2Ce49AV14MHXX7GEc'
const usdnToken = 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p'
const nathanToken = '31CEteYbRXDk8X1iMNCFLqQT4uGJiUcfBQUKKEKVaXfu'

//função checagem das moedas - aparentemente não consegue tratar uma carteira com muitas moedas
async function checkAsset(coinId){
    let coinInfo = await getData(assetAPI + coinId)
    let coinName = coinInfo.name
    let decimals = coinInfo.decimals
    let orderbook = await getData(`https://matcher.waves.exchange/matcher/orderbook/${coinId}/WAVES`)
    let coinPrice = bids4price(orderbook.bids,decimals,{"maxBid":0,"wavesDepth":0})
    console.log(coinName,' ',coinPrice)
    } 


//testagem da função
checkAsset(eggToken)
checkAsset(chudoToken)
checkAsset(usdnToken)
checkAsset(nathanToken)
