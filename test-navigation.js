const puppeteer = require('puppeteer');

async function testNavigation() {
  console.log('🚀 Starting navigation test...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Navigate to app
    console.log('📍 Navigating to app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Test all navigation items
    const menuItems = [
      { name: 'Dashboard', selector: 'a[href="/dashboard"]' },
      { name: 'AI Assistant', selector: 'a[href="/ai-assistant"]' },
      { name: 'Meal Planner', selector: 'a[href="/meal-planner"]' },
      { name: 'AI Recipe', selector: 'a[href="/ai-recipe"]' },
      { name: 'Recipe Collection', selector: 'a[href="/recipes"]' },
      { name: 'Meal Tracker', selector: 'a[href="/meal-tracker"]' },
      { name: 'Growth Tracker', selector: 'a[href="/growth-tracker"]' },
      { name: 'Education', selector: 'a[href="/education"]' },
      { name: 'Tasks', selector: 'a[href="/tasks"]' },
      { name: 'Expenses', selector: 'a[href="/expenses"]' },
      { name: 'Shopping List', selector: 'a[href="/shopping-list"]' },
      { name: 'Profile', selector: 'a[href="/profile"]' },
      { name: 'Settings', selector: 'a[href="/settings"]' }
    ];
    
    const results = [];
    
    for (const item of menuItems) {
      try {
        console.log(`🔍 Testing: ${item.name}`);
        
        // Check if element exists
        const element = await page.$(item.selector);
        if (!element) {
          results.push({
            name: item.name,
            status: 'NOT_FOUND',
            error: 'Element not found in DOM'
          });
          continue;
        }
        
        // Check if element is visible
        const isVisible = await page.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 style.opacity !== '0' &&
                 el.offsetWidth > 0 && 
                 el.offsetHeight > 0;
        }, element);
        
        if (!isVisible) {
          results.push({
            name: item.name,
            status: 'NOT_VISIBLE',
            error: 'Element found but not visible'
          });
          continue;
        }
        
        // Try to click
        await page.click(item.selector, { delay: 100 });
        
        // Wait for navigation or page change
        await page.waitForTimeout(1000);
        
        // Check if navigation worked (URL changed or page loaded)
        const currentUrl = page.url();
        const expectedUrl = item.selector.match(/href="([^"]+)"/)?.[1];
        
        if (expectedUrl && currentUrl.includes(expectedUrl)) {
          results.push({
            name: item.name,
            status: 'SUCCESS',
            url: currentUrl
          });
        } else {
          results.push({
            name: item.name,
            status: 'CLICKED_BUT_NO_NAV',
            currentUrl,
            expectedUrl
          });
        }
        
      } catch (error) {
        results.push({
          name: item.name,
          status: 'ERROR',
          error: error.message
        });
      }
    }
    
    // Print results
    console.log('\n📊 NAVIGATION TEST RESULTS:');
    console.log('='.repeat(50));
    
    const successCount = results.filter(r => r.status === 'SUCCESS').length;
    const errorCount = results.filter(r => r.status !== 'SUCCESS').length;
    
    results.forEach(result => {
      const icon = result.status === 'SUCCESS' ? '✅' : 
                  result.status === 'NOT_FOUND' ? '❌' :
                  result.status === 'NOT_VISIBLE' ? '👁️' :
                  result.status === 'ERROR' ? '💥' : '⚠️';
      
      console.log(`${icon} ${result.name}: ${result.status}`);
      if (result.error) console.log(`   Error: ${result.error}`);
      if (result.url) console.log(`   URL: ${result.url}`);
    });
    
    console.log('\n📈 SUMMARY:');
    console.log(`✅ Working: ${successCount}`);
    console.log(`❌ Issues: ${errorCount}`);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'navigation-test.png', fullPage: true });
    console.log('📸 Screenshot saved: navigation-test.png');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testNavigation();
