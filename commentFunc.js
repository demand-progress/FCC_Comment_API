const puppeteer = require('puppeteer');
const axios = require('axios');
var parseString = require('xml2js').parseString;
var stateAbbreviations = require('states-abbreviations');


// var xml = '<CityStateLookupRequest USERID="661DEMAN2298"><ZipCode ID="0"><Zip5>94601</Zip5></ZipCode></CityStateLookupRequest>'
// var serialized = new XMLSerializer().serializeToString(xml);
// console.log(serialized)

const getCity = (zip) => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://secure.shippingapis.com/ShippingAPI.dll?', {
            params: {
              API: 'CityStateLookup',
              xml: `<CityStateLookupRequest USERID="661DEMAN2298"><ZipCode ID="0"><Zip5>${zip}</Zip5></ZipCode></CityStateLookupRequest>`
            }
          })
          .then(function (response) {
            var xml = response.data
            parseString(xml, function (err, result) {
                const zipStateCityObj = result.CityStateLookupResponse.ZipCode[0]
                const city = zipStateCityObj.City[0]
                const state = zipStateCityObj.State[0]
                const stateFullName = stateAbbreviations[state]
                resolve({city: city, stateFullName: stateFullName})
            });
          })
          .catch(function (error) {
            reject(error);
          });
    })
}

const postComment = (reqBody) => {
    return new Promise(async (resolve, reject) => {
        const { first_name, last_name, email, zip, input_text } = reqBody
        const cityStateObj = await getCity(94601)
        const { city, stateFullName} = cityStateObj
        await console.log(city, stateFullName)
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        console.log(reqBody)

       
        const page = await browser.newPage()
        try {
            await page.goto('https://www.regulations.gov/comment?D=FTC-2018-0049-0001', { waitUntil: 'networkidle0' })
            await page.type('#x-auto-0-input', input_text)
            await page.type('#x-auto-1-input', first_name)
            await page.type('#x-auto-2-input', last_name)
            await page.type('#x-auto-6-input', stateFullName)
            await page.type('#x-auto-8-input', zip)
            await page.type('#x-auto-10-input', email)

        //     await page.evaluate(form => {
        //         form.click()
        //     },  (await page.$x('/html/body/div[3]/div[2]/div[2]/div[3]/div/div[3]/div[1]/form/div[5]/span/button'))[0])
        //     await page.click('#gwt-uid-250')
        //     await page.click('#gwt-uid-382')
        //     await page.waitFor(3000)
        //     await page.type('#x-auto-21-input', email)
        //     await page.evaluate(form => {
        //         form.click()
        //     },  (await page.$x('/html/body/div[3]/div[2]/div[2]/div[3]/div/div[3]/div[3]/div[1]/div/div[1]/button'))[0])
        //     await browser.close();
        //     await resolve('completed')
            }  catch (error) {
                reject(error);
                browser.close();
            }
      });
}

postComment({ first_name: 'me', last_name: 'you', email: 'mateo@demandprogress.org', zip: '94601', input_text: 'hello world' } )

module.exports = postComment