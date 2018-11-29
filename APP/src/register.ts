export default class Register {
  public modules: Set<string> = new Set(['', 'index']);
  /**
   * 检测模块是否加载，若未加载则动态加载
   * @param module 模块名
   */
  public async get(module: string) {
    if (!this.modules.has(module)) {
      await this.register(module);
    }
  }

  /**
   * 动态加载模块js
   * @param module 模块名
   */
  private register(module: string) {
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => {
        console.log(`${module}模块已加载`);
        this.modules.add(module);
        resolve();
      };
      script.onerror = () => {
        console.error(`找不到${module}模块`);
        this.modules.add(module);
        reject();
      };
      script.src =
        process.env.NODE_ENV === 'development'
          ? `../${module}/app.js?v=${new Date().getTime()}`
          : `../${module}/app.umd.js?v=${new Date().getTime()}`;
      document.body.appendChild(script);
    });
    return promise;
  }
}
