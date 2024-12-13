# Currency Convertor with best possible way (1 intermediate)
## API I used
`https://github.com/fawazahmed0/exchange-api`
Reason was that it was always free with unlimited API requests. I depleted the limit of one of the options in the docs just while developing the website :P.
Also if I go with bonus assignment, the api request limit will be depleted in no time so this one is slightly better in that case.

There is one issue that there are a lot of crypto currencies as well which gives a very bad experience.

## How it works 
The first api fetch request is made and the currencies are appended in datalist options.

Second call will convert currencies directly.

After that, api will be fetched (number of currencies) times, an object will store the total amount of final currency (as key) and intermediate currency (as value). 

Total final currency will be stored in an array, which will be sorted in decreasing order and top 3 elements' value will be used to get the intermediate currency.

If the best exchange value is worse than the direct exchange, it will print the direct exchange is the best way. Else it will show the top 3 (independent of if the other 2 are worse than direct exchange).

Currency code like usd, inr, jpy etc are to be written in 'from' and 'to' field (case insensitive), the input field can be used to search with name of country as well (thanks to datalist) but at the time of conversion, it will be required to write a valid country code in input fields.

# My Journey (optional read)

## HTML and CSS
I know HTML and CSS as I was learning them after the first sem.
I searched almost everything about javascript online, browsed mdn docs and stackoverflow for all the help I need.

I do have some experience of Javascript but I was not so fluent. As of now, I have not added any comments in the code and I will be doing it now as the website is not functional.

That part of the project was fairly easy.
## JAVASCRIPT
I almost had to learn it from scratch, the only think I knew was DOMContentLoaded xD. Youtubers like love babbar really helped me and I went to stackoverflow, mdndocs, chatgpt for debugging.

I learned following things while building project simultaneously -
- Asynch and Await
- Promises
- Changing html through JS
- Objects
- Arrays
and so on..

## Question I can't find answer to - 
After searching for the answer to this question in the vast stack of stackoverflow questions, in the sweaty alleys of reddit and then when lord chatgpt themself said to give up, I am here without the answer to this question.

VS Code Live Preview - 
![alt text](image-2.png) 

Firefox(http://) - 
![alt text](image-1.png)

They both give different top 3 methods(firefox is right I guess).

Maybe it's just the api **(╬▔皿▔)╯**

This is the github repo if anyone want to visit - https://github.com/ShubhSarin/Currency-Convertor (The zip file is final for recruitment, I used github for myself).