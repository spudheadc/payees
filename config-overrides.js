const apiMocker = require('connect-api-mocker');
const { overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
    return {
        ...config,
        onBeforeSetupMiddleware: devServer => {
            //call cra before function to not break code
            config.onBeforeSetupMiddleware(devServer);
            //Then add our mocker url and folder
            devServer.app.use(apiMocker('/mocks', 'mocks'));
        },
    };
};

module.exports = {
    devServer: overrideDevServer(devServerConfig()),
};
