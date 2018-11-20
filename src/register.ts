const modules = require('./config/modules.json');
import axios from 'axios';

modules.forEach((val:string) => {
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {};
    script.onerror = () => {
        console.log(`找不到${val}模块`);
    };
    script.src = `/${val}/app.js`;
    document.body.appendChild(script);
});
