import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import path from 'path';

const apiUrl = 'https://api.digikaladiscounts.com/items-history.json';
const rssPath = path.join(process.cwd(), 'rss.xml');

async function generateRSS() {
    try {
        const response = await fetch(apiUrl);
        const items = await response.json();

        const rssItems = items.map(item => `
            <item>
                <title>${item.Title}</title>
                <link>https://digikala.com${item.Url}</link>
                <description>${item.Title} با ${item.DiscountPercent}% تخفیف.</description>
                <pubDate>${new Date(item.Date).toUTCString()}</pubDate>
            </item>
        `).join('');

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
