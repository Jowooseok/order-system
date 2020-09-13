module.exports = {
    devIndicators: {
        autoPrerender: false,
    },
    exportTrailingSlash: true,
    exportPathMap: function () {
        return {
            '/': { page: '/' }
        };
    }
};