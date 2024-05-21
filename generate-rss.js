import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import path from 'path';

const apiUrl = 'https://api.digikaladiscounts.com/items-history.json';
const rssPath = path.join(process.cwd(), 'rss.xml');

// Function to encode URL to Base64 using UTF-8 encoding
function encodeToBase64(url) {
    return Buffer.from(url).toString('base64');
}

// Function to generate affiliate link
function generateAffiliateLink(digikalaUrl) {
    const baseUrl = digikalaUrl.split('?')[0]; // Remove query parameters if any
    const base64Url = encodeToBase64(baseUrl);
    const affiliateLink = `https://dgkl.io/api/v1/Click/b/rGACB?b64=${base64Url}`;
    return affiliateLink;
}

async function generateRSS() {
    try {
        const response = await fetch(apiUrl);
        const items = await response.json();

        const rssItems = items.map(item => {
            const affiliateLink = generateAffiliateLink(`https://www.digikala.com/product/${item.Url.split('/')[2]}/`);
            return `
                <item>
                    <title>${item.Title}</title>
                    <link>${affiliateLink}</link>
                    <description>${item.Title} با ${item.DiscountPercent}% تخفیف.</description>
                    <pubDate>${new Date(item.Date).toUTCString()}</pubDate>
                </item>
            `;
        }).join('');

        const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>تخفیف های دیجی کالا</title>
        <link>https://digikaladiscounts.com</link>
        <description>بهترین تخفیف های دیجی کالا را در اینجا پیدا کنید. پیشنهادات ویژه و تخفیف های باور نکردنی برای خرید از دیجی کالا.</description>
        <language>fa</language>
        <pubDate>${new Date().toUTCString()}</pubDate>
        ${rssItems}
    </channel>
</rss>`;

        await fs.writeFile(rssPath, rssContent, 'utf8');
        console.log('RSS file generated successfully.');
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

generateRSS();
