import { expect } from '@wdio/globals'
import { Key } from 'webdriverio'
import assert from "assert/strict"

describe('Github', () => {

    xit("should Sign Up correctly", async() => {

        const URL = '/signup'

        const fields = [{id: 'email', value: 'ab@cde.fgh', to: "password"},
                        {id: 'password', value: '2023ghbdrn2023', to: "username"},
                        {id: 'login', value: 'ghbdrn2023', to: "opt-in"}, 
                        {id: 'opt_in', value: 'y', to: "captcha-and-submit"}]
        
        await browser.url("https://github.com/");  
        
        const signupButton = await $(`header a[href^="${URL}"]`);
        await signupButton.click()

        await browser.waitUntil(() => {
            return browser.getUrl().then((pageUrl) => {
                console.log("pageUrl: ", pageUrl)

                return pageUrl.indexOf(URL) > -1
            });
          }, 10000) 

        for  (const field of fields) {
            const emailInput = await $(`#${field.id}`) 
            await emailInput.waitForDisplayed()
            await emailInput.setValue(field.value)
            
            
            const continueButton = await $(`[data-continue-to="${field.to}-container"]`);
            await continueButton.waitForClickable({})
            await continueButton.click()
        }
       
    }) 
    
    xit("should contain a link to the correct Enterprise start page", async() => {
        await browser.url("https://github.com/")  

        const header1 = await $('//h2[contains(., "The place for anyone from anywhere to build anything")]')
        await expect(header1).toBeDisplayed()
            
        await header1.scrollIntoView()        
        await expect(header1).toBeDisplayedInViewport()

        const URL = '/organizations/enterprise_plan'

        const enterpriseLink = await $(`a[href*="${URL}"]`)
        await expect(enterpriseLink).toBeDisplayed()
        await enterpriseLink.click()

        await expect(browser).toHaveUrlContaining(URL)

        const trialPlanHeader = await $('//h1[contains(., "Pick your trial plan")]')
        await expect(trialPlanHeader).toBeDisplayed()

        const enterpriseCloudLink = await $('a[href^="/account/enterprises/new"]')
        await expect(enterpriseCloudLink).toBeDisplayed()
        await expect(enterpriseCloudLink).toBeClickable()
        await enterpriseCloudLink.click()
        
    })

    xit("Should provide the opportunity to subscribe", async() => {
        
        await browser.url("https://github.com/");
        
        const URL = 'resources.github.com/newsletter'

        const subscribeButton = await $(`a[href*="${URL}"]`);
        await subscribeButton.scrollIntoView() 
        await expect(subscribeButton).toBeDisplayedInViewport()
        await expect(subscribeButton).toBeClickable()
        await subscribeButton.click()

        await expect(browser).toHaveUrlContaining(URL)

        const letsSubscribeHeader = await $('//h1[@id="hero-section-brand-heading" and contains(., "Subscribe to our developer newsletter")]')
        await expect(letsSubscribeHeader).toExist()

        const emailInputSelector = 'input[name="emailAddress"][type="email"][required]'
        const emailInput = await $(emailInputSelector) 
        await expect(emailInput).toBeDisplayed()
        emailInput.setValue('ab@cde.fgh')

        
        const checkboxAgree = $('#gated-agree-marketingEmailOptin1')        
        checkboxAgree.click()

        const countrySelect = $('#country')   
        await countrySelect.selectByAttribute('value', 'AE');
        
        const subscribeContinueButton = await $('button[type="submit"]');
        subscribeContinueButton.click()
        
        const thxForSubscribingHeader = await $('//h1[@id="hero-section-brand-heading" and contains(., "Thanks for subscribing!")]')
        await thxForSubscribingHeader.waitForDisplayed()        

    })  

    xit("search on GitHub", async() => {
        const SEARCH_QUERY = "act"

        await browser.url("https://github.com/");  

        await browser.maximizeWindow()
        //await browser.setWindowSize(1400, 1000)
        
        const openSearchInputButton = await $('button.header-search-button');
        await expect(openSearchInputButton).toBeDisplayed()
        await openSearchInputButton.click()
        
        const queryInput = await $('#query-builder-test')
        await expect(queryInput).toBeDisplayed()
        await queryInput.setValue(SEARCH_QUERY)
        browser.keys([Key.Enter])
        
        await expect(browser).toHaveUrlContaining(SEARCH_QUERY)    
        
        const searchResults = await $$('[data-testid="results-list"] > div')  
              
        console.log("searchResults.length:", searchResults.length)   
        assert(0 < searchResults.length, "No search results.")

        for await (const searchResult of searchResults) {
            
            const searchTitle = await searchResult.$('.search-title')
            const isSearchQueryInTitle = (await searchTitle.getText()).toLocaleLowerCase().indexOf(SEARCH_QUERY) !== -1
                && (await searchTitle.$(`a[href*="${SEARCH_QUERY}" i]`).isExisting())

            const searchBody = await searchResult.$('div > .search-match')    
            const isSearchQueryInBody = (await searchBody.getText()).toLocaleLowerCase().indexOf(SEARCH_QUERY) !== -1
            
            console.log("qqqq", await searchTitle.getText(), isSearchQueryInTitle) 
            console.log("bbbb", await searchBody.getText(), isSearchQueryInBody) 
            assert(isSearchQueryInTitle || isSearchQueryInBody, "Query string should be in search title url/text or in search body.")   
            
            await expect(searchResult).toBeDisplayed()
            
        }
        
    })

    it("should show the page with prices", async() => {

        const URL = '/pricing'        
        
        await browser.url("https://github.com/");
        await browser.maximizeWindow()

        const priceLink = await $(`a[href*="${URL}"]`);        
        await priceLink.click()

        await expect(browser).toHaveUrlContaining(URL)        
        
        const pricingHeader = await $("h1*=Get the complete developer\u00a0platform")                
        await pricingHeader.waitForDisplayed()        

        const compareFeaturesLink = await $(`a[href="#compare-features"]`);        
        await compareFeaturesLink.scrollIntoView()  
        await expect(compareFeaturesLink).toBeDisplayedInViewport()
        await compareFeaturesLink.click()

        const compareFeaturesHeader = await $("h1=Compare features")        
        await expect(compareFeaturesHeader).toBeDisplayed()

    })

})