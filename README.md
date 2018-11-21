# vue-micro-frontends-template

## Project setup
```
# 安装依赖
yarn setup
```

### Compiles and hot-reloads for development
```
# 首先启动主项目
yarn serve
# 根据需要启动子项目（每次只能启动一个子项目，方便查看日志）
yarn serve [name]
```

### Compiles and minifies for production
```
# 打包主项目
yarn build
# 打包子项目（可同时打包多个子项目，空格分隔项目名）
yarn build [name]
```

### 新增子项目（可一次新增多个子项目，用空格分隔项目名，自动安装依赖）
```
yarn gen [name]
```

### 删除子项目（可一次新增多个子项目，用空格分隔项目名，自动安装依赖）
```
yarn rm [name]
```

### 重命名子项目
```
yarn rename [oldName] [newName]
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
