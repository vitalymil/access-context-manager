
const main = async () => {
    try {
        const app = await require('./lib/app.js')();

        app.listen(8080, () => { console.log(`started listenning on port 8080... `) });
    }
    catch (error) {
        console.log(`failed initializing, got error: ${error}`);
        process.exit(1);
    }
}

main();
