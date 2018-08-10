const puppeteer = require('puppeteer');
const postComment = (reqBody) => {
    return new Promise(async (resolve, reject) => {
        const { first_name, last_name, email, city, state, zip } = reqBody
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        console.log(reqBody)
        const page = await browser.newPage()
        try {
            await page.goto('https://www.regulations.gov/comment?D=USBC-2018-0005-0001', { waitUntil: 'networkidle0' })
            await page.type('#x-auto-0-input', first_name)
            await page.type('#x-auto-1-input', last_name)
            await page.type('#x-auto-2-input', email)
            await page.type('#x-auto-5-input', city)
            await page.type('#x-auto-6-input', state)
            await page.type('#x-auto-8-input', zip)
            await page.type('#x-auto-10-input', email)
            await page.evaluate(form => {
                console.log('form submitted')
                form.click()
            },  (await page.$x('/html/body/div[3]/div[2]/div[2]/div[3]/div/div[3]/div[1]/form/div[5]/span/button'))[0])
            // await page.click('#gwt-uid-250')
            // await page.click('#gwt-uid-385')
            // await page.waitFor(3000)
            // await page.type('#x-auto-21-input', 'mateo@demandprogress.org')
            // await page.evaluate(form => {
            //     console.log('email confirmation')
            //     form.click()
            // },  (await page.$x('/html/body/div[3]/div[2]/div[2]/div[3]/div/div[3]/div[3]/div[1]/div/div[1]/button'))[0])
            await browser.close();
            await resolve('completed')
            }  catch (error) {
                reject(error);
                browser.close();
            }
      });
}

module.exports = postComment