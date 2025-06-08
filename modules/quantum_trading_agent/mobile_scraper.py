#!/usr/bin/env python3
"""
Mobile-Optimized Web Scraper for Trading Data
Fallback system when APIs are unavailable using Puppeteer/Playwright
"""
import asyncio
import json
import os
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import traceback

try:
    from playwright.async_api import async_playwright, Browser, Page
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False
    print("Warning: Playwright not available. Install with: pip install playwright")

@dataclass
class ScrapedData:
    symbol: str
    price: float
    volume: float
    change_24h: float
    timestamp: datetime
    source: str

class MobileWebScraper:
    """Mobile-optimized web scraper for trading data"""
    
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.logger = logging.getLogger(__name__)
        
        # Mobile device settings
        self.mobile_device = {
            'user_agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            'viewport': {'width': 375, 'height': 812},
            'device_scale_factor': 3,
            'is_mobile': True,
            'has_touch': True
        }
        
        # Scraping targets
        self.scraping_targets = {
            'binance': {
                'url': 'https://www.binance.com/en/trade/BTC_USDT',
                'selectors': {
                    'price': '[data-testid="ticker-price"]',
                    'volume': '[data-testid="volume-24h"]',
                    'change': '[data-testid="price-change-percent"]'
                }
            },
            'coinbase': {
                'url': 'https://pro.coinbase.com/trade/BTC-USD',
                'selectors': {
                    'price': '.price',
                    'volume': '.volume',
                    'change': '.change'
                }
            },
            'kraken': {
                'url': 'https://trade.kraken.com/markets/kraken/btc/usd',
                'selectors': {
                    'price': '[data-testid="last-price"]',
                    'volume': '[data-testid="volume"]',
                    'change': '[data-testid="price-change"]'
                }
            }
        }
        
    async def initialize_browser(self) -> bool:
        """Initialize Playwright browser with mobile settings"""
        if not HAS_PLAYWRIGHT:
            self.logger.error("Playwright not available for mobile scraping")
            return False
            
        try:
            playwright = await async_playwright().start()
            self.browser = await playwright.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            )
            self.logger.info("Mobile browser initialized successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to initialize browser: {e}")
            return False
            
    async def create_mobile_page(self) -> Optional[Page]:
        """Create a mobile-optimized page"""
        if not self.browser:
            return None
            
        try:
            page = await self.browser.new_page(**self.mobile_device)
            
            # Set additional mobile settings
            await page.set_extra_http_headers({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            })
            
            # Block unnecessary resources for faster loading
            await page.route("**/*.{png,jpg,jpeg,gif,svg,css,woff,woff2}", lambda route: route.abort())
            
            return page
            
        except Exception as e:
            self.logger.error(f"Failed to create mobile page: {e}")
            return None
            
    async def scrape_exchange_data(self, exchange: str, retries: int = 3) -> Optional[ScrapedData]:
        """Scrape trading data from specific exchange"""
        if exchange not in self.scraping_targets:
            self.logger.error(f"Unknown exchange: {exchange}")
            return None
            
        target = self.scraping_targets[exchange]
        page = None
        
        for attempt in range(retries):
            try:
                page = await self.create_mobile_page()
                if not page:
                    continue
                    
                # Navigate to exchange with timeout
                await page.goto(target['url'], wait_until='networkidle', timeout=30000)
                
                # Wait for price data to load
                await page.wait_for_selector(target['selectors']['price'], timeout=15000)
                
                # Extract data
                price_text = await page.inner_text(target['selectors']['price'])
                price = self._parse_price(price_text)
                
                volume_text = await page.inner_text(target['selectors']['volume'])
                volume = self._parse_volume(volume_text)
                
                change_text = await page.inner_text(target['selectors']['change'])
                change = self._parse_change(change_text)
                
                await page.close()
                
                return ScrapedData(
                    symbol="BTC/USDT",
                    price=price,
                    volume=volume,
                    change_24h=change,
                    timestamp=datetime.now(),
                    source=exchange
                )
                
            except Exception as e:
                self.logger.warning(f"Scraping attempt {attempt + 1} failed for {exchange}: {e}")
                if page:
                    await page.close()
                    
                if attempt < retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    
        return None
        
    def _parse_price(self, price_text: str) -> float:
        """Parse price from scraped text"""
        try:
            # Remove currency symbols and commas
            cleaned = price_text.replace('$', '').replace(',', '').replace('€', '').replace('£', '')
            return float(cleaned)
        except:
            return 0.0
            
    def _parse_volume(self, volume_text: str) -> float:
        """Parse volume from scraped text"""
        try:
            cleaned = volume_text.replace(',', '').replace('$', '').replace('M', '000000').replace('K', '000')
            return float(cleaned)
        except:
            return 0.0
            
    def _parse_change(self, change_text: str) -> float:
        """Parse price change percentage from scraped text"""
        try:
            cleaned = change_text.replace('%', '').replace('+', '').replace('(', '').replace(')', '')
            return float(cleaned)
        except:
            return 0.0
            
    async def scrape_multiple_exchanges(self, exchanges: List[str] = None) -> List[ScrapedData]:
        """Scrape data from multiple exchanges concurrently"""
        if exchanges is None:
            exchanges = list(self.scraping_targets.keys())
            
        if not await self.initialize_browser():
            return []
            
        tasks = []
        for exchange in exchanges:
            task = asyncio.create_task(self.scrape_exchange_data(exchange))
            tasks.append(task)
            
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter successful results
        scraped_data = []
        for result in results:
            if isinstance(result, ScrapedData):
                scraped_data.append(result)
            elif isinstance(result, Exception):
                self.logger.error(f"Scraping error: {result}")
                
        await self.cleanup()
        return scraped_data
        
    async def get_aggregated_market_data(self) -> Dict[str, Any]:
        """Get aggregated market data from multiple sources"""
        scraped_data = await self.scrape_multiple_exchanges()
        
        if not scraped_data:
            return {
                'error': 'No data available from mobile scraping',
                'timestamp': datetime.now().isoformat()
            }
            
        # Calculate aggregated metrics
        prices = [data.price for data in scraped_data if data.price > 0]
        volumes = [data.volume for data in scraped_data if data.volume > 0]
        changes = [data.change_24h for data in scraped_data]
        
        return {
            'symbol': 'BTC/USDT',
            'avg_price': sum(prices) / len(prices) if prices else 0,
            'min_price': min(prices) if prices else 0,
            'max_price': max(prices) if prices else 0,
            'total_volume': sum(volumes) if volumes else 0,
            'avg_change_24h': sum(changes) / len(changes) if changes else 0,
            'sources': [data.source for data in scraped_data],
            'data_points': len(scraped_data),
            'timestamp': datetime.now().isoformat()
        }
        
    async def scrape_social_sentiment(self) -> Dict[str, Any]:
        """Scrape social sentiment from mobile-optimized sources"""
        sentiment_sources = {
            'twitter': 'https://mobile.twitter.com/search?q=%24BTC',
            'reddit': 'https://old.reddit.com/r/Bitcoin',
            'telegram': 'https://t.me/s/Bitcoin'
        }
        
        sentiment_data = {
            'positive': 0,
            'negative': 0,
            'neutral': 0,
            'total_mentions': 0,
            'timestamp': datetime.now().isoformat()
        }
        
        # This would require more sophisticated sentiment analysis
        # For now, return a placeholder structure
        return sentiment_data
        
    async def emergency_price_fetch(self) -> float:
        """Emergency price fetch using mobile scraping"""
        try:
            data = await self.scrape_exchange_data('binance')
            if data and data.price > 0:
                return data.price
                
            # Fallback to coinbase
            data = await self.scrape_exchange_data('coinbase')
            if data and data.price > 0:
                return data.price
                
            return 0.0
            
        except Exception as e:
            self.logger.error(f"Emergency price fetch failed: {e}")
            return 0.0
            
    async def cleanup(self):
        """Clean up browser resources"""
        if self.browser:
            await self.browser.close()
            self.browser = None

# Global scraper instance
mobile_scraper = MobileWebScraper()

async def get_fallback_market_data() -> Dict[str, Any]:
    """Get market data using mobile scraping fallback"""
    try:
        return await mobile_scraper.get_aggregated_market_data()
    except Exception as e:
        logging.error(f"Mobile scraping fallback failed: {e}")
        return {
            'error': 'All data sources unavailable',
            'timestamp': datetime.now().isoformat()
        }

if __name__ == "__main__":
    async def test_scraper():
        data = await mobile_scraper.get_aggregated_market_data()
        print(json.dumps(data, indent=2))
        
    asyncio.run(test_scraper())