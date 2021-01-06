const express = require('express');
const app = new express();
const dotenv = require('dotenv');
const xx = require('ibm-watson/natural-language-understanding/v1');
dotenv.config();

function getNLUInstance() {
  const apiKey = process.env.API_KEY;
  const apiUrl = process.env.API_URL;

  const NaturalLanguageUnderstanding = xx;
  const {IamAuthenticator } = require('ibm-watson/auth');

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstanding({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({apikey: apiKey}),
    serviceUrl: apiUrl
  });

  return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", async (req,res) => {
    const nluService = getNLUInstance();
    const analyzeParams = {
        'text': req.query.url,
        'features': {
            'keywords': {
                'sentiment': false,
                'emotion': true,
                'limit': 1
            }
        }
    };
    const evaluation = await nluService.analyze(analyzeParams);     
    return res.send(JSON.stringify(evaluation.result.keywords[0].emotion));
});

app.get("/url/sentiment", async (req,res) => {
    const nluService = getNLUInstance();
    const analyzeParams = {
        'text': req.query.url,
        'features': {
            'entities': {
              'sentiment': true,
              'limit': 1
            }
        }
    };
    const evaluation = await nluService.analyze(analyzeParams);     
    return res.send(JSON.stringify(evaluation.result.entities[0].sentiment));
});

app.get("/text/emotion", async (req,res) => {    
    const nluService = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                'sentiment': false,
                'emotion': true,
                'limit': 1
            }
        }
    };
    const evaluation = await nluService.analyze(analyzeParams);     
    return res.send(JSON.stringify(evaluation.result.keywords[0].emotion));
});

app.get("/text/sentiment", async (req,res) => {    
    const nluService = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
              'sentiment': true,
              'limit': 1
            }
        }
    };
    const evaluation = await nluService.analyze(analyzeParams);     
    return res.send(JSON.stringify(evaluation.result.entities[0].sentiment));
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

