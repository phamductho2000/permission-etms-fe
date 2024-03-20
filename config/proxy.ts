/**
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
    dev: {
        // localhost:8000/api/** -> http://localhost:8001/api/**
        '/api/': {
            target: 'http://localhost:8081',
            changeOrigin: true,
        },
    },
    // test: {
    //     '/api/': {
    //         target: '',
    //         changeOrigin: true,
    //         pathRewrite: {'^': ''},
    //     },
    // },
    // uat: {
    //     '/api/': {
    //         target: 'your pre url',
    //         changeOrigin: true,
    //         pathRewrite: {'^': ''},
    //     },
    // },
    // prod: {
    //     '/api/': {
    //         target: '',
    //         changeOrigin: true,
    //         pathRewrite: {'^': ''},
    //     },
    // },
};
