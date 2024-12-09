document.addEventListener('DOMContentLoaded', function(){
    //First API Call to add currencies in opptions
    var apiadd = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

    //Select Fields of input and output sides
    var inputCurrency = document.getElementById('input-currency');
    var outputCurrency = document.getElementById('output-currency');

    //Input fields of input and output sides
    const inputField = document.getElementById('input-field');
    const outputField = document.getElementById('output-field');

    //Best way to convert for max profit
    const bestOption = document.getElementById('best-option');

    //Making an API call for list of currencies after every refresh
    async function firstFetch() {
        let response = await fetch(apiadd);
        let currencies = await response.json();
        //adding currencies in select options of input
        for(let currency in currencies){
            let option = document.createElement('option');
            option.textContent = `${currency} (${currencies[currency]})`;
            option.value = currency;
            inputCurrency.appendChild(option);
        }

        //adding currencies in select options of output
        for(let currency in currencies){
            let option = document.createElement('option');
            option.textContent = `${currency} (${currencies[currency]})`;
            option.value = currency;
            outputCurrency.appendChild(option);
        }


        //USD to INR conversion by default
        inputCurrency.value = 'usd';
        outputCurrency.value = 'inr';

    }
    firstFetch();

    //Convert Button
    const convert = document.getElementById('convert');
    convert.addEventListener('click', function(){
        //Loading message as it may take some time to fetch api again and again
        bestOption.innerHTML = `<p>You will soon be swimming in money(pennies)...</p>`;
        //Fetches once again after every button click with base currency as the one in input select
        let newfetch = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${inputCurrency.value}.json?nocache=${Date.now()}`;
        async function newf() {
            let response = await fetch(newfetch);
            let data = await response.json();
            outputField.value = inputField.value * data[inputCurrency.value][outputCurrency.value];
        }
        newf();
        //fetching again for most profit
        async function findingMax(){
            let dataMax = {};
            let promises = [];
            let response = await fetch(newfetch);
            response = await response.json();

            for(let c in response[inputCurrency.value]){
                
                //Making and calling one more function which will
                //fetch once again and store the total value of currency after exchange
                //in dataMax object
                
                let maxFetch = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${c}.json`;
                
                //add it in promises array
                promises.push((async() => {
                    //firstly i = currency1 -> intermediate currency
                    let i = response[inputCurrency.value][c] * inputField.value;

                    //fetching and converting response to json
                    let res = await fetch(maxFetch);
                    res = await res.json();
                    console.log(res);

                    //then intermediate currency -> currency2
                    i = i * res[c][outputCurrency.value];

                    //A rough limit that a conversion can't give more than 20% profit
                    //Because it will be possible via various Crypto
                    //But will be impractical
                    if(i > 1.2 * outputField.value){
                        i = 0;
                    }
                    //if i is not 0, i will be added to object dataMax with 
                    //key = i, value = name of currency
                    if(i != 0){
                        dataMax[i] = c;
                    }
                })());
            }
            //waiting for all promises to be resolved
            await Promise.all(promises);
            let highestAmounts = Object.keys(dataMax);
            for(let i = 0; i < highestAmounts.length; i++){
                highestAmounts[i] = parseFloat(highestAmounts[i]);
            }
            highestAmounts.sort(function(a,b) { return b - a;});
            console.log(dataMax);
            //If best possible is to exchange directly
            if(highestAmounts[0] < outputField.value){
                bestOption.innerHTML = "<p>Best Option is direct exchange</p>";
            }else{
            //Printing the result on screen
                bestOption.innerHTML = `<p> Best Possible Exchanges :</p>
                <ol>
                <li>${inputCurrency.value} -> ${dataMax[highestAmounts[0]]} -> ${outputCurrency.value} => <b>${highestAmounts[0]} ${outputCurrency.value} </b></li>
                <li>${inputCurrency.value} -> ${dataMax[highestAmounts[1]]} -> ${outputCurrency.value} => <b>${highestAmounts[1]} ${outputCurrency.value} </b></li>
                <li>${inputCurrency.value} -> ${dataMax[highestAmounts[2]]} -> ${outputCurrency.value} => <b>${highestAmounts[2]} ${outputCurrency.value} </b></li>
                </ol>`;
            }
        }
        findingMax();
    })
})
