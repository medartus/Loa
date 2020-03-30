let envs = {
    'API_ENDPOINT' : 'http://localhost'
};

if(process.env.ENVIRONMENT === 'prod'){
    envs ={
        'API_ENDPOINT' : 'https://loa-bot.herokuapp.com'
    }
}

module.exports = envs;
