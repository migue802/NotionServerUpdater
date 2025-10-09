import {Client} from '@notionhq/client';
import si from 'systeminformation';
import {publicIpv4} from 'public-ip';

// Settings
var serverName = process.env.SERVER_NAME || "Test Entry";
var refreshPeriodSeconds = parseInt(process.env.REFRESH_PERIOD_SECONDS) || 30;
// --------------------------------

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

// Function to update server information
async function updateServerInfo() {
    try {
        console.log(`[${new Date().toISOString()}] Starting server info update...`);

        var databaseQuery = (await notion.search({
            query: "Servidores",
            filter: {property: "object", value: "data_source"}
        })).results[0];
        if (!databaseQuery) throw new Error("Database not found");
        console.log("Found DB: " + databaseQuery.title[0].plain_text + " (" + databaseQuery.id + ")");

        var devicePage = (await notion.dataSources.query({
            data_source_id: databaseQuery.id,
            filter: {
                property: "Server Name",
                rich_text: {equals: serverName}
            }
        })).results[0];
        if (!devicePage) throw new Error("Device page not found");
        console.log("Found Device Page: " + devicePage.properties["Server Name"].title[0].plain_text + " (" + devicePage.id + ")");

        var currentDate = new Date().toISOString();

        var systeminfo = await si.fsSize();
        console.log("System Info: ", systeminfo);
        
        let targetDisk = systeminfo[0];
        if (systeminfo.length > 1) {
            targetDisk = systeminfo.reduce((largest, current) => {
                if (current.mount === '/') {
                    return current;
                }
                return current.size > largest.size ? current : largest;
            });
        }

        var diskUsedPercentage = targetDisk.use / 100; // Convert to decimal because Notion expects a decimal for percentages
        console.log(`Using disk: ${targetDisk.mount} (${targetDisk.fs}) - ${targetDisk.use}% used`);

        var ip = await publicIpv4()
        console.log("IP Address: ", ip);

        await notion.pages.update({
            page_id: devicePage.id,
            properties: {
                "Last Updated": {
                    date: {start: currentDate}
                },
                "D. Usado": {
                    number: diskUsedPercentage
                },
                "IP": {
                    rich_text: [{type: "text", text: {content: ip}}]
                }
            }
        });

        console.log(`[${new Date().toISOString()}] Server info updated successfully!`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error updating server info:`, error.message);
    }
}

// Run the update function immediately
await updateServerInfo();

// Then run it every specified seconds
console.log(`Starting periodic updates every ${refreshPeriodSeconds} seconds...`);
setInterval(updateServerInfo, refreshPeriodSeconds * 1000);