((synonymsLib) => {
    'use strict';
    var synonyms = require("synonyms");

    synonymsLib.init = async(word) => {
        let syn = [];
        let data = await synonyms(word, 'n')
                let source = ['SynonymsLib'];
                // console.log("data", data);
                for(let i=0; i<data.length; i++) {
                    if(data[i] !== word && data[i].length >1) {
                        let synWord = data[i];
                        syn.push({synWord, source});
                    }
                }
        return syn;
    }


})(module.exports);