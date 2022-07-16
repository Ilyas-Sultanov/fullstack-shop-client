module.exports = { // если файл конфига является js файлом, а не json, то module.exports обязателен
    "extends": ["react-app"], // расширение конфига, идущего по умолчанию
    "overrides": [ // правила для typescript, пишутся в объекте overrides
        {
            "files": ["**/*.ts?(x)"],
            "rules": {
                // "react-hooks/exhaustive-deps": "off" // отключение wornings об отсутствующих зависимостях в хуках
            }
        }
    ]
};