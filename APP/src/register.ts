const modules = require('../modules.json');

modules.forEach((val:string) => {
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {};
    script.onerror = () => {
        console.log(`找不到${val}模块`);
    };
    script.src = process.env.NODE_ENV === 'development' ? `../${val}/app.js` : `../${val}/app.umd.js`;
    document.body.appendChild(script);
});
