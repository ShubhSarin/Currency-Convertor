document.addEventListener('DOMContentLoaded', function(){
    //First API address, list of all currencies
    const apiadd = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

    //Storing all the required HTML elements
    //Datalist
    const dataList = document.getElementById('datalist');
    //Currency input and output fields
    const inputField = document.getElementById('input-field');
    const outputField = document.getElementById('output-field');
    //Div which will contain the best 3 exchanges if found
    const bestOption = document.getElementById('best-option');
    //Currency input and output
    const datalistInput = document.getElementById('datalist-input');
    const datalistOutput = document.getElementById('datalist-output');

    //Resetting thet input and output fields
    inputField.value = '';
    outputField.value = 0;

    let currencies = [];
    //Adding all the currencies in select options
    async function firstFetch() {
        let response = await fetch(apiadd);
        let currencylist = await response.json();
        //adding currencies in select options of input and output
        for(let currency in currencylist){
            currencies.push(currency);
            let option = document.createElement('option');
            option.textContent = `${currency} (${currencylist[currency]})`;
            option.value = currency;
            dataList.appendChild(option);
        }
        //placeholder
        datalistInput.placeholder = 'usd';
        datalistOutput.placeholder = 'inr';
    }
    firstFetch();
    console.log(currencies);

    //Convert Button
    const convert = document.getElementById('convert');
    convert.addEventListener('click', function(){
        //Makes currency input caseinsensitive
        let inputcurr = datalistInput.value;
        let outputcurr = datalistOutput.value;
        inputcurr = inputcurr.toLowerCase();
        outputcurr = outputcurr.toLowerCase();

        //Checks if both the currencies are valid
        if(!currencies.includes(inputcurr) || !currencies.includes(outputcurr)){
            bestOption.innerHTML = `<p style="color: red;"><b>ENTER A VALID CURRENCY CODE!!!(eg. usd, inr)</b></p>`;
            return;
        }

        //Checks if both the currencies are safe
        if(inputcurr === outputcurr){
            bestOption.innerHTML = `<p style="color: red;"><b>FROM AND TO CURRENCIES CAN NOT BE SAME!!!</b></p>`;
            return;
        }


        //Loading message as it may take some time to fetch api again and again
        bestOption.innerHTML = `<p>You will soon be swimming in money(pennies)...</p>`;

        //Fetches once again after every button click with base currency as the one in input select
        let newfetch = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${inputcurr}.json?nocache=${Date.now()}`;
        async function newf() {
            let response = await fetch(newfetch);
            let data = await response.json();
            outputField.value = inputField.value * data[inputcurr][outputcurr];
        }
        newf();

        //fetching again for most profit
        async function findingMax(){
            let dataMax = {};
            let promises = [];
            let response = await fetch(newfetch);
            response = await response.json();
            for(let c in response[inputcurr]){
                
                //Making and calling one more function which will
                //fetch once again and store the total value of currency after exchange
                //in dataMax object
                
                let maxFetch = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${c}.json`;
                
                //add it in promises array
                promises.push((async() => {
                    //firstly i = currency1 -> intermediate currency
                    let i = response[inputcurr][c] * inputField.value;

                    //fetching and converting response to json
                    let res = await fetch(maxFetch);
                    res = await res.json();

                    //then intermediate currency -> currency2
                    i = i * res[c][outputcurr];

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
                    <li>${datalistInput.value} -> ${dataMax[highestAmounts[0]]} -> ${datalistOutput.value} => 
                        <b>${highestAmounts[0]} ${datalistOutput.value} </b></li>
                    <li>${datalistInput.value} -> ${dataMax[highestAmounts[1]]} -> ${datalistOutput.value} => 
                        <b>${highestAmounts[1]} ${datalistOutput.value} </b></li>
                    <li>${datalistInput.value} -> ${dataMax[highestAmounts[2]]} -> ${datalistOutput.value} => 
                        <b>${highestAmounts[2]} ${datalistOutput.value} </b></li>
                </ol>`;
            }
        }
        findingMax();
    })
})
