document.addEventListener('DOMContentLoaded', function(){
    //First API address, list of all currencies
    const apiadd = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

    //Storing all the required HTML elements
    const inputCurrency = document.getElementById('input-currency');
    const outputCurrency = document.getElementById('output-currency');
    const inputField = document.getElementById('input-field');
    const outputField = document.getElementById('output-field');
    const bestOption = document.getElementById('best-option');

    //Resetting thet input and output fields
    inputField.value = '';
    outputField.value = 0;

    //Adding all the currencies in select options
    async function firstFetch() {
        let response = await fetch(apiadd);
        let currencies = await response.json();

        //adding currencies in select options of input
        for(let currency in currencies){
            let option = document.createElement('option');
            option.textContent = `${currency} (${currencies[currency]})`;
            option.value = currency;
            inputCurrency.appendChild(option);
            option = document.createElement('option');
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

                    //then intermediate currency -> currency2
                    i = i * res[c][outputCurrency.value];

                    //adding the total money got from intermediate
                    //to an object for further operation
                    dataMax[i] = c;
                })());
            }

            //waiting for all promises to be resolved
            await Promise.all(promises);

            let highestAmounts = Object.keys(dataMax);
            for(let i = 0; i < highestAmounts.length; i++){
                highestAmounts[i] = parseFloat(highestAmounts[i]);
            }

            //sorting the array in desc order to get top 3 amounts
            highestAmounts.sort(function(a,b) { return b - a;});

            //Printing the result on screen
            if(highestAmounts[0] < outputField.value){
                //If best option is to trade directly
                bestOption.innerHTML = "<p>Best Option is direct exchange</p>";
            }else if(inputField.value == 0){
                //If input is empty
                bestOption.innerHTML = "<p>Please enter some value</p>"
            }else{
                bestOption.innerHTML = `<p> Top 3 exchanges :</p>
                <ol>
                    <li>${inputCurrency.value} -> ${dataMax[highestAmounts[0]]} -> ${outputCurrency.value} => 
                        <b>${highestAmounts[0]} ${outputCurrency.value} </b></li>
                    <li>${inputCurrency.value} -> ${dataMax[highestAmounts[1]]} -> ${outputCurrency.value} => 
                        <b>${highestAmounts[1]} ${outputCurrency.value} </b></li>
                    <li>${inputCurrency.value} -> ${dataMax[highestAmounts[2]]} -> ${outputCurrency.value} => 
                        <b>${highestAmounts[2]} ${outputCurrency.value} </b></li>
                </ol>`;
            }
        }
        findingMax();
    })
})
