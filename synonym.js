((synonym) => {
    'use strict';

    var tcom = require('thesaurus-com');
    var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
    const conceptnet = require('./conceptnet');
    const wordnet = require('./wordnet');
    const synonymsLib = require('./synonyms-lib');


    synonym.init = (app) => {

        setTimeout(function() {
            main();
        }, 1500)

        String.prototype.replaceArray = function(find, replace) {
            var replaceString = this;
            for (var i = 0; i < find.length; i++) {
              replaceString = replaceString.replace(find[i], replace[i]);
            }
            return replaceString;
        };

        async function getSynonym(item) {
            let tempArray;
            const conceptNetData =  await conceptnet.init(item);
            const wordNetData =  await wordnet.init(item);
            const synonymsLibData = await synonymsLib.init(item);
            tempArray = [...conceptNetData, ...wordNetData, ...synonymsLibData];
            if(!(tempArray && tempArray.length)) return;

            let y = {};
            y['word'] = item;
            y['synonyms'] = [tempArray[0]];

            // removing duplicate synonyms
            for(let i=1; i<tempArray.length; i++) {
                // check if two synonym word are same
                let index = y.synonyms.findIndex(item => item.synWord === tempArray[i].synWord);                               
                if(index === -1) {
                    // two synonym words are different so keep it
                    y.synonyms.push(tempArray[i]);
                } else{
                    //synonym words are same so check for source
                    //if source are same keep only one, if source are diff update the source

                    if(!y.synonyms[index].source.some(item => tempArray[i].source.includes(item))) {
                        y.synonyms[index].source = [...y.synonyms[index].source, ...tempArray[i].source]
                        if(!y.synonyms[index].context && tempArray[i].context)
                            y.synonyms[index].context = tempArray[i].context
                        
                    }
                }
            }
            return y;
        }


        function main() {
            let x = {};
            let question, newQuestion;
            question = "How many primes were included in the early Greek's list of prime numbers?";
            console.log("Question is: ", question);
            wordpos.getNouns(question)
                    .then(async(result) => {
                        console.log("entities", result)
                        
                        for(let item of result) {
                            let res;
                            res = await app.locals.db.collection('Synonym')
                                .find({word: item}).toArray();
                            res = res[0];
                            if(!res) {
                                // console.log("1")
                                res = await getSynonym(item);
                                if(!res) continue;
                                app.locals.db.collection('Synonym', function (err, collection) {

                                    collection.insert(res);

                                });
                            }

                            let returnData = res.synonyms.find((element) => element.source.includes('SynonymsLib'))
                            if(returnData) x[item] = returnData.synWord; 

                        }
                        var find,replace = [];
                        find = Object.keys(x);
                        replace = Object.values(x);
                        newQuestion = question.replaceArray(find, replace);
                        console.log("New Question is: ", newQuestion);

                        
                    
                        // let index;
                        // for(let item in x) {
                        //     x[item] = [];
                        //     console.log("item", x[item])
                        //     console.log("orgi item", item)
                        //     for(let value in x[item]) {
                        //         console.log("value", x[item][value])
                        //         if(x[item][value] == item ) {
                        //             x[item].splice(x[item].indexOf(x[item][value]), 1);
                        //         }                            
                        //     }
                        //     for(let value in x[item]) {
                        //         if(x[item][value].length == 1) {
                        //             x[item].splice(x[item].indexOf(x[item][value]), 1);
                        //         }
                        //     }
                        //     if(x[item].length == 0) {
                        //         delete x[item]
                        //     }
                        // }
    
    
                    })
        }

    }

})(module.exports);