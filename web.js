/* eslint no-sync: 0 */

const fs = require('fs');

const restify = require('restify');

const random = (array) => array[Math.floor(Math.random() * array.length)];

const JSON_FILE_REGEX = /\.json$/;

const datasets = Object.assign({}, ...fs.readdirSync('data/')
    .filter((file) => file.match(JSON_FILE_REGEX))
    .map((file) => {

        return {
            [file.replace(JSON_FILE_REGEX, '')]:
                JSON.parse(fs.readFileSync(`data/${file}`, 'utf8'))};

    }));

const server = restify.createServer();

server.get('/:command', restify.bodyParser(), (req, res) => {

    if (datasets[req.params.command]) {

        return res.send({
            'attachments': [
                {
                    'fallback': req.params.command,
                    'image_url': random(datasets[req.params.command])
                }
            ],
            'response_type': 'in_channel'
        });

    }

    return res.send({
        'response_type': 'ephemeral',
        'text': `Whoops! No slash command was found for *${req.params.command}*.`
    });

});

server.listen(process.env.PORT);
