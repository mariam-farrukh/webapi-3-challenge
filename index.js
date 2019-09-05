const server = require('./server.js');

const port = 5001;
server.listen(port, () => console.log(`\n API on port ${port}\n`));